"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, HelpCircle, Users } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Address",
      details: ["123 Education Boulevard", "Learning City, LC 12345", "United States"],
      color: "text-blue-600",
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["+1 (555) 123-4567", "+1 (555) 123-4568 (International)", "Available Mon-Fri, 9 AM - 6 PM EST"],
      color: "text-green-600",
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "info@newtonscholarshipnexus.org",
        "support@newtonscholarshipnexus.org",
        "partnerships@newtonscholarshipnexus.org",
      ],
      color: "text-purple-600",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 9:00 AM - 6:00 PM EST", "Saturday: 10:00 AM - 2:00 PM EST", "Sunday: Closed"],
      color: "text-orange-600",
    },
  ]

  const contactReasons = [
    {
      icon: HelpCircle,
      title: "General Inquiries",
      description: "Questions about our services, platform, or how to get started",
    },
    {
      icon: MessageCircle,
      title: "Technical Support",
      description: "Need help with your account, dashboard, or experiencing technical issues",
    },
    {
      icon: Users,
      title: "Partnerships",
      description: "Interested in partnering with us or adding your scholarship program",
    },
  ]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactReasons.map((reason, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <reason.icon className="h-8 w-8 text-navy dark:text-gold" />
                </div>
                <CardTitle className="text-xl">{reason.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{reason.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category *
                  </label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="scholarship">Scholarship Question</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Brief subject line"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Please provide details about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-navy hover:bg-navy/90 text-white" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-800`}>
                      <info.icon className={`h-6 w-6 ${info.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-600 dark:text-gray-400">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Map Placeholder */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-gray-500 dark:text-gray-400">Interactive Map</p>
                    <p className="text-sm text-gray-400">123 Education Boulevard, Learning City</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Response Times */}
            <Card className="bg-gradient-to-r from-navy to-navy/90 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Response Times</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>General Inquiries</span>
                    <Badge className="bg-gold text-navy">Within 24 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Technical Support</span>
                    <Badge className="bg-gold text-navy">Within 12 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Partnership Requests</span>
                    <Badge className="bg-gold text-navy">Within 48 hours</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            <CardDescription>Find quick answers to common questions before reaching out</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    How do I search for scholarships?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Use our advanced search filters on the scholarships page to find opportunities that match your
                    profile, field of study, and location preferences.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Is the platform free to use?</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Yes, Newton Scholarship Nexus is completely free for students. We believe that financial barriers
                    shouldn't prevent access to scholarship information.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    How often is the scholarship database updated?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Our team updates the database daily with new opportunities and removes expired scholarships to
                    ensure you have access to current information.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Can you help with my application?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    While we don't provide individual application assistance, our blog contains comprehensive guides and
                    tips to help you create winning applications.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    How do I add a scholarship to the database?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Organizations can submit scholarships through our partnership program. Contact us using the form
                    above for more information about adding opportunities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Do you offer scholarships directly?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    We don't offer scholarships directly. We're a platform that connects students with existing
                    scholarship opportunities from various organizations and institutions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
