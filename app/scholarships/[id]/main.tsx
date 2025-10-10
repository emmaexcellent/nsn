"use client";

import {  Models } from "appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  FileText,
  ExternalLink,
} from "lucide-react";
import { CountdownTimer } from "@/components/countdown-timer";
import { Separator } from "@/components/ui/separator";
import { BookmarkButton } from "@/components/bookmark-button";
import { useAuth } from "@/context/auth";
import ShareButton from "@/components/schorlarships/share-scholarship";

export default function ScholarshipDetailMain({
  similarScholarships,
  scholarship,
}: {
  similarScholarships?: Models.DefaultDocument[];
  scholarship: Models.DefaultDocument;
}) {
  const { user } = useAuth();
  if (!scholarship) return null;

  const handleApplyScholarship = () => {
    localStorage.setItem(
      "recent_applied_scholarship",
      JSON.stringify(scholarship)
    );
    window.open(scholarship.link, "_blank");
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/scholarships">
            <Button
              variant="ghost"
              className="text-navy dark:text-gold hover:bg-navy/10 dark:hover:bg-gold/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scholarships
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-navy/10 text-navy dark:bg-gold/10 dark:text-gold"
                >
                  {scholarship.category}
                </Badge>
                <Badge variant="outline">{scholarship.level}</Badge>
                <Badge variant="outline">{scholarship.location}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {scholarship.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {scholarship.description}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center space-y-2">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <div className="text-sm text-gray-500">Deadline</div>
                  <div className="font-semibold text-red-600">
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
                  </div>
                  <CountdownTimer
                    deadline={scholarship.deadline}
                    variant="badge"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-semibold text-green-600">
                    ${scholarship.amount}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-semibold">{scholarship.location}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm text-gray-500">Level</div>
                  <div className="font-semibold">{scholarship.level}</div>
                </CardContent>
              </Card>
            </div>

            {/* Full Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Scholarship</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {scholarship.about}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scholarship.eligibility?.map(
                    (req: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-navy dark:bg-gold rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {req.trim()}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scholarship.required?.map((doc: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {doc.trim()}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="sticky bottom-0">
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
                <CardDescription>
                  Don&apos;t miss this opportunity - deadline is approaching!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    className="w-full bg-navy hover:bg-navy/90 text-white"
                    size="lg"
                    onClick={handleApplyScholarship}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply on Official Website
                  </Button>

                  <BookmarkButton
                    scholarshipId={scholarship.$id}
                    profileId={user?.$id}
                    variant="bookmark"
                    showLabel={true}
                    className="w-full justify-center"
                  />
                  <ShareButton />
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sponsor:</span>
                    <span className="font-medium">{scholarship.sponsor}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-500">Website:</span>
                    <a
                      href={scholarship.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy dark:text-gold hover:underline"
                    >
                      Official Site
                    </a>
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle>Application Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Start Early</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Begin your application at least 2-3 months before the
                    deadline to ensure quality.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Personal Statement</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Write a compelling personal statement that showcases your
                    unique story and aspirations.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Letters of Recommendation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose recommenders who know you well and can speak to your
                    achievements and potential.
                  </p>
                </div>
                <Link href="/blog">
                  <Button
                    variant="ghost"
                    className="w-full text-navy dark:text-gold mt-5"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    More Application Tips
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Related Scholarships */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Scholarships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {similarScholarships &&
                    similarScholarships.map((sch) => (
                      <Link
                        key={sch.$id}
                        href={`/scholarships/${sch.$id}`}
                        className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                      >
                        <h4 className="font-medium text-sm">{sch.title}</h4>
                        <p className="text-xs text-gray-500">
                          {sch.description}
                        </p>
                      </Link>
                    ))}
                </div>
                <Link href="/scholarships">
                  <Button
                    variant="ghost"
                    className="w-full text-navy dark:text-gold mt-5"
                  >
                    View All Scholarships
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
