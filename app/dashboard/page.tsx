"use client";

import { useEffect, useState } from "react";

// Core components
import DashboardHeader from "@/components/dashboard/header";
import StatsOverview from "@/components/dashboard/stats-overview";
import ProfileCompletionCard from "@/components/dashboard/profile-completion-card";
import ScholarshipTabs from "@/components/dashboard/scholarship-tabs";
import UserProfileCard from "@/components/dashboard/user-profile-card";
import QuickActionsCard from "@/components/dashboard/quick-actions-card";

// Context
import { useAuth } from "@/context/auth";
import {
  normalizeProfile,
  normalizeScholarship,
  type ProfileDocument,
  type ScholarshipDocument,
} from "@/lib/documents";

// Appwrite
import { Models, Query } from "appwrite";
import { databaseId, databases } from "@/lib/appwrite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const normalizedUser = user ? normalizeProfile(user as ProfileDocument) : null;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedScholarships, setSavedScholarships] = useState<Models.Document[]>(
    []
  );
  const [applications, setApplications] = useState<Models.Document[]>([]);
  const [recommendations, setRecommendations] = useState<Models.Document[]>([]);

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
        setSavedScholarships(savedRes.documents);

        // Fetch applications
        const appliedRes = await databases.listDocuments(
          databaseId,
          "saved_scholarships",
          [
            Query.equal("profile", normalizedUser.$id),
            Query.equal("action", "apply"),
          ]
        );
        setApplications(appliedRes.documents);

        // Fetch recommendations based on user data
        const recommendationQueries = [
          Query.limit(5), // Default limit
        ];
        if (normalizedUser.currentLevel) {
          recommendationQueries.push(
            Query.equal("level", normalizedUser.currentLevel)
          );
        }
        const recommendedRes = await databases.listDocuments(
          databaseId,
          "scholarships",
          recommendationQueries
        );

        setRecommendations(
          recommendedRes.documents.map((document) =>
            normalizeScholarship(document as ScholarshipDocument)
          )
        );
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      }
    };

    fetchScholarships();
  }, [normalizedUser?.$id, normalizedUser?.currentLevel]);

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
