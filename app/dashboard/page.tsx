"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import {
  Heart,
  Calendar,
  Award,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  BookOpen,
  Users,
  Bell,
  Settings,
  Plus,
} from "lucide-react"
import { ApplicationTracker } from "@/components/application-tracker"
import { CountdownTimer } from "@/components/countdown-timer"

export default function DashboardPage() {
  const [user] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "/placeholder.svg?height=100&width=100",
    memberSince: "September 2024",
    profileCompletion: 85,
  })

  const savedScholarships = [
    {
      id: 1,
      title: "Gates Millennium Scholars Program",
      deadline: "January 15, 2025",
      amount: "$50,000+",
      status: "saved",
      daysLeft: 28,
    },
    {
      id: 2,
      title: "Rhodes Scholarship",
      deadline: "October 1, 2024",
      amount: "Full Funding",
      status: "applied",
      daysLeft: -45,
    },
    {
      id: 3,
      title: "Fulbright Program",
      deadline: "March 31, 2025",
      amount: "$30,000",
      status: "saved",
      daysLeft: 103,
    },
  ]

  const applications = [
    {
      id: 1,
      scholarship: "Rhodes Scholarship",
      status: "submitted",
      submittedDate: "September 25, 2024",
      nextStep: "Interview selection",
      progress: 75,
    },
    {
      id: 2,
      scholarship: "Chevening Scholarships",
      status: "in-progress",
      submittedDate: null,
      nextStep: "Complete personal statement",
      progress: 40,
    },
    {
      id: 3,
      scholarship: "DAAD Scholarships",
      status: "accepted",
      submittedDate: "August 15, 2024",
      nextStep: "Complete enrollment",
      progress: 100,
    },
  ]

  const recommendations = [
    {
      id: 4,
      title: "Australia Awards",
      match: 92,
      reason: "Matches your field of study and academic profile",
      deadline: "February 28, 2025",
    },
    {
      id: 5,
      title: "Schwarzman Scholars",
      match: 88,
      reason: "Perfect fit for your leadership experience",
      deadline: "September 15, 2025",
    },
    {
      id: 6,
      title: "Knight-Hennessy Scholars",
      match: 85,
      reason: "Aligns with your career goals and background",
      deadline: "October 10, 2024",
    },
  ]

  const recentActivity = [
    { action: "Saved", item: "Gates Millennium Scholars", time: "2 hours ago" },
    { action: "Applied to", item: "Rhodes Scholarship", time: "3 days ago" },
    { action: "Viewed", item: "Fulbright Program", time: "1 week ago" },
    { action: "Updated", item: "Profile information", time: "1 week ago" },
  ]

  const upcomingDeadlines = savedScholarships
    .filter((s) => s.daysLeft > 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "saved":
        return "bg-blue-100 text-blue-800"
      case "applied":
        return "bg-green-100 text-green-800"
      case "submitted":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-orange-100 text-orange-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "saved":
        return <Heart className="h-4 w-4" />
      case "applied":
        return <CheckCircle className="h-4 w-4" />
      case "submitted":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <FileText className="h-4 w-4" />
      case "accepted":
        return <Award className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name}!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your scholarship journey and discover new opportunities
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Saved Scholarships</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{savedScholarships.length}</p>
                </div>
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Applications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Profile Completion</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.profileCompletion}%</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">33%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion */}
        {user.profileCompletion < 100 && (
          <Card className="mb-8 border-gold/20 bg-gold/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Complete Your Profile</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    A complete profile helps us recommend better scholarship matches
                  </p>
                </div>
                <Button className="bg-gold hover:bg-gold/90 text-navy">Complete Profile</Button>
              </div>
              <Progress value={user.profileCompletion} className="h-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {user.profileCompletion}% complete - Add your academic achievements and career goals
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="tracker" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tracker">Application Tracker</TabsTrigger>
                <TabsTrigger value="saved">Saved Scholarships</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
              </TabsList>

              <TabsContent value="tracker">
                <ApplicationTracker />
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Saved Scholarships</h3>
                  <Link href="/scholarships">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Find More
                    </Button>
                  </Link>
                </div>
                {savedScholarships.map((scholarship) => (
                  <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{scholarship.title}</h4>
                            <Badge className={getStatusColor(scholarship.status)}>
                              {getStatusIcon(scholarship.status)}
                              <span className="ml-1 capitalize">{scholarship.status}</span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Calendar className="h-4 w-4 mr-2" />
                              {scholarship.deadline}
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Award className="h-4 w-4 mr-2" />
                              {scholarship.amount}
                            </div>
                          </div>
                          {scholarship.daysLeft > 0 && (
                            <div className="mt-2">
                              <CountdownTimer deadline={scholarship.deadline} variant="badge" />
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/scholarships/${scholarship.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          <Button size="sm" className="bg-navy hover:bg-navy/90 text-white">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <h3 className="text-lg font-semibold">Recommended for You</h3>
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                            <Badge className="bg-green-100 text-green-800">{rec.match}% match</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{rec.reason}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            Deadline: {rec.deadline}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Link href={`/scholarships/${rec.id}`}>
                            <Button size="sm" className="bg-navy hover:bg-navy/90 text-white">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="deadlines" className="space-y-4">
                <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
                <div className="grid gap-4">
                  {upcomingDeadlines.map((scholarship) => (
                    <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{scholarship.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Deadline: {scholarship.deadline}</p>
                          </div>
                          <div className="text-right space-y-2">
                            <CountdownTimer deadline={scholarship.deadline} variant="detailed" />
                            <Link href={`/scholarships/${scholarship.id}`}>
                              <Button size="sm" className="bg-navy hover:bg-navy/90 text-white">
                                Apply Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image src={user.avatar || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Member since {user.memberSince}</p>
                <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingDeadlines.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{scholarship.title}</p>
                      <p className="text-xs text-gray-500">{scholarship.deadline}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        scholarship.daysLeft <= 30 ? "border-red-500 text-red-600" : "border-green-500 text-green-600"
                      }
                    >
                      {scholarship.daysLeft}d
                    </Badge>
                  </div>
                ))}
                {upcomingDeadlines.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-navy dark:bg-gold rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.action}</span> {activity.item}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/scholarships">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Scholarships
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Application Tips
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Connect with Mentors
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
