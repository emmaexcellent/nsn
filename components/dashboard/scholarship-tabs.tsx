import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ScholarshipCard from "./scholarship-card";
import { Models } from "appwrite";
import type { RecommendedScholarship } from "@/lib/recommendations";

type ScholarshipRelation = {
  $id: string;
  title?: string;
  deadline?: string;
  amount?: number | string;
  currency?: string;
  match?: number;
  reason?: string;
};

export type DashboardScholarshipRecord = Models.Document & {
  scholarship: ScholarshipRelation;
};

interface ScholarshipTabsProps {
  savedScholarships: DashboardScholarshipRecord[];
  recommendations: RecommendedScholarship[];
  applications: DashboardScholarshipRecord[];
}
export default function ScholarshipTabs({
  savedScholarships,
  recommendations,
  applications,
}: ScholarshipTabsProps) {
  const EmptyState = ({
    title,
    description,
    actionLabel,
    href,
  }: {
    title: string;
    description: string;
    actionLabel: string;
    href: string;
  }) => (
    <div className="rounded-xl border border-dashed bg-white p-6 text-center dark:bg-gray-950">
      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </h4>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <Link href={href} className="mt-4 inline-flex">
        <Button variant="outline" size="sm">
          {actionLabel}
        </Button>
      </Link>
    </div>
  );

  return (
    <Tabs defaultValue="saved" className="w-full overflow-x-auto">
      <TabsList className="flex w-full justify-start gap-2 overflow-x-auto whitespace-nowrap !px-2 scrollbar-hide sm:gap-3 md:gap-6">
        <TabsTrigger value="saved">Saved</TabsTrigger>
        <TabsTrigger value="deadlines">Applied</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>

      <TabsContent value="saved" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold">Saved Scholarships</h3>
          <Link href="/scholarships">
            <Button variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-2" />
              Find More
            </Button>
          </Link>
        </div>
        {savedScholarships.length === 0 ? (
          <EmptyState
            title="No saved scholarships yet"
            description="Save scholarships you want to revisit so they are easy to track from your dashboard."
            actionLabel="Browse Scholarships"
            href="/scholarships"
          />
        ) : (
          savedScholarships.map((saved) => (
            <ScholarshipCard
              key={saved.scholarship.$id}
              scholarship={{
                id: saved.scholarship.$id,
                title: saved.scholarship.title || "Saved scholarship",
                deadline: saved.scholarship.deadline || "",
                amount: `${saved.scholarship.currency || "$"} ${
                  saved.scholarship.amount || 0
                }`,
                status: "saved",
                daysLeft: 0,
                match: saved.scholarship.match,
                reason: saved.scholarship.reason,
              }}
              showCountdown={true}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-4">
        <h3 className="text-lg font-semibold">Recommended for You</h3>
        {recommendations.length === 0 ? (
          <EmptyState
            title="Recommendations will improve with your profile"
            description="Add more academic and preference details to unlock more relevant scholarship matches."
            actionLabel="Update Profile"
            href="/profile"
          />
        ) : (
          recommendations.map((rec) => (
            <ScholarshipCard
              key={rec.$id}
              scholarship={{
                id: rec.$id,
                title: rec.title || "Scholarship opportunity",
                deadline: rec.deadline || "",
                amount: `${rec.currency || "USD"} ${rec.amount || 0}`,
                status: "recommended",
                daysLeft: 0,
                match: rec.match,
                reason: rec.reason,
              }}
              showCountdown={false}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="deadlines" className="space-y-4">
        <h3 className="text-lg font-semibold">Applied</h3>
        {applications.length === 0 ? (
          <EmptyState
            title="No applications tracked yet"
            description="When you apply for a scholarship, confirm it and it will appear here for easy follow-up."
            actionLabel="Explore Scholarships"
            href="/scholarships"
          />
        ) : (
          applications.map((applied) => (
            <ScholarshipCard
              key={applied.scholarship.$id}
              scholarship={{
                id: applied.scholarship.$id,
                title: applied.scholarship.title || "Applied scholarship",
                deadline: applied.scholarship.deadline || "",
                amount: `${applied.scholarship.currency || "$"} ${
                  applied.scholarship.amount || 0
                }`,
                status: "applied",
                daysLeft: 0,
              }}
              showCountdown={true}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
