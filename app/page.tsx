"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Users, Award, Globe, BookOpen, Calendar, DollarSign, Star, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { CountdownTimer } from "@/components/countdown-timer"
import { BookmarkButton } from "@/components/bookmark-button"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { icon: Users, label: "Students Reached", value: "10,000+", color: "text-blue-600" },
    { icon: Award, label: "Scholarships Listed", value: "200+", color: "text-gold" },
    { icon: Globe, label: "Countries", value: "25+", color: "text-green-600" },
    { icon: DollarSign, label: "Total Awards", value: "$50M+", color: "text-purple-600" },
  ]

  const featuredScholarships = [
    {
      id: 1,
      title: "Gates Millennium Scholars Program",
      description: "Full scholarship for outstanding minority students pursuing undergraduate and graduate degrees.",
      deadline: "January 15, 2025",
      amount: "$50,000+",
      category: "Graduate",
      country: "USA",
    },
    {
      id: 2,
      title: "Rhodes Scholarship",
      description: "Prestigious scholarship for international study at the University of Oxford.",
      deadline: "October 1, 2024",
      amount: "Full Funding",
      category: "Graduate",
      country: "UK",
    },
    {
      id: 3,
      title: "Fulbright Program",
      description: "Cultural exchange program for international educational exchange.",
      deadline: "March 31, 2025",
      amount: "$30,000",
      category: "Research",
      country: "Global",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Gates Scholar",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "NSN helped me discover the Gates Scholarship. Their resources and guidance were invaluable in my application process.",
    },
    {
      name: "Miguel Rodriguez",
      role: "Fulbright Scholar",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "The comprehensive database and application tips on NSN made all the difference in securing my Fulbright scholarship.",
    },
    {
      name: "Aisha Patel",
      role: "Rhodes Scholar",
      image: "/placeholder.svg?height=80&width=80",
      quote:
        "Thanks to NSN's mentorship program, I was able to craft a winning application for the Rhodes Scholarship.",
    },
  ]

  const blogPosts = [
    {
      title: "10 Tips for Writing a Winning Scholarship Essay",
      excerpt: "Learn the essential strategies that make scholarship essays stand out from the competition.",
      date: "December 15, 2024",
      image: "/placeholder.svg?height=200&width=300",
      category: "Tips",
    },
    {
      title: "International Scholarships: A Complete Guide",
      excerpt:
        "Everything you need to know about applying for scholarships abroad, from eligibility to application process.",
      date: "December 10, 2024",
      image: "/placeholder.svg?height=200&width=300",
      category: "Guide",
    },
    {
      title: "Success Story: From Community College to Harvard",
      excerpt: "Read how one student overcame challenges and secured a full scholarship to Harvard University.",
      date: "December 8, 2024",
      image: "/placeholder.svg?height=200&width=300",
      category: "Success Story",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy/90 to-navy/80 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div
            className={`text-center space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Newton Scholarship
                <span className="block text-gold">Nexus</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                Empowering scholars, one opportunity at a time
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-lg text-gray-300">
                Connect with national and international scholarship opportunities. Find the resources you need to unlock
                your educational potential.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/scholarships">
                  <Button
                    size="lg"
                    className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4 group"
                  >
                    Find Scholarship Opportunities
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-navy text-lg px-8 py-4 bg-transparent"
                  >
                    Learn More About NSN
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl md:text-3xl font-bold text-gold">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="h-6 w-6 rotate-90 text-gold" />
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Featured Opportunities</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover prestigious scholarships that could transform your educational journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredScholarships.map((scholarship, index) => (
              <Card
                key={scholarship.id}
                className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg animate-fade-in`}
                style={{ animationDelay: `${index * 200}ms` }}
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
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {scholarship.description}
                  </CardDescription>
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
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/scholarships">
              <Button
                size="lg"
                variant="outline"
                className="border-navy text-navy hover:bg-navy hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy bg-transparent"
              >
                View All Scholarships
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Success Stories</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear from scholars who achieved their dreams with NSN's help
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center space-x-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog/Resources Preview */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Latest Resources</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Expert tips, guides, and success stories to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-navy text-white">{post.category}</Badge>
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{post.date}</div>
                  <CardTitle className="text-xl group-hover:text-navy dark:group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                  <Link
                    href="/blog"
                    className="inline-flex items-center text-navy dark:text-gold hover:underline font-medium"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button
                size="lg"
                variant="outline"
                className="border-navy text-navy hover:bg-navy hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy bg-transparent"
              >
                View All Resources
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy dark:bg-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Scholarship Journey?</h2>
            <p className="text-xl text-gray-200">
              Join thousands of students who have already discovered their perfect scholarship opportunities through
              NSN.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scholarships">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-navy font-semibold text-lg px-8 py-4">
                  Explore Scholarships
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-navy text-lg px-8 py-4 bg-transparent"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
