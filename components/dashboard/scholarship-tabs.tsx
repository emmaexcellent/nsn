import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import ScholarshipCard from "./scholarship-card";
import { Models } from "appwrite";

interface ScholarshipTabsProps {
  savedScholarships: Models.DefaultDocument[];
  recommendations: Models.DefaultDocument[];
  applications: Models.DefaultDocument[];
}
export default function ScholarshipTabs({
  savedScholarships,
  recommendations,
  applications,
}: ScholarshipTabsProps) {
  console.log(savedScholarships);

  return (
    <Tabs defaultValue="saved" className="w-full overflow-x-auto">
      <TabsList className="flex w-full overflow-x-auto whitespace-nowrap scrollbar-hide gap-3 md:gap-8 !px-5">
        <TabsTrigger value="saved">Saved</TabsTrigger>
        <TabsTrigger value="deadlines">Applied</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>

      <TabsContent value="saved" className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Saved Scholarships</h3>
          <Link href="/scholarships">
            <Button variant="outline" size="sm">
              <Plus className="h-3 w-3 mr-2" />
              Find More
            </Button>
          </Link>
        </div>
        {savedScholarships.map((saved) => (
          <ScholarshipCard
            key={saved.scholarship.$id}
            scholarship={{
              id: saved.scholarship.$id,
              title: saved.scholarship.title,
              deadline: saved.scholarship.deadline,
              amount: `${saved.scholarship.currency || "$"} ${
                saved.scholarship.amount
              }`,
              status: "saved",
              daysLeft: saved.scholarship.deadline,
              match: saved.scholarship.match,
              reason: saved.scholarship.reason,
            }}
            showCountdown={true}
          />
        ))}
      </TabsContent>

      <TabsContent value="recommendations" className="space-y-4">
        <h3 className="text-lg font-semibold">Recommended for You</h3>
        {recommendations.map((rec) => (
          <ScholarshipCard
            key={rec.$id}
            scholarship={{
              id: rec.$id,
              title: rec.title,
              deadline: rec.deadline,
              amount: "",
              status: "recommended",
              daysLeft: 0,
              match: rec.match,
              reason: rec.reason,
            }}
            showCountdown={false}
          />
        ))}
      </TabsContent>

      <TabsContent value="deadlines" className="space-y-4">
        <h3 className="text-lg font-semibold">Applied</h3>
        {applications.map((applied) => (
          <ScholarshipCard
            key={applied.scholarship.$id}
            scholarship={{
              id: applied.scholarship.$id,
              title: applied.scholarship.title,
              deadline: applied.scholarship.deadline,
              amount: `${applied.scholarship.currency || "$"} ${
                applied.scholarship.amount
              }`,
              status: "applied",
              daysLeft: applied.scholarship.deadline,
            }}
            showCountdown={true}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
}
