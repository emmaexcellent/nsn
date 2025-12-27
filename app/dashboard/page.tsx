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

// Appwrite
import { Models, Query } from "appwrite";
import { databaseId, databases } from "@/lib/appwrite";

export default function DashboardPage() {
  const { user } = useAuth();
  const [savedScholarships, setSavedScholarships] = useState<Models.Document[]>(
    []
  );
  const [applications, setApplications] = useState<Models.Document[]>([]);
  const [recommendations, setRecommendations] = useState<Models.Document[]>([]);

  useEffect(() => {
    if (!user?.$id) return;

    const fetchScholarships = async () => {
      try {
        // Fetch saved scholarships
        const savedRes = await databases.listDocuments(
          databaseId,
          "saved_scholarships",
          [Query.equal("profile", user.$id), Query.equal("action", "save")]
        );
        setSavedScholarships(savedRes.documents);

        // Fetch applications
        const appliedRes = await databases.listDocuments(
          databaseId,
          "saved_scholarships",
          [Query.equal("profile", user.$id), Query.equal("action", "apply")]
        );
        setApplications(appliedRes.documents);

        // Fetch recommendations based on user data
        const recommendationQueries = [
          Query.limit(5), // Default limit
        ];
        if (user?.currentLevel)
          recommendationQueries.push(Query.equal("level", user.currentLevel));
        const recommendedRes = await databases.listDocuments(
          databaseId,
          "scholarships",
          recommendationQueries
        );

        setRecommendations(recommendedRes.documents);
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      }
    };

    fetchScholarships();
  }, [user?.$id]);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header */}
        <DashboardHeader firstName={user?.firstName} />

        {/* Stats Overview */}
        <StatsOverview
          savedCount={savedScholarships.length}
          applicationsCount={applications.length}
          profileCompletion={user?.profileCompletion || 0}
        />

        {/* Profile Completion */}
        {user && user?.profileCompletion < 100 && (
          <ProfileCompletionCard profileCompletion={user.profileCompletion} />
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
            <UserProfileCard user={user} />
            <QuickActionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
