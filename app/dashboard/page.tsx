"use client";

import { useEffect, useState } from "react";

// Core components
import DashboardHeader from "@/components/dashboard/header";
import StatsOverview from "@/components/dashboard/stats-overview";
import ProfileCompletionCard from "@/components/dashboard/profile-completion-card";
import ScholarshipTabs from "@/components/dashboard/scholarship-tabs";
import type { DashboardScholarshipRecord } from "@/components/dashboard/scholarship-tabs";
import UserProfileCard from "@/components/dashboard/user-profile-card";
import QuickActionsCard from "@/components/dashboard/quick-actions-card";

// Context
import { useAuth } from "@/context/auth";
import {
  normalizeProfile,
  type ProfileDocument,
  type ScholarshipDocument,
} from "@/lib/documents";
import {
  buildScholarshipRecommendations,
  type RecommendedScholarship,
} from "@/lib/recommendations";

// Appwrite
import { Query } from "appwrite";
import { databaseId, databases } from "@/lib/appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const normalizedUser = user ? normalizeProfile(user as ProfileDocument) : null;
  const recommendationProfileKey = normalizedUser
    ? [
        normalizedUser.$id,
        normalizedUser.currentLevel,
        normalizedUser.country,
        normalizedUser.state,
        normalizedUser.courseOfStudy,
        normalizedUser.bio,
        normalizedUser.gpa,
        normalizedUser.scholarshipTypes.join("|"),
      ].join("::")
    : "";
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedScholarships, setSavedScholarships] = useState<
    DashboardScholarshipRecord[]
  >([]);
  const [applications, setApplications] = useState<DashboardScholarshipRecord[]>(
    []
  );
  const [recommendations, setRecommendations] = useState<
    RecommendedScholarship[]
  >([]);

  useEffect(() => {
    if (!normalizedUser?.$id) return;

    const fetchScholarships = async () => {
      try {
        // Fetch saved scholarships
        const savedRes = await databases.listDocuments(
          databaseId,
          "saved_scholarships",
          [
            Query.equal("profile", normalizedUser.$id),
            Query.equal("action", "save"),
          ]
        );
        setSavedScholarships(
          savedRes.documents as unknown as DashboardScholarshipRecord[]
        );

        // Fetch applications
        const appliedRes = await databases.listDocuments(
          databaseId,
          "saved_scholarships",
          [
            Query.equal("profile", normalizedUser.$id),
            Query.equal("action", "apply"),
          ]
        );
        setApplications(
          appliedRes.documents as unknown as DashboardScholarshipRecord[]
        );

        // Fetch active scholarships, then score them against the student's profile.
        const recommendedRes = await databases.listDocuments(
          databaseId,
          "scholarships",
          [Query.equal("status", ["active"]), Query.limit(100)]
        );

        const excludedScholarshipIds = new Set(
          [...savedRes.documents, ...appliedRes.documents]
            .map((document) => String(document.scholarship?.$id || document.scholarship || ""))
            .filter(Boolean)
        );

        const recommendedScholarships = buildScholarshipRecommendations(
          normalizedUser,
          recommendedRes.documents as ScholarshipDocument[]
        ).filter((scholarship) => !excludedScholarshipIds.has(scholarship.$id));

        setRecommendations(recommendedScholarships);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      }
    };

    fetchScholarships();
  }, [recommendationProfileKey]);

  if (authLoading) {
    return <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900" />;
  }

  if (!normalizedUser) {
    return (
      <>
        <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy/10">
                <User className="h-7 w-7 text-navy dark:text-gold" />
              </div>
              <CardTitle>Sign in to access your dashboard</CardTitle>
              <CardDescription>
                Track saved scholarships, applications, and personalized recommendations in one place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-navy hover:bg-navy/90 text-white"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultView="login"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header */}
        <DashboardHeader firstName={normalizedUser?.firstName || "Scholar"} />

        {/* Stats Overview */}
        <StatsOverview
          savedCount={savedScholarships.length}
          applicationsCount={applications.length}
          profileCompletion={normalizedUser?.profileCompletion || 0}
        />

        {/* Profile Completion */}
        {normalizedUser && normalizedUser.profileCompletion < 100 && (
          <ProfileCompletionCard
            profileCompletion={normalizedUser.profileCompletion}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ScholarshipTabs
              savedScholarships={savedScholarships}
              recommendations={recommendations}
              applications={applications}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UserProfileCard user={normalizedUser} />
            <QuickActionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
