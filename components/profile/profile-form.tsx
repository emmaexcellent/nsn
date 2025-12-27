"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth";
import { Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Models } from "appwrite";

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState<Partial<Models.Document>>(
    user as Models.Document
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(
    user?.profileCompletion
  );

  if (!user) return null;

  // Calculate profile completion percentage
  const calculateCompletion = (data: Partial<Models.Document>) => {
    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "dateOfBirth",
      "state",
      "country",
      "currentLevel",
      "institution",
      "courseOfStudy",
      "graduationYear",
      "gpa",
      "bio",
    ];

    let completedCount = 0;
    const totalWeight = requiredFields.length * 2; // Required fields have higher weight

    // Check required fields
    requiredFields.forEach((field) => {
      if (data[field] && data[field] !== "") {
        completedCount += 2; // Each required field is worth 2 points
      }
    });

    // Calculate percentage (max 100%)
    const percentage = Math.min(
      Math.round((completedCount / totalWeight) * 100),
      100
    );
    return percentage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    setCompletionPercentage(calculateCompletion(formData));

    try {
      // Include completion percentage in the data to be submitted
      const dataToSubmit = {
        ...formData,
        profileCompletion: completionPercentage,
      };

      const result = await updateProfile(dataToSubmit);
      if (result.success) {
        setMessage({
          type: "success",
          text: `Profile updated successfully! Completion: ${completionPercentage}%`,
        });
      } else {
        setMessage({ type: "error", text: result.error || "Update failed" });
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (message) setMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Completion Badge */}
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData?.firstName || ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData?.lastName || ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData?.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={
                        formData?.dateOfBirth
                          ? new Date(formData.dateOfBirth)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Address *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="State/Province"
                      value={formData?.state || ""}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                    <Select
                      value={formData?.country || ""}
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                        <SelectItem value="United States">
                          United States
                        </SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">
                          United Kingdom
                        </SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Education Information</CardTitle>
                <CardDescription>
                  Tell us about your educational background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentLevel">
                    Current Education Level *
                  </Label>
                  <Select
                    value={formData?.currentLevel || ""}
                    onValueChange={(value) =>
                      handleInputChange("currentLevel", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Undergraduate">
                        Undergraduate
                      </SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="Postdoc">Postdoc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    placeholder="Your school/university name"
                    value={formData?.institution || ""}
                    onChange={(e) =>
                      handleInputChange("institution", e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseOfStudy">
                      Major/Field of Study *
                    </Label>
                    <Input
                      id="courseOfStudy"
                      placeholder="Computer Science, Biology, etc."
                      value={formData?.courseOfStudy || ""}
                      onChange={(e) =>
                        handleInputChange("courseOfStudy", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">
                      Expected Graduation Year *
                    </Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      min="2024"
                      max="2035"
                      value={formData?.graduationYear || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "graduationYear",
                          Number.parseInt(e.target.value)
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA (Optional)</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    placeholder="3.75"
                    value={formData?.gpa || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "gpa",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Share more about yourself to improve scholarship matching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your goals, and interests..."
                    rows={4}
                    value={formData?.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formData.email}
                      </p>
                    </div>
                    <Button variant="outline" type="button">
                      Change Email
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last changed: Never
                      </p>
                    </div>
                    <Button variant="outline" type="button">
                      Change Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            Fields marked with * are required
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-navy hover:bg-navy/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
