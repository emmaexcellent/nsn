"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Search, Filter, Calendar, DollarSign, MapPin, Users, ArrowRight, Share2 } from "lucide-react"
import { CountdownTimer } from "@/components/countdown-timer"
import { BookmarkButton } from "@/components/bookmark-button"
import { ScholarshipCard } from "@/components/schorlarships/scholarship-card"

export default function ScholarshipsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const scholarships = [
    {
      id: 1,
      title: "Gates Millennium Scholars Program",
      description:
        "Full scholarship for outstanding minority students pursuing undergraduate and graduate degrees in any field of study.",
      deadline: "January 15, 2025",
      amount: "$50,000+",
      category: "Merit-Based",
      country: "USA",
      level: "Graduate",
      eligibility: "Minority students with high academic achievement",
      sponsor: "Bill & Melinda Gates Foundation",
      saved: false,
    },
    {
      id: 2,
      title: "Rhodes Scholarship",
      description:
        "The world's oldest international scholarship programme, enabling outstanding young people to study at the University of Oxford.",
      deadline: "October 1, 2024",
      amount: "Full Funding",
      category: "Merit-Based",
      country: "UK",
      level: "Graduate",
      eligibility: "Outstanding academic achievement and leadership potential",
      sponsor: "Rhodes Trust",
      saved: true,
    },
    {
      id: 3,
      title: "Fulbright Program",
      description:
        "Cultural exchange program providing opportunities for international educational exchange for students, scholars, and professionals.",
      deadline: "March 31, 2025",
      amount: "$30,000",
      category: "Research",
      country: "Global",
      level: "Graduate",
      eligibility: "U.S. citizens with bachelor's degree",
      sponsor: "U.S. Department of State",
      saved: false,
    },
    {
      id: 4,
      title: "Chevening Scholarships",
      description:
        "UK government's global scholarship programme funded by the Foreign and Commonwealth Office and partner organisations.",
      deadline: "November 7, 2024",
      amount: "Full Funding",
      category: "Government",
      country: "UK",
      level: "Graduate",
      eligibility: "Leadership potential and academic excellence",
      sponsor: "UK Government",
      saved: false,
    },
    {
      id: 5,
      title: "DAAD Scholarships",
      description:
        "Various scholarship programs for international students to study in Germany at universities and research institutions.",
      deadline: "December 1, 2024",
      amount: "€850-€1,200/month",
      category: "Government",
      country: "Germany",
      level: "Graduate",
      eligibility: "International students with strong academic records",
      sponsor: "German Academic Exchange Service",
      saved: true,
    },
    {
      id: 6,
      title: "Australia Awards",
      description:
        "Long-term development scholarships contributing to the development needs of Australia's partner countries.",
      deadline: "February 28, 2025",
      amount: "Full Funding",
      category: "Government",
      country: "Australia",
      level: "Graduate",
      eligibility: "Citizens of eligible developing countries",
      sponsor: "Australian Government",
      saved: false,
    },
  ]

  const categories = ["all", "Merit-Based", "Need-Based", "Research", "Government", "Private"]
  const countries = ["all", "USA", "UK", "Germany", "Australia", "Canada", "Global"]
  const levels = ["all", "Undergraduate", "Graduate", "PhD", "Postdoc"]

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || scholarship.category === selectedCategory
    const matchesCountry = selectedCountry === "all" || scholarship.country === selectedCountry
    const matchesLevel = selectedLevel === "all" || scholarship.level === selectedLevel

    return matchesSearch && matchesCategory && matchesCountry && matchesLevel
  })

  return (
    <div className="min-h-screen py-24 lg:py-40">
      <div className="w-full max-w-6xl mx-auto mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Scholarship Opportunities{" "}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover and apply to scholarships that match your profile and
            aspirations
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Country Filter */}
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country === "all" ? "All Countries" : country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === "all" ? "All Levels" : level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredScholarships.length} scholarships found
            </p>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-8 mt-5 sm:px-3">
          {filteredScholarships.map((scholarship, index) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              animationDelay={index * 100}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-navy text-navy hover:bg-navy hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy bg-transparent"
          >
            Load More Scholarships
          </Button>
        </div>
      </div>
    </div>
  );
}
