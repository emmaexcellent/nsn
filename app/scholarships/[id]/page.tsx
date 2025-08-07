"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Calendar, DollarSign, MapPin, Users, FileText, ExternalLink, Share2, Clock } from "lucide-react"
import { CountdownTimer } from "@/components/countdown-timer"
import { BookmarkButton } from "@/components/bookmark-button"

export default function ScholarshipDetailPage({ params }: { params: { id: string } }) {
  // Mock data - in real app, fetch based on params.id
  const scholarship = {
    id: 1,
    title: "Gates Millennium Scholars Program",
    description:
      "The Gates Millennium Scholars (GMS) Program, funded by a grant from the Bill & Melinda Gates Foundation, was established in 1999 to provide outstanding African American, American Indian/Alaska Native, Asian Pacific Islander American, and Hispanic American students with an opportunity to complete an undergraduate college education, in any discipline they choose.",
    fullDescription: `The Gates Millennium Scholars Program is a comprehensive scholarship program that not only provides full funding for undergraduate education but also extends support for graduate studies in specific fields. The program aims to reduce financial barriers for students from underrepresented ethnic minority groups and encourage them to pursue higher education and leadership roles in their communities.

    Key features of the program include:
    • Full tuition, fees, room, board, and other educational expenses
    • Mentorship and leadership development opportunities
    • Access to a supportive community of scholars
    • Graduate school funding for specific fields (computer science, education, engineering, library science, mathematics, public health, or science)
    • Ongoing support throughout the academic journey`,
    deadline: "January 15, 2025",
    amount: "$50,000+",
    category: "Merit-Based",
    country: "USA",
    level: "Graduate",
    eligibility: "Minority students with high academic achievement",
    sponsor: "Bill & Melinda Gates Foundation",
    website: "https://www.thegatesscholarship.org/",
    saved: false,
    requirements: [
      "Must be African American, American Indian/Alaska Native, Asian Pacific Islander American, or Hispanic American",
      "Must be a U.S. citizen, national, or permanent resident",
      "Must have a minimum cumulative weighted GPA of 3.3 on a 4.0 scale",
      "Must demonstrate leadership abilities through participation in community service, extracurricular, or other activities",
      "Must meet Federal Pell Grant eligibility criteria",
      "Must be enrolling for the first time at a U.S. accredited four-year college or university as a full-time, degree-seeking freshman in the fall",
    ],
    documents: [
      "Completed online application",
      "Official high school transcript",
      "SAT or ACT scores",
      "Two letters of recommendation",
      "Personal statement essays",
      "FAFSA (Free Application for Federal Student Aid)",
      "Tax returns and financial documents",
    ],
    timeline: [
      { date: "January 15, 2025", event: "Application deadline" },
      { date: "March 2025", event: "Semi-finalist notification" },
      { date: "April 2025", event: "Finalist interviews" },
      { date: "May 2025", event: "Final selections announced" },
      { date: "September 2025", event: "Scholarship begins" },
    ],
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/scholarships">
            <Button variant="ghost" className="text-navy dark:text-gold hover:bg-navy/10 dark:hover:bg-gold/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scholarships
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-navy/10 text-navy dark:bg-gold/10 dark:text-gold">
                  {scholarship.category}
                </Badge>
                <Badge variant="outline">{scholarship.level}</Badge>
                <Badge variant="outline">{scholarship.country}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{scholarship.title}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">{scholarship.description}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center space-y-2">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <div className="text-sm text-gray-500">Deadline</div>
                  <div className="font-semibold text-red-600">{scholarship.deadline}</div>
                  <CountdownTimer deadline={scholarship.deadline} variant="badge" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-semibold text-green-600">{scholarship.amount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-semibold">{scholarship.country}</div>
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
                  {scholarship.fullDescription}
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
                  {scholarship.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-navy dark:bg-gold rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                    </li>
                  ))}
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
                  {scholarship.documents.map((document, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">{document}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Application Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scholarship.timeline.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-navy dark:bg-gold rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-white dark:text-navy" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">{item.date}</div>
                        <div className="text-gray-600 dark:text-gray-400">{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Apply Now</CardTitle>
                <CardDescription>Don't miss this opportunity - deadline is approaching!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button className="w-full bg-navy hover:bg-navy/90 text-white" size="lg">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply on Official Website
                  </Button>
                  <BookmarkButton
                    scholarshipId={scholarship.id}
                    initialBookmarked={scholarship.saved}
                    variant="bookmark"
                    showLabel={true}
                    className="w-full justify-center"
                  />
                  <Button variant="outline" className="w-full bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share with Friends
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sponsor:</span>
                    <span className="font-medium">{scholarship.sponsor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Website:</span>
                    <a
                      href={scholarship.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy dark:text-gold hover:underline"
                    >
                      Official Site
                    </a>
                  </div>
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
                    Begin your application at least 2-3 months before the deadline to ensure quality.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Personal Statement</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Write a compelling personal statement that showcases your unique story and aspirations.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Letters of Recommendation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose recommenders who know you well and can speak to your achievements and potential.
                  </p>
                </div>
                <Link href="/blog">
                  <Button variant="ghost" className="w-full text-navy dark:text-gold">
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
                  <Link href="/scholarships/2" className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded">
                    <h4 className="font-medium text-sm">Rhodes Scholarship</h4>
                    <p className="text-xs text-gray-500">Full funding for Oxford</p>
                  </Link>
                  <Link href="/scholarships/3" className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded">
                    <h4 className="font-medium text-sm">Fulbright Program</h4>
                    <p className="text-xs text-gray-500">International exchange</p>
                  </Link>
                  <Link href="/scholarships/4" className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded">
                    <h4 className="font-medium text-sm">Chevening Scholarships</h4>
                    <p className="text-xs text-gray-500">UK government funding</p>
                  </Link>
                </div>
                <Link href="/scholarships">
                  <Button variant="ghost" className="w-full text-navy dark:text-gold">
                    View All Scholarships
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
