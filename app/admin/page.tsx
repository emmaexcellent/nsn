"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Users,
  BookOpen,
  Award,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  FileText,
  Search,
  Download,
  BarChart3,
  Settings,
  Bell,
  UserCheck,
  UserX,
  Mail,
} from "lucide-react"
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"

interface Scholarship {
  id: string
  title: string
  description: string
  amount: string
  deadline: string
  category: string
  eligibility: string[]
  requirements: string[]
  provider: string
  applicationCount: number
  status: "active" | "inactive" | "expired"
  createdAt: string
  updatedAt: string
}

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  status: "published" | "draft" | "archived"
  publishedAt: string
  createdAt: string
  updatedAt: string
  views: number
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  status: "active" | "inactive" | "suspended"
  profileCompletion: number
  applicationsCount: number
  joinedAt: string
  lastLogin: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  // Mock data - in real app, this would come from API
  const [scholarships, setScholarships] = useState<Scholarship[]>([
    {
      id: "1",
      title: "Gates Millennium Scholars Program",
      description: "A comprehensive scholarship program for outstanding minority students",
      amount: "$50,000+",
      deadline: "2025-01-15",
      category: "Merit-Based",
      eligibility: ["Undergraduate", "Graduate", "Minority Students"],
      requirements: ["3.3 GPA minimum", "Financial need", "Leadership experience"],
      provider: "Bill & Melinda Gates Foundation",
      applicationCount: 1247,
      status: "active",
      createdAt: "2024-01-01",
      updatedAt: "2024-12-01",
    },
    {
      id: "2",
      title: "Rhodes Scholarship",
      description: "The world's oldest international scholarship programme",
      amount: "Full Funding",
      deadline: "2024-10-01",
      category: "Academic Excellence",
      eligibility: ["Graduate", "International Students"],
      requirements: ["Outstanding academic record", "Leadership potential", "Commitment to service"],
      provider: "Rhodes Trust",
      applicationCount: 892,
      status: "expired",
      createdAt: "2024-01-01",
      updatedAt: "2024-10-01",
    },
    {
      id: "3",
      title: "STEM Excellence Scholarship",
      description: "Supporting the next generation of STEM leaders",
      amount: "$25,000",
      deadline: "2025-03-31",
      category: "STEM",
      eligibility: ["Undergraduate", "STEM Fields"],
      requirements: ["STEM major", "3.5 GPA minimum", "Research experience"],
      provider: "National Science Foundation",
      applicationCount: 634,
      status: "active",
      createdAt: "2024-02-01",
      updatedAt: "2024-11-15",
    },
  ])

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "10 Tips for Writing a Winning Scholarship Essay",
      content: "Writing a compelling scholarship essay can make the difference between winning and losing...",
      excerpt: "Learn the essential strategies for crafting scholarship essays that stand out from the competition.",
      author: "Sarah Johnson",
      category: "Application Tips",
      tags: ["essays", "writing", "tips"],
      status: "published",
      publishedAt: "2024-11-15",
      createdAt: "2024-11-10",
      updatedAt: "2024-11-15",
      views: 2847,
    },
    {
      id: "2",
      title: "Understanding Financial Aid vs Scholarships",
      content: "Many students confuse financial aid with scholarships. Here's what you need to know...",
      excerpt: "A comprehensive guide to understanding the differences between various forms of educational funding.",
      author: "Michael Chen",
      category: "Financial Aid",
      tags: ["financial-aid", "scholarships", "education"],
      status: "published",
      publishedAt: "2024-11-10",
      createdAt: "2024-11-05",
      updatedAt: "2024-11-10",
      views: 1923,
    },
    {
      id: "3",
      title: "International Student Scholarship Guide",
      content: "International students face unique challenges when applying for scholarships...",
      excerpt: "Everything international students need to know about finding and applying for scholarships.",
      author: "Emma Rodriguez",
      category: "International",
      tags: ["international", "students", "guide"],
      status: "draft",
      publishedAt: "",
      createdAt: "2024-11-20",
      updatedAt: "2024-11-20",
      views: 0,
    },
  ])

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "sarah.johnson@email.com",
      firstName: "Sarah",
      lastName: "Johnson",
      status: "active",
      profileCompletion: 85,
      applicationsCount: 12,
      joinedAt: "2024-01-15",
      lastLogin: "2024-12-15",
    },
    {
      id: "2",
      email: "michael.chen@email.com",
      firstName: "Michael",
      lastName: "Chen",
      status: "active",
      profileCompletion: 92,
      applicationsCount: 8,
      joinedAt: "2024-02-20",
      lastLogin: "2024-12-14",
    },
    {
      id: "3",
      email: "emma.rodriguez@email.com",
      firstName: "Emma",
      lastName: "Rodriguez",
      status: "inactive",
      profileCompletion: 45,
      applicationsCount: 3,
      joinedAt: "2024-03-10",
      lastLogin: "2024-11-20",
    },
  ])

  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null)
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Check if user is admin (in real app, this would be a proper role check)
  {/** useEffect(() => {
    if (!user || user.email !== "admin@nsn.org") {
      router.push("/")
    }
  }, [user, router]) 

  if (!user || user.email !== "admin@nsn.org") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  } **/}

  const stats = {
    totalScholarships: scholarships.length,
    activeScholarships: scholarships.filter((s) => s.status === "active").length,
    totalApplications: scholarships.reduce((sum, s) => sum + s.applicationCount, 0),
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    totalBlogPosts: blogPosts.length,
    publishedPosts: blogPosts.filter((p) => p.status === "published").length,
    totalViews: blogPosts.reduce((sum, p) => sum + p.views, 0),
  }

  const handleDeleteScholarship = (id: string) => {
    setScholarships(scholarships.filter((s) => s.id !== id))
  }

  const handleDeleteBlogPost = (id: string) => {
    setBlogPosts(blogPosts.filter((p) => p.id !== id))
  }

  const handleUpdateUserStatus = (id: string, status: "active" | "inactive" | "suspended") => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status } : u)))
  }

  const filteredScholarships = scholarships.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || s.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredBlogPosts = blogPosts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || p.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || u.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage scholarships, blog posts, and users</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Scholarships</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalScholarships}</p>
                  <p className="text-xs text-green-600">{stats.activeScholarships} active</p>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalApplications}</p>
                  <p className="text-xs text-blue-600">Across all scholarships</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Registered Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                  <p className="text-xs text-green-600">{stats.activeUsers} active</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Blog Posts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBlogPosts}</p>
                  <p className="text-xs text-blue-600">{stats.totalViews} total views</p>
                </div>
                <BookOpen className="h-8 w-8 text-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="scholarships" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search scholarships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-navy hover:bg-navy/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Scholarship
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Scholarship</DialogTitle>
                  </DialogHeader>
                  <ScholarshipForm
                    onSubmit={(data) => {
                      const newScholarship: Scholarship = {
                        id: Date.now().toString(),
                        ...data,
                        applicationCount: 0,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      }
                      setScholarships([...scholarships, newScholarship])
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {filteredScholarships.map((scholarship) => (
                <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{scholarship.title}</h3>
                          <Badge
                            className={
                              scholarship.status === "active"
                                ? "bg-green-100 text-green-800"
                                : scholarship.status === "expired"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {scholarship.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{scholarship.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <DollarSign className="h-4 w-4 mr-2" />
                            {scholarship.amount}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(scholarship.deadline).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FileText className="h-4 w-4 mr-2" />
                            {scholarship.applicationCount} applications
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Award className="h-4 w-4 mr-2" />
                            {scholarship.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Scholarship</DialogTitle>
                            </DialogHeader>
                            <ScholarshipForm
                              initialData={scholarship}
                              onSubmit={(data) => {
                                setScholarships(
                                  scholarships.map((s) =>
                                    s.id === scholarship.id
                                      ? { ...s, ...data, updatedAt: new Date().toISOString() }
                                      : s,
                                  ),
                                )
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{scholarship.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteScholarship(scholarship.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Blog Posts Tab */}
          <TabsContent value="blog" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-navy hover:bg-navy/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Blog Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Blog Post</DialogTitle>
                  </DialogHeader>
                  <BlogPostForm
                    onSubmit={(data) => {
                      const newPost: BlogPost = {
                        id: Date.now().toString(),
                        ...data,
                        views: 0,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        publishedAt: data.status === "published" ? new Date().toISOString() : "",
                      }
                      setBlogPosts([...blogPosts, newPost])
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {filteredBlogPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                          <Badge
                            className={
                              post.status === "published"
                                ? "bg-green-100 text-green-800"
                                : post.status === "draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {post.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{post.excerpt}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4 mr-2" />
                            {post.author}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <BookOpen className="h-4 w-4 mr-2" />
                            {post.category}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Eye className="h-4 w-4 mr-2" />
                            {post.views} views
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Not published"}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Blog Post</DialogTitle>
                            </DialogHeader>
                            <BlogPostForm
                              initialData={post}
                              onSubmit={(data) => {
                                setBlogPosts(
                                  blogPosts.map((p) =>
                                    p.id === post.id
                                      ? {
                                          ...p,
                                          ...data,
                                          updatedAt: new Date().toISOString(),
                                          publishedAt:
                                            data.status === "published" && !p.publishedAt
                                              ? new Date().toISOString()
                                              : p.publishedAt,
                                        }
                                      : p,
                                  ),
                                )
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{post.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBlogPost(post.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Button>
            </div>

            <div className="grid gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </h3>
                          <Badge
                            className={
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : user.status === "suspended"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{user.email}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            {user.profileCompletion}% complete
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <FileText className="h-4 w-4 mr-2" />
                            {user.applicationsCount} applications
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            Joined {new Date(user.joinedAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Users className="h-4 w-4 mr-2" />
                            Last login {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        {user.status === "active" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateUserStatus(user.id, "suspended")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateUserStatus(user.id, "active")}
                            className="text-green-600 hover:text-green-700"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Scholarship Form Component
function ScholarshipForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<Scholarship>
  onSubmit: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    amount: initialData?.amount || "",
    deadline: initialData?.deadline || "",
    category: initialData?.category || "",
    eligibility: initialData?.eligibility?.join(", ") || "",
    requirements: initialData?.requirements?.join(", ") || "",
    provider: initialData?.provider || "",
    status: initialData?.status || "active",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      eligibility: formData.eligibility.split(", ").filter(Boolean),
      requirements: formData.requirements.split(", ").filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Merit-Based">Merit-Based</SelectItem>
              <SelectItem value="Need-Based">Need-Based</SelectItem>
              <SelectItem value="STEM">STEM</SelectItem>
              <SelectItem value="Academic Excellence">Academic Excellence</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="provider">Provider</Label>
        <Input
          id="provider"
          value={formData.provider}
          onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="eligibility">Eligibility (comma-separated)</Label>
        <Input
          id="eligibility"
          value={formData.eligibility}
          onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
          placeholder="Undergraduate, Graduate, International Students"
        />
      </div>
      <div>
        <Label htmlFor="requirements">Requirements (comma-separated)</Label>
        <Textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          placeholder="3.5 GPA minimum, Essay required, Letters of recommendation"
        />
      </div>
      <Button type="submit" className="w-full bg-navy hover:bg-navy/90 text-white">
        {initialData ? "Update" : "Create"} Scholarship
      </Button>
    </form>
  )
}

// Blog Post Form Component
function BlogPostForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<BlogPost>
  onSubmit: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    author: initialData?.author || "",
    category: initialData?.category || "",
    tags: initialData?.tags?.join(", ") || "",
    status: initialData?.status || "draft",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      tags: formData.tags.split(", ").filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Application Tips">Application Tips</SelectItem>
              <SelectItem value="Financial Aid">Financial Aid</SelectItem>
              <SelectItem value="International">International</SelectItem>
              <SelectItem value="Success Stories">Success Stories</SelectItem>
              <SelectItem value="News">News</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="essays, writing, tips"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full bg-navy hover:bg-navy/90 text-white">
        {initialData ? "Update" : "Create"} Blog Post
      </Button>
    </form>
  )
}
