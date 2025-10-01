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
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="w-full">
            <div className="flex items-center gap-3 space-x-2 mb-2">
              <h4 className="w-full font-semibold text-gray-900 dark:text-white line-clamp-2">
                {scholarship.title}
              </h4>
              <StatusBadge status={scholarship.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs py-3">
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

          <div className="w-full flex justify-end space-x-2 mt-5 md:mt-0">
            <Link href={`/scholarships/${scholarship.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            {scholarship.status !== "applied" && (
              <Button size="sm" className="bg-navy hover:bg-navy/90 text-white">
                Apply Now
              </Button>
            )}
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
