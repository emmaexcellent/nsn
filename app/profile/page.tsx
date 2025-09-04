"use client"

import { useAuth } from "@/context/auth"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AuthModal } from "@/components/auth/auth-modal"
import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, GraduationCap, Award, Globe, Sparkles, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if user just signed up
    const welcome = searchParams.get("welcome")
    if (welcome === "true" && user) {
      setShowWelcome(true)
      // Remove the welcome parameter from URL after showing
      const url = new URL(window.location.href)
      url.searchParams.delete("welcome")
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams, user])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Card className="w-full max-w-6xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-navy dark:text-gold" />
              </div>
              <CardTitle className="text-2xl">Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to access your profile and manage your scholarship journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setIsAuthModalOpen(true)} className="w-full bg-navy hover:bg-navy/90 text-white">
                Sign In to Continue
              </Button>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account? Sign up to get started with your scholarship search.
              </p>
            </CardContent>
          </Card>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultView="login" />
      </>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Welcome Message for New Users */}
        {showWelcome && (
          <Alert className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Welcome to Newton Scholarship Nexus!</strong> Complete your profile below to get personalized
                  scholarship recommendations and improve your chances of finding the perfect opportunities.
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWelcome(false)}
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  ×
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your account information and preferences to get better scholarship recommendations
          </p>
        </div>

        {/* Profile Completion Banner */}
        {user.profileCompletion < 100 && (
          <Card className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Complete Your Profile ({user.profileCompletion}%)
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      A complete profile helps us match you with the most relevant scholarships and increases your
                      visibility to scholarship providers.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Progress value={user.profileCompletion} className="h-3" />
                    <div className="flex flex-wrap gap-2 text-xs">
                      {user.profileCompletion < 40 && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 rounded">
                          Add education info
                        </span>
                      )}
                      {user.profileCompletion < 60 && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 rounded">
                          Write your bio
                        </span>
                      )}
                      {user.profileCompletion < 80 && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 rounded">
                          Add achievements
                        </span>
                      )}
                      {user.profileCompletion < 100 && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 rounded">
                          Set preferences
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                {user.avatar ? (
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={`${user.firstName} ${user.lastName}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {user.phone}
                      </div>
                    )}
                    {user.address?.city && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {user.address.city}, {user.address.country}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {user.education && (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{user.education.currentLevel}</p>
                        <p className="text-xs text-gray-500">{user.education.institution}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-gold" />
                    <div>
                      <p className="font-medium text-sm">Profile Completion</p>
                      <p className="text-xs text-gray-500">{user.profileCompletion}% Complete</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Member Since</p>
                      <p className="text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{user.profileCompletion}%</span>
                  </div>
                  <Progress value={user.profileCompletion} className="h-2" />
                  {user.profileCompletion < 100 ? (
                    <p className="text-xs text-gray-500">
                      Complete your profile to get better scholarship recommendations
                    </p>
                  ) : (
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span>Profile complete! You're ready to find scholarships.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {user.profile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{user.profile.achievements?.length || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">{user.profile.languages?.length || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Languages</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {user.preferences?.scholarshipTypes?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Preferred Types</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Form */}
        <ProfileForm />
      </div>
    </div>
  )
}
