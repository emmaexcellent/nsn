"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CountdownTimer } from "./countdown-timer"
import Link from "next/link"
import { CheckCircle, Clock, AlertCircle, FileText, Award, Plus, Eye, Edit } from "lucide-react"

interface Application {
  id: number
  scholarshipTitle: string
  scholarshipId: number
  status: "draft" | "in-progress" | "submitted" | "under-review" | "accepted" | "rejected"
  deadline: string
  submittedDate?: string
  progress: number
  nextStep: string
  amount: string
  requirements: string[]
  completedRequirements: string[]
  notes?: string
}

export function ApplicationTracker() {
  const [applications] = useState<Application[]>([
    {
      id: 1,
      scholarshipTitle: "Gates Millennium Scholars Program",
      scholarshipId: 1,
      status: "in-progress",
      deadline: "2025-01-15",
      progress: 65,
      nextStep: "Complete personal statement",
      amount: "$50,000+",
      requirements: ["Personal Statement", "Transcripts", "Letters of Recommendation", "FAFSA"],
      completedRequirements: ["Transcripts", "FAFSA"],
      notes: "Need to request letters from Prof. Johnson and Dr. Smith",
    },
    {
      id: 2,
      scholarshipTitle: "Rhodes Scholarship",
      scholarshipId: 2,
      status: "submitted",
      deadline: "2024-10-01",
      submittedDate: "2024-09-25",
      progress: 100,
      nextStep: "Await interview invitation",
      amount: "Full Funding",
      requirements: ["Application Form", "Personal Statement", "Academic Transcripts", "References"],
      completedRequirements: ["Application Form", "Personal Statement", "Academic Transcripts", "References"],
    },
    {
      id: 3,
      scholarshipTitle: "Fulbright Program",
      scholarshipId: 3,
      status: "draft",
      deadline: "2025-03-31",
      progress: 20,
      nextStep: "Start application form",
      amount: "$30,000",
      requirements: ["Application Form", "Project Proposal", "Language Evaluation", "Transcripts"],
      completedRequirements: [],
      notes: "Research host institutions in Germany",
    },
    {
      id: 4,
      scholarshipTitle: "DAAD Scholarships",
      scholarshipId: 4,
      status: "accepted",
      deadline: "2024-12-01",
      submittedDate: "2024-11-15",
      progress: 100,
      nextStep: "Complete enrollment process",
      amount: "€1,200/month",
      requirements: ["Application", "CV", "Motivation Letter", "Transcripts"],
      completedRequirements: ["Application", "CV", "Motivation Letter", "Transcripts"],
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "submitted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "under-review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "submitted":
        return <CheckCircle className="h-4 w-4" />
      case "under-review":
        return <Eye className="h-4 w-4" />
      case "accepted":
        return <Award className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const activeApplications = applications.filter((app) => app.status === "draft" || app.status === "in-progress")

  const submittedApplications = applications.filter(
    (app) => app.status === "submitted" || app.status === "under-review",
  )

  const completedApplications = applications.filter((app) => app.status === "accepted" || app.status === "rejected")

  const stats = {
    total: applications.length,
    active: activeApplications.length,
    submitted: submittedApplications.length,
    accepted: completedApplications.filter((app) => app.status === "accepted").length,
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.submitted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Submitted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accepted</div>
          </CardContent>
        </Card>
      </div>

      {/* Application Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({stats.submitted})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedApplications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Active Applications</h3>
            <Link href="/scholarships">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Start New Application
              </Button>
            </Link>
          </div>

          {activeApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{app.scholarshipTitle}</CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status.replace("-", " ")}</span>
                      </Badge>
                      <CountdownTimer deadline={app.deadline} variant="badge" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">{app.amount}</div>
                    <div className="text-sm text-gray-500">Award Amount</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{app.progress}%</span>
                  </div>
                  <Progress value={app.progress} className="h-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Next step: {app.nextStep}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Requirements Progress</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {app.requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle
                          className={`h-4 w-4 ${
                            app.completedRequirements.includes(req) ? "text-green-600" : "text-gray-300"
                          }`}
                        />
                        <span
                          className={
                            app.completedRequirements.includes(req)
                              ? "text-green-600 line-through"
                              : "text-gray-700 dark:text-gray-300"
                          }
                        >
                          {req}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {app.notes && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Notes:</strong> {app.notes}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="bg-navy hover:bg-navy/90 text-white">
                    <Edit className="h-4 w-4 mr-2" />
                    Continue Application
                  </Button>
                  <Link href={`/scholarships/${app.scholarshipId}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeApplications.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Active Applications</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start applying to scholarships to track your progress here.
                </p>
                <Link href="/scholarships">
                  <Button className="bg-navy hover:bg-navy/90 text-white">Browse Scholarships</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <h3 className="text-lg font-semibold">Submitted Applications</h3>

          {submittedApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">{app.scholarshipTitle}</h4>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status.replace("-", " ")}</span>
                      </Badge>
                      <div className="text-sm text-gray-500">Submitted: {app.submittedDate}</div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Next step: {app.nextStep}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">{app.amount}</div>
                    <Link href={`/scholarships/${app.scholarshipId}`}>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <h3 className="text-lg font-semibold">Completed Applications</h3>

          {completedApplications.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">{app.scholarshipTitle}</h4>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status}</span>
                      </Badge>
                      {app.submittedDate && <div className="text-sm text-gray-500">Submitted: {app.submittedDate}</div>}
                    </div>
                    {app.status === "accepted" && (
                      <p className="text-sm text-green-600 font-medium">🎉 Congratulations! {app.nextStep}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">{app.amount}</div>
                    <Link href={`/scholarships/${app.scholarshipId}`}>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
