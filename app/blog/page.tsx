"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, User, ArrowRight } from "lucide-react"
import { NewsletterSubscription } from "@/components/newsletter-subscription"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const featuredPost = {
    id: 1,
    title: "The Complete Guide to Scholarship Essays: How to Stand Out from the Crowd",
    excerpt:
      "Learn the insider secrets that make scholarship essays memorable and compelling. Our comprehensive guide covers everything from brainstorming to final edits.",
    image: "/placeholder.svg?height=400&width=800",
    date: "December 18, 2024",
    author: "Dr. Sarah Johnson",
    category: "Tips",
    readTime: "12 min read",
  }

  const blogPosts = [
    {
      id: 2,
      title: "10 Tips for Writing a Winning Scholarship Essay",
      excerpt: "Learn the essential strategies that make scholarship essays stand out from the competition.",
      image: "/placeholder.svg?height=200&width=300",
      date: "December 15, 2024",
      author: "Mark Thompson",
      category: "Tips",
      readTime: "8 min read",
    },
    {
      id: 3,
      title: "International Scholarships: A Complete Guide",
      excerpt:
        "Everything you need to know about applying for scholarships abroad, from eligibility to application process.",
      image: "/placeholder.svg?height=200&width=300",
      date: "December 10, 2024",
      author: "Lisa Chen",
      category: "Guide",
      readTime: "15 min read",
    },
    {
      id: 4,
      title: "Success Story: From Community College to Harvard",
      excerpt: "Read how one student overcame challenges and secured a full scholarship to Harvard University.",
      image: "/placeholder.svg?height=200&width=300",
      date: "December 8, 2024",
      author: "Michael Rodriguez",
      category: "Success Story",
      readTime: "6 min read",
    },
    {
      id: 5,
      title: "Understanding Financial Aid vs. Scholarships",
      excerpt:
        "Learn the key differences between financial aid and scholarships and how to maximize both opportunities.",
      image: "/placeholder.svg?height=200&width=300",
      date: "December 5, 2024",
      author: "Jennifer Adams",
      category: "Guide",
      readTime: "10 min read",
    },
    {
      id: 6,
      title: "Building a Strong Academic Profile for Scholarships",
      excerpt:
        "Discover how to develop the academic credentials and extracurricular activities that scholarship committees value.",
      image: "/placeholder.svg?height=200&width=300",
      date: "December 3, 2024",
      author: "Dr. Robert Kim",
      category: "Tips",
      readTime: "12 min read",
    },
    {
      id: 7,
      title: "STEM Scholarships: Opportunities in Science and Technology",
      excerpt: "Explore the growing number of scholarships available for students pursuing careers in STEM fields.",
      image: "/placeholder.svg?height=200&width=300",
      date: "November 30, 2024",
      author: "Amanda Foster",
      category: "Field-Specific",
      readTime: "9 min read",
    },
    {
      id: 8,
      title: "Scholarship Interview Preparation: What to Expect",
      excerpt: "Get ready for scholarship interviews with our comprehensive preparation guide and common questions.",
      image: "/placeholder.svg?height=200&width=300",
      date: "November 28, 2024",
      author: "David Wilson",
      category: "Tips",
      readTime: "7 min read",
    },
    {
      id: 9,
      title: "Graduate School Funding: Beyond Traditional Scholarships",
      excerpt:
        "Explore alternative funding sources for graduate students including assistantships, fellowships, and grants.",
      image: "/placeholder.svg?height=200&width=300",
      date: "November 25, 2024",
      author: "Dr. Emily Martinez",
      category: "Graduate",
      readTime: "11 min read",
    },
  ]

  const categories = ["all", "Tips", "Guide", "Success Story", "Field-Specific", "Graduate"]

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Resources & Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Expert tips, comprehensive guides, and inspiring success stories to help you succeed in your scholarship
            journey
          </p>
        </div>

        {/* Featured Article */}
        <Card className="mb-12 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto">
              <Image
                src={featuredPost.image || "/placeholder.svg"}
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-gold text-navy">Featured</Badge>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  {featuredPost.category}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{featuredPost.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{featuredPost.excerpt}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {featuredPost.date}
                  </div>
                  <div>{featuredPost.readTime}</div>
                </div>
                <Link href={`/blog/${featuredPost.id}`}>
                  <Button className="bg-navy hover:bg-navy/90 text-white">
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">{filteredPosts.length} articles found</p>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <Card
              key={post.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-navy/90 text-white">{post.category}</Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <CardTitle className="text-xl group-hover:text-navy dark:group-hover:text-gold transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-navy dark:text-gold hover:underline font-medium"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
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
            Load More Articles
          </Button>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16">
          <NewsletterSubscription variant="inline" />
        </div>
      </div>
    </div>
  )
}
