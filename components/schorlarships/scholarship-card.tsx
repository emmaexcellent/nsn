"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Calendar, DollarSign } from "lucide-react"
import { CountdownTimer } from "@/components/schorlarships/countdown-timer"
import { BookmarkButton } from "@/components/schorlarships/bookmark-button"

interface Scholarship {
  id: number
  title: string
  description: string
  deadline: string
  amount: string
  category: string
  country: string
}

interface ScholarshipCardProps {
  scholarship: Scholarship
  variant?: "featured" | "default"
  animationDelay?: number
}

export function ScholarshipCard({ scholarship, variant = "default", animationDelay = 0 }: ScholarshipCardProps) {
  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg animate-fade-in`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardHeader className="space-y-3">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-navy/10 text-navy dark:bg-gold/10 dark:text-gold">
            {scholarship.category}
          </Badge>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {scholarship.country}
            </Badge>
            <BookmarkButton scholarshipId={scholarship.id} variant="heart" size="sm" />
          </div>
        </div>
        <CardTitle className="text-xl group-hover:text-navy dark:group-hover:text-gold transition-colors">
          {scholarship.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-gray-600 dark:text-gray-400">{scholarship.description}</CardDescription>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Deadline
            </span>
            <span className="font-semibold text-red-600">{scholarship.deadline}</span>
          </div>
          <div className="flex items-center justify-between">
            <CountdownTimer deadline={scholarship.deadline} variant="compact" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-500">
              <DollarSign className="h-4 w-4 mr-1" />
              Award Amount
            </span>
            <span className="font-semibold text-green-600">{scholarship.amount}</span>
          </div>
        </div>
        <Link href={`/scholarships/${scholarship.id}`}>
          <Button className="w-full bg-navy hover:bg-navy/90 text-white group-hover:bg-gold group-hover:text-navy transition-all">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
