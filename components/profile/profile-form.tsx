"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, GraduationCap, FileText, Settings, Shield, Plus, X, Save, CheckCircle, Info, Camera } from "lucide-react"
import { useAuth } from "@/context/auth"

export function ProfileForm() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || "",

    // Address
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },

    // Education
    education: {
      institution: user?.education?.institution || "",
      degree: user?.education?.degree || "",
      fieldOfStudy: user?.education?.fieldOfStudy || "",
      graduationYear: user?.education?.graduationYear || "",
      gpa: user?.education?.gpa || "",
      currentLevel: user?.education?.currentLevel || "",
    },

    // Profile
    profile: {
      bio: user?.profile?.bio || "",
      achievements: user?.profile?.achievements || [],
      languages: user?.profile?.languages || [],
      workExperience: user?.profile?.workExperience || "",
      volunteerExperience: user?.profile?.volunteerExperience || "",
    },

    // Preferences
    preferences: {
      scholarshipTypes: user?.preferences?.scholarshipTypes || [],
      fieldOfInterest: user?.preferences?.fieldOfInterest || [],
      studyCountries: user?.preferences?.studyCountries || [],
      emailNotifications: user?.preferences?.emailNotifications ?? true,
      smsNotifications: user?.preferences?.smsNotifications ?? false,
      weeklyDigest: user?.preferences?.weeklyDigest ?? true,
    },

    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [newAchievement, setNewAchievement] = useState("")
  const [newLanguage, setNewLanguage] = useState("")

  // Calculate profile completion
  const calculateCompletion = () => {
    let completed = 0
    let total = 0

    // Base account (25%)
    completed += 25
    total += 25

    // Avatar (10%)
    if (user?.avatar) completed += 10
    total += 10

    // Phone (5%)
    if (formData.phone) completed += 5
    total += 5

    // Address (15%)
    const addressFields = Object.values(formData.address).filter(Boolean).length
    completed += (addressFields / 5) * 15
    total += 15

    // Education (20%)
    const educationFields = Object.values(formData.education).filter(Boolean).length
    completed += (educationFields / 6) * 20
    total += 20

    // Bio (10%)
    if (formData.profile.bio) completed += 10
    total += 10

    // Achievements (10%)
    if (formData.profile.achievements.length > 0) completed += 10
    total += 10

    // Preferences (5%)
    if (formData.preferences.scholarshipTypes.length > 0) completed += 5
    total += 5

    return Math.round((completed / total) * 100)
  }

  const profileCompletion = calculateCompletion()

  // Update user's profile completion when form data changes
  useEffect(() => {
    if (user && profileCompletion !== user.profileCompletion) {
      updateUser({ ...user, profileCompletion })
    }
  }, [profileCompletion])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedUser = {
        ...user!,
        ...formData,
        profileCompletion,
      }

      updateUser(updatedUser)
      setSuccessMessage("Profile updated successfully!")

      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          achievements: [...formData.profile.achievements, newAchievement.trim()],
        },
      })
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        achievements: formData.profile.achievements.filter((_, i) => i !== index),
      },
    })
  }

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          languages: [...formData.profile.languages, newLanguage.trim()],
        },
      })
      setNewLanguage("")
    }
  }

  const removeLanguage = (index: number) => {
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        languages: formData.profile.languages.filter((_, i) => i !== index),
      },
    })
  }

  const toggleScholarshipType = (type: string) => {
    const current = formData.preferences.scholarshipTypes
    const updated = current.includes(type) ? current.filter((t) => t !== type) : [...current, type]

    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        scholarshipTypes: updated,
      },
    })
  }

  const getTabIndicator = (tab: string) => {
    const indicators = {
      personal: !formData.phone || !formData.address.country,
      education: !formData.education.institution || !formData.education.degree,
      profile: !formData.profile.bio || formData.profile.achievements.length === 0,
      preferences: formData.preferences.scholarshipTypes.length === 0,
      security: false,
    }

    return indicators[tab as keyof typeof indicators]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Profile Information</span>
        </CardTitle>
        <CardDescription>
          Manage your account settings and preferences. Complete your profile to get better scholarship recommendations.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {successMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {profileCompletion < 50 && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Tip:</strong> Complete more sections of your profile to improve scholarship matching and increase
              your chances of success.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal" className="relative">
                <User className="h-4 w-4 mr-2" />
                Personal
                {getTabIndicator("personal") && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </TabsTrigger>
              <TabsTrigger value="education" className="relative">
                <GraduationCap className="h-4 w-4 mr-2" />
                Education
                {getTabIndicator("education") && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </TabsTrigger>
              <TabsTrigger value="profile" className="relative">
                <FileText className="h-4 w-4 mr-2" />
                Profile
                {getTabIndicator("profile") && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </TabsTrigger>
              <TabsTrigger value="preferences" className="relative">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
                {getTabIndicator("preferences") && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>

                {/* Avatar Upload */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <Button type="button" variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Add your phone number"
                    />
                    {!formData.phone && (
                      <p className="text-xs text-gray-500">Phone number helps with scholarship notifications</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <h4 className="font-medium">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, street: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, zipCode: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={formData.address.country}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address, country: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Education Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={formData.education.institution}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          education: { ...formData.education, institution: e.target.value },
                        })
                      }
                      placeholder="Your school or university"
                    />
                    {!formData.education.institution && (
                      <p className="text-xs text-gray-500">Institution name helps match relevant scholarships</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentLevel">Current Level</Label>
                    <Select
                      value={formData.education.currentLevel}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          education: { ...formData.education, currentLevel: value },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">High School</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      value={formData.education.degree}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          education: { ...formData.education, degree: e.target.value },
                        })
                      }
                      placeholder="e.g., Bachelor of Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fieldOfStudy">Field of Study</Label>
                    <Input
                      id="fieldOfStudy"
                      value={formData.education.fieldOfStudy}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          education: { ...formData.education, fieldOfStudy: e.target.value },
                        })
                      }
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      value={formData.education.graduationYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          education: { ...formData.education, graduationYear: e.target.value },
                        })
                      }
                      placeholder="2025"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA (Optional)</Label>
                    <Input
                      id="gpa"
                      value={formData.education.gpa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          education: { ...formData.education, gpa: e.target.value },
                        })
                      }
                      placeholder="3.8"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.profile.bio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profile: { ...formData.profile, bio: e.target.value },
                      })
                    }
                    placeholder="Tell us about yourself, your goals, and what makes you unique..."
                    rows={4}
                  />
                  {!formData.profile.bio && (
                    <p className="text-xs text-gray-500">
                      A compelling bio helps scholarship committees understand your story
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Achievements</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Add an achievement (e.g., Dean's List, Award Winner)"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                    />
                    <Button type="button" onClick={addAchievement} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.profile.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{achievement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(index)}
                          className="h-4 w-4 p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  {formData.profile.achievements.length === 0 && (
                    <p className="text-xs text-gray-500">Add achievements like awards, honors, or recognitions</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Languages</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Add a language (e.g., Spanish - Fluent)"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                    />
                    <Button type="button" onClick={addLanguage} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.profile.languages.map((language, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{language}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLanguage(index)}
                          className="h-4 w-4 p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workExperience">Work Experience</Label>
                    <Textarea
                      id="workExperience"
                      value={formData.profile.workExperience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, workExperience: e.target.value },
                        })
                      }
                      placeholder="Describe your work experience..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volunteerExperience">Volunteer Experience</Label>
                    <Textarea
                      id="volunteerExperience"
                      value={formData.profile.volunteerExperience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profile: { ...formData.profile, volunteerExperience: e.target.value },
                        })
                      }
                      placeholder="Describe your volunteer work..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Scholarship Preferences</h3>

                <div className="space-y-2">
                  <Label>Scholarship Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "Academic Merit",
                      "Need-Based",
                      "Athletic",
                      "Arts & Creative",
                      "STEM",
                      "Community Service",
                      "Leadership",
                      "Minority",
                      "International",
                      "Graduate",
                      "Undergraduate",
                      "Research",
                    ].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={formData.preferences.scholarshipTypes.includes(type)}
                          onCheckedChange={() => toggleScholarshipType(type)}
                        />
                        <Label htmlFor={type} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <h4 className="font-medium">Notification Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive scholarship alerts and updates via email</p>
                    </div>
                    <Checkbox
                      checked={formData.preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, emailNotifications: checked as boolean },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive urgent deadline reminders via SMS</p>
                    </div>
                    <Checkbox
                      checked={formData.preferences.smsNotifications}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, smsNotifications: checked as boolean },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-gray-500">Get a weekly summary of new scholarships</p>
                    </div>
                    <Checkbox
                      checked={formData.preferences.weeklyDigest}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          preferences: { ...formData.preferences, weeklyDigest: checked as boolean },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security Settings</h3>

                <div className="space-y-4">
                  <h4 className="font-medium">Change Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Enable 2FA</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Active Sessions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Current Session</p>
                        <p className="text-xs text-gray-500">Chrome on Windows • Active now</p>
                      </div>
                      <Badge variant="secondary">Current</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-navy hover:bg-navy/90">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
