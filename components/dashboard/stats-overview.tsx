import { Card, CardContent } from "@/components/ui/card";
import { Heart, FileText, Target } from "lucide-react";

interface StatsOverviewProps {
  savedCount: number;
  applicationsCount: number;
  profileCompletion: number;
}

export default function StatsOverview({
  savedCount,
  applicationsCount,
  profileCompletion,
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Saved Scholarships
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {savedCount}
              </p>
            </div>
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Applications
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applicationsCount}
              </p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Profile Completion
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {profileCompletion}%
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
