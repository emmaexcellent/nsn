import { Calendar, DollarSign, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { Badge } from "../ui/badge";
import CountdownTimer from "./countdown-timer";
import { Models } from "appwrite";

interface ScholarshipCardProps {
  scholarship: Models.Document;
  variant?: "default" | "featured";
  animationDelay?: number;
  className?: string;
}

export function ScholarshipCard({
  scholarship,
  variant = "default",
  animationDelay = 0,
  className = "",
}: ScholarshipCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Card
      className={`group border shadow hover:shadow-lg dark:shadow-white/50 dark:hover:shadow-white/50 transition-all duration-300 ${
        isFeatured ? "hover:-translate-y-2 shadow-lg" : "hover:-translate-y-1"
      } animate-fade-in ${className}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardHeader className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge
              variant="secondary"
              className="bg-navy/10 text-navy dark:bg-gold/10 dark:text-gold"
            >
              {scholarship.category}
            </Badge>
            {!isFeatured && scholarship.level && (
              <Badge variant="outline" className="text-xs">
                {scholarship.level}
              </Badge>
            )}
            {isFeatured && (
              <Badge variant="outline" className="text-xs">
                {scholarship.location}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle
          className={`group-hover:text-navy dark:group-hover:text-gold transition-colors text-xl`}
        >
          {scholarship.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription
          className={`text-gray-600 dark:text-gray-400 line-clamp-2`}
        >
          {scholarship.description}
        </CardDescription>

        {isFeatured ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Deadline
              </span>
              <span className="font-semibold text-red-600">
                {scholarship.deadline
                  ? new Date(scholarship.deadline).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not Specified"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              {scholarship.deadline && (
                <CountdownTimer
                  deadline={scholarship.deadline}
                  variant="compact"
                />
              )}
            </div>
            <div className="flex items-center justify-between text-sm pb-2">
              <span className="flex items-center text-gray-500">
                <DollarSign className="h-4 w-4 mr-1" />
                Award Amount
              </span>
              <span className="font-semibold text-green-600">
                {scholarship.currency || "NGN"} {scholarship.amount}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Deadline
                </div>
                <div>
                  <span className="font-semibold text-xs text-red-500">
                    {scholarship.deadline
                      ? new Date(scholarship.deadline).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Not Specified"}
                  </span>
                </div>
                {scholarship.deadline && (
                  <CountdownTimer
                    deadline={scholarship.deadline}
                    variant="badge"
                    className="mt-1"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center text-gray-500">
              <DollarSign className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Amount
                </div>
                <div className="text-green-600">{scholarship.amount}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Country
                </div>
                <div>{scholarship.country}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Sponsor
                </div>
                <div className="line-clamp-1">{scholarship.sponsor}</div>
              </div>
            </div>
          </div>
        )}

        <div className={`pt-2 border-t border-gray-200 dark:border-gray-700`}>
          {!isFeatured && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              <span className="font-medium">Eligibility:</span>{" "}
              {scholarship.eligibility}
            </p>
          )}
          <Link href={`/scholarships/${scholarship.$id}`}>
            <Button
              className={`w-full bg-navy hover:bg-navy/90 text-white group-hover:bg-gold group-hover:text-navy transition-all ${
                isFeatured ? "mt-2" : ""
              }`}
            >
              {isFeatured ? "View Details" : "View Details & Apply"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
