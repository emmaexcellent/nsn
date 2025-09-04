"use client"

import { useAuth } from "@/context/auth"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, User, X, Info } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get("welcome") === "true"
  const [showWelcome, setShowWelcome] = useState(isWelcome)
  const [showCompletionBanner, setShowCompletionBanner] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  const completionPercentage = user.profileCompletion || 0
  const isProfileIncomplete = completionPercentage < 100

  const getNextSteps = () => {
    const steps = []
    if (!user.phone) steps.push("Add phone number")
    if (!user.education?.institution) steps.push("Add education information")
    if (!user.profile?.bio) steps.push("Write a bio")
    if (!user.profile?.achievements?.length) steps.push("Add achievements")
    if (!user.address?.country) steps.push("Add address information")
    return steps.slice(0, 3) // Show max 3 next steps
  }

  const nextSteps = getNextSteps()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full max-w-6xl mx-auto px-4 space-y-6">
        {/* Welcome Banner for New Users */}
        {showWelcome && (
          <Alert className="border-gold bg-gold/10">
            <CheckCircle className="h-4 w-4 text-gold" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <strong>Welcome to Newton Scholarship Nexus, {user.firstName}!</strong>
                <p className="mt-1 text-sm">
                  Complete your profile to get personalized scholarship recommendations and improve your chances of
                  success.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowWelcome(false)} className="ml-4 hover:bg-gold/20">
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Completion Banner */}
        {isProfileIncomplete && showCompletionBanner && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-blue-800 dark:text-blue-200">Profile {completionPercentage}% Complete</strong>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCompletionBanner(false)}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Progress value={completionPercentage} className="mb-2 h-2" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Complete your profile to unlock better scholarship matches and recommendations.
                </p>
                {nextSteps.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">Next steps:</p>
                    <div className="flex flex-wrap gap-1">
                      {nextSteps.map((step, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-blue-300 text-blue-700 dark:text-blue-300"
                        >
                          {step}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Profile Overview */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-navy/10 rounded-full flex items-center justify-center mb-4">
                {user.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-navy" />
                )}
              </div>
              <CardTitle className="text-xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-navy">{completionPercentage}%</div>
                <div className="text-sm text-gray-600">Profile Complete</div>
                <Progress value={completionPercentage} className="mt-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-gold">{user.profile?.achievements?.length || 0}</div>
                  <div className="text-xs text-gray-600">Achievements</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">{user.profile?.languages?.length || 0}</div>
                  <div className="text-xs text-gray-600">Languages</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {user.preferences?.scholarshipTypes?.length || 0}
                </div>
                <div className="text-xs text-gray-600">Scholarship Preferences</div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <div className="md:col-span-3">
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  )
}
