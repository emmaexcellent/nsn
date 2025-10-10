"use client";

import { useAuth } from "@/context/auth";
import { ProfileForm } from "@/components/profile/profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AuthModal } from "@/components/auth/auth-modal";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Globe,
} from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
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
                Please sign in to access your profile and manage your
                scholarship journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full bg-navy hover:bg-navy/90 text-white"
              >
                Sign In to Continue
              </Button>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account? Sign up to get started with your
                scholarship search.
              </p>
            </CardContent>
          </Card>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultView="login"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your account information and preferences to get better
            scholarship recommendations
          </p>
        </div>

        {/* Profile Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
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
                        {user.state}, {user.country}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {user.education && (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">
                          {user.currentLevel}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.institution}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-gold" />
                    <div>
                      <p className="font-medium text-sm">Profile Completion</p>
                      <p className="text-xs text-gray-500">
                        {user.profileCompletion}% Complete
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Member Since</p>
                      <p className="text-xs text-gray-500">
                        {new Date(user.$createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Profile Completion
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.profileCompletion}%
                    </span>
                  </div>
                  <Progress value={user.profileCompletion} className="h-2" />
                  {user.profileCompletion < 100 && (
                    <p className="text-xs text-gray-500">
                      Complete your profile to get better scholarship
                      recommendations
                    </p>
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
                <div className="text-2xl font-bold text-blue-600">
                  {user.profile.achievements?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Achievements
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {user.profile.languages?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Languages
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {user.preferences?.scholarshipTypes?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Preferred Types
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Form */}
        <ProfileForm />
      </div>
    </div>
  );
}
