"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Check, Bell, BookOpen, Calendar } from "lucide-react"

interface NewsletterSubscriptionProps {
  variant?: "footer" | "inline" | "modal"
  className?: string
}

export function NewsletterSubscription({ variant = "footer", className = "" }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("")
  const [preferences, setPreferences] = useState({
    scholarships: true,
    reminders: true,
    blog: true,
  })
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubscribed(true)
    setIsLoading(false)
    setEmail("")
  }

  const subscriptionTypes = [
    {
      id: "scholarships",
      label: "New Scholarship Alerts",
      description: "Get notified when new scholarships matching your profile are added",
      icon: Bell,
      color: "text-blue-600",
    },
    {
      id: "reminders",
      label: "Application Reminders",
      description: "Deadline reminders for scholarships you've saved",
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      id: "blog",
      label: "Blog Updates",
      description: "Latest tips, guides, and success stories",
      icon: BookOpen,
      color: "text-green-600",
    },
  ]

  if (isSubscribed) {
    return (
      <div className={`text-center space-y-4 ${className}`}>
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Successfully Subscribed!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You&apos;ll receive your first newsletter within 24 hours.
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          Welcome to NSN Community!
        </Badge>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          required
        />
        <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold" disabled={isLoading}>
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    )
  }

  if (variant === "inline") {
    return (
      <Card className={`w-full max-w-2xl mx-auto ${className}`}>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-gold" />
          </div>
          <CardTitle className="text-2xl">Stay Informed</CardTitle>
          <CardDescription>
            Get the latest scholarship opportunities and application tips
            delivered to your inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">
                Subscription Preferences
              </label>
              {subscriptionTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Checkbox
                    id={type.id}
                    checked={preferences[type.id as keyof typeof preferences]}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        [type.id]: checked as boolean,
                      }))
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <type.icon className={`h-4 w-4 ${type.color}`} />
                      <label
                        htmlFor={type.id}
                        className="font-medium text-sm cursor-pointer"
                      >
                        {type.label}
                      </label>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-navy hover:bg-navy/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Subscribing..." : "Subscribe to Newsletter"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              You can unsubscribe at any time. We respect your privacy and
              won&apos;t spam you.
            </p>
          </form>
        </CardContent>
      </Card>
    );
  }

  return null
}
