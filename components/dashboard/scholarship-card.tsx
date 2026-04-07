import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Award } from "lucide-react";
import Link from "next/link";
import StatusBadge from "./status-badge";
import { CountdownTimer } from "../countdown-timer";

interface ScholarshipCardProps {
  scholarship: {
    id: string;
    title: string;
    deadline: string;
    amount: string;
    status: string;
    daysLeft: number;
    match?: number;
    reason?: string;
  };
  showCountdown: boolean;
}

export default function ScholarshipCard({
  scholarship,
  showCountdown,
}: ScholarshipCardProps) {

    const today = new Date();
    const deadlineDate = new Date(scholarship.deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const displayDaysLeft = daysLeft >= 0 ? daysLeft : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="w-full">
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="w-full font-semibold text-gray-900 dark:text-white line-clamp-2 sm:w-auto">
                {scholarship.title}
              </h4>
              <StatusBadge status={scholarship.status} />
            </div>

            <div className="grid grid-cols-1 gap-3 py-3 text-xs sm:grid-cols-2">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-3 w-3 mr-2" />
                {displayDaysLeft === 0
                  ? "Deadline Reached"
                  : `${displayDaysLeft} days left`}
              </div>
              {scholarship.amount && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Award className="h-3 w-3 mr-2" />
                  {scholarship.amount}
                </div>
              )}
            </div>

            {showCountdown && displayDaysLeft === 0 && (
              <CountdownTimer deadline={scholarship.deadline} />
            )}
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row md:mt-0 md:w-auto">
            <Link href={`/scholarships/${scholarship.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
            {scholarship.status !== "applied" && (
              <Link href={`/scholarships/${scholarship.id}`} className="w-full">
                <Button
                  size="sm"
                  className="w-full bg-navy hover:bg-navy/90 text-white"
                >
                  Apply Now
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
