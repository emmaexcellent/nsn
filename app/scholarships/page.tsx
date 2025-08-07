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
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Scholarship Opportunities</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover and apply to scholarships that match your profile and aspirations
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
            <p className="text-sm text-gray-600 dark:text-gray-400">{filteredScholarships.length} scholarships found</p>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship, index) => (
            <Card
              key={scholarship.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-navy/10 text-navy dark:bg-gold/10 dark:text-gold">
                      {scholarship.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {scholarship.level}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <BookmarkButton
                      scholarshipId={scholarship.id}
                      initialBookmarked={scholarship.saved}
                      variant="heart"
                      size="sm"
                    />
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-navy dark:group-hover:text-gold transition-colors">
                  {scholarship.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {scholarship.description}
                </CardDescription>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Deadline</div>
                      <div className="text-red-600">{scholarship.deadline}</div>
                      <CountdownTimer deadline={scholarship.deadline} variant="badge" className="mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Amount</div>
                      <div className="text-green-600">{scholarship.amount}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Country</div>
                      <div>{scholarship.country}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Sponsor</div>
                      <div className="truncate">{scholarship.sponsor}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="font-medium">Eligibility:</span> {scholarship.eligibility}
                  </p>
                  <Link href={`/scholarships/${scholarship.id}`}>
                    <Button className="w-full bg-navy hover:bg-navy/90 text-white group-hover:bg-gold group-hover:text-navy transition-all">
                      View Details & Apply
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
  )
}
