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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, type User } from "@/context/auth";
import {
  Save,
  Upload,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [newAchievement, setNewAchievement] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: result.error || "Update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (message) setMessage(null);
  };

  const handleNestedInputChange = (
    parent: string,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...((prev as any)[parent] || {}),
        [field]: value,
      },
    }));
    if (message) setMessage(null);
  };

  const addToArray = (parent: string, field: string, value: string) => {
    if (!value.trim()) return;

    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...((prev as any)[parent] || {}),
        [field]: [...((prev as any)[parent]?.[field] || []), value.trim()],
      },
    }));
  };

  const removeFromArray = (parent: string, field: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...((prev as any)[parent] || {}),
        [field]: ((prev as any)[parent]?.[field] || []).filter(
          (_: any, i: number) => i !== index
        ),
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
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
                {/* Avatar Upload */}
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {formData.avatar ? (
                      <Image
                        src={formData.avatar || "/placeholder.svg"}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName || ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName || ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Address</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Street Address"
                      value={formData.address?.street || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "address",
                          "street",
                          e.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={formData.address?.city || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "address",
                          "city",
                          e.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                    <Input
                      placeholder="State/Province"
                      value={formData.address?.state || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "address",
                          "state",
                          e.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="ZIP/Postal Code"
                      value={formData.address?.zipCode || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "address",
                          "zipCode",
                          e.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                    <Select
                      value={formData.address?.country || ""}
                      onValueChange={(value) =>
                        handleNestedInputChange("address", "country", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="CAN">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AUS">Australia</SelectItem>
                        <SelectItem value="GER">Germany</SelectItem>
                        <SelectItem value="FRA">France</SelectItem>
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
                  <Label htmlFor="currentLevel">Current Education Level</Label>
                  <Select
                    value={formData.education?.currentLevel || ""}
                    onValueChange={(value) =>
                      handleNestedInputChange(
                        "education",
                        "currentLevel",
                        value
                      )
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
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    placeholder="Your school/university name"
                    value={formData.education?.institution || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "education",
                        "institution",
                        e.target.value
                      )
                    }
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="major">Major/Field of Study</Label>
                    <Input
                      id="major"
                      placeholder="Computer Science, Biology, etc."
                      value={formData.education?.major || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "education",
                          "major",
                          e.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">
                      Expected Graduation Year
                    </Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      min="2024"
                      max="2035"
                      value={formData.education?.graduationYear || ""}
                      onChange={(e) =>
                        handleNestedInputChange(
                          "education",
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
                    value={formData.education?.gpa || ""}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "education",
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
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your goals, and interests..."
                    rows={4}
                    value={formData.profile?.bio || ""}
                    onChange={(e) =>
                      handleNestedInputChange("profile", "bio", e.target.value)
                    }
                    disabled={isSubmitting}
                  />
                </div>

                {/* Achievements */}
                <div className="space-y-3">
                  <Label>Achievements</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add an achievement..."
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addToArray("profile", "achievements", newAchievement);
                          setNewAchievement("");
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        addToArray("profile", "achievements", newAchievement);
                        setNewAchievement("");
                      }}
                      disabled={!newAchievement.trim() || isSubmitting}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.profile?.achievements || []).map(
                      (achievement, index) => (
                        <Badge key={index} variant="secondary" className="pr-1">
                          {achievement}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 ml-1 hover:bg-transparent"
                            onClick={() =>
                              removeFromArray("profile", "achievements", index)
                            }
                            disabled={isSubmitting}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-3">
                  <Label>Languages</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a language..."
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addToArray("profile", "languages", newLanguage);
                          setNewLanguage("");
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        addToArray("profile", "languages", newLanguage);
                        setNewLanguage("");
                      }}
                      disabled={!newLanguage.trim() || isSubmitting}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.profile?.languages || []).map(
                      (language, index) => (
                        <Badge key={index} variant="secondary" className="pr-1">
                          {language}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-1 ml-1 hover:bg-transparent"
                            onClick={() =>
                              removeFromArray("profile", "languages", index)
                            }
                            disabled={isSubmitting}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scholarship Preferences</CardTitle>
                <CardDescription>
                  Help us recommend the best scholarships for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Preferred Scholarship Types</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Merit-Based",
                      "Need-Based",
                      "Research",
                      "STEM",
                      "Arts",
                      "Sports",
                    ].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={(
                            formData.preferences?.scholarshipTypes || []
                          ).includes(type)}
                          onCheckedChange={(checked) => {
                            const current =
                              formData.preferences?.scholarshipTypes || [];
                            const updated = checked
                              ? [...current, type]
                              : current.filter((t) => t !== type);
                            handleNestedInputChange(
                              "preferences",
                              "scholarshipTypes",
                              updated
                            );
                          }}
                          disabled={isSubmitting}
                        />
                        <Label htmlFor={type}>{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Notification Preferences</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emailNotifications"
                        checked={
                          formData.preferences?.notifications?.email || false
                        }
                        onCheckedChange={(checked) =>
                          handleNestedInputChange(
                            "preferences",
                            "notifications",
                            {
                              ...formData.preferences?.notifications,
                              email: checked,
                            }
                          )
                        }
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="emailNotifications">
                        Email notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="deadlineReminders"
                        checked={
                          formData.preferences?.notifications
                            ?.deadlineReminders || false
                        }
                        onCheckedChange={(checked) =>
                          handleNestedInputChange(
                            "preferences",
                            "notifications",
                            {
                              ...formData.preferences?.notifications,
                              deadlineReminders: checked,
                            }
                          )
                        }
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="deadlineReminders">
                        Deadline reminders
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newOpportunities"
                        checked={
                          formData.preferences?.notifications
                            ?.newOpportunities || false
                        }
                        onCheckedChange={(checked) =>
                          handleNestedInputChange(
                            "preferences",
                            "notifications",
                            {
                              ...formData.preferences?.notifications,
                              newOpportunities: checked,
                            }
                          )
                        }
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="newOpportunities">
                        New scholarship opportunities
                      </Label>
                    </div>
                  </div>
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
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last changed: Never
                      </p>
                    </div>
                    <Button variant="outline" type="button">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" type="button">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Login Sessions</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your active login sessions
                      </p>
                    </div>
                    <Button variant="outline" type="button">
                      View Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6 border-t">
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
      </form>
    </div>
  );
}
