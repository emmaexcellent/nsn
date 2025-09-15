"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  GraduationCap,
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  Calendar,
  DollarSign,
  UserCheck,
  BookOpen,
} from "lucide-react"

// Mock data for admin dashboard
const mockStats = {
  scholarships: {
    total: 156,
    active: 142,
    applications: 2847,
  },
  users: {
    total: 1234,
    active: 987,
    newThisMonth: 89,
  },
  blog: {
    total: 45,
    published: 42,
    views: 15678,
  },
}

const mockScholarships = [
  {
    id: 1,
    title: "STEM Excellence Scholarship",
    provider: "Tech Foundation",
    amount: 5000,
    deadline: "2024-03-15",
    applications: 234,
    status: "active",
    category: "STEM",
  },
  {
    id: 2,
    title: "Community Leadership Award",
    provider: "Community Fund",
    amount: 2500,
    deadline: "2024-02-28",
    applications: 156,
    status: "active",
    category: "Leadership",
  },
  {
    id: 3,
    title: "Arts & Culture Grant",
    provider: "Arts Council",
    amount: 3000,
    deadline: "2024-01-30",
    applications: 89,
    status: "expired",
    category: "Arts",
  },
]

const mockBlogPosts = [
  {
    id: 1,
    title: "10 Tips for Writing Winning Scholarship Essays",
    author: "Sarah Johnson",
    status: "published",
    views: 1234,
    publishedAt: "2024-01-15",
    category: "Application Tips",
  },
  {
    id: 2,
    title: "Understanding Financial Aid Options",
    author: "Mike Chen",
    status: "published",
    views: 987,
    publishedAt: "2024-01-10",
    category: "Financial Aid",
  },
  {
    id: 3,
    title: "International Student Scholarship Guide",
    author: "Emma Davis",
    status: "draft",
    views: 0,
    publishedAt: null,
    category: "International",
  },
]

const mockUsers = [
  {
    id: 1,
    name: "Alex Thompson",
    email: "alex@example.com",
    joinDate: "2024-01-05",
    applications: 12,
    status: "active",
    profileComplete: 85,
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    email: "maria@example.com",
    joinDate: "2024-01-03",
    applications: 8,
    status: "active",
    profileComplete: 92,
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james@example.com",
    joinDate: "2023-12-28",
    applications: 15,
    status: "inactive",
    profileComplete: 67,
  },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [scholarships, setScholarships] = useState(mockScholarships)
  const [blogPosts, setBlogPosts] = useState(mockBlogPosts)
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingScholarship, setIsAddingScholarship] = useState(false)
  const [isAddingBlogPost, setIsAddingBlogPost] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState(null)
  const [editingBlogPost, setEditingBlogPost] = useState(null)

  // Check if user is admin
  useEffect(() => {
    if (!user || user.email !== "admin@nsn.org") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.email !== "admin@nsn.org") {
    return null
  }

  const handleDeleteScholarship = (id: number) => {
    setScholarships(scholarships.filter((s) => s.id !== id))
  }

  const handleDeleteBlogPost = (id: number) => {
    setBlogPosts(blogPosts.filter((p) => p.id !== id))
  }

  const handleAddScholarship = (formData: any) => {
    const newScholarship = {
      id: Date.now(),
      ...formData,
      applications: 0,
      status: "active",
    }
    setScholarships([...scholarships, newScholarship])
    setIsAddingScholarship(false)
  }

  const handleAddBlogPost = (formData: any) => {
    const newPost = {
      id: Date.now(),
      ...formData,
      views: 0,
      publishedAt: formData.status === "published" ? new Date().toISOString().split("T")[0] : null,
    }
    setBlogPosts([...blogPosts, newPost])
    setIsAddingBlogPost(false)
  }

  const filteredScholarships = scholarships.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredBlogPosts = blogPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage scholarships, blog posts, and users</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scholarships</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.scholarships.total}</div>
                <p className="text-xs text-muted-foreground">{mockStats.scholarships.active} active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.users.total}</div>
                <p className="text-xs text-muted-foreground">+{mockStats.users.newThisMonth} this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.blog.total}</div>
                <p className="text-xs text-muted-foreground">{mockStats.blog.views} total views</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scholarships.slice(0, 3).map((scholarship) => (
                    <div key={scholarship.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{scholarship.title}</p>
                        <p className="text-sm text-muted-foreground">{scholarship.applications} applications</p>
                      </div>
                      <Badge variant={scholarship.status === "active" ? "default" : "secondary"}>
                        {scholarship.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {blogPosts
                    .filter((p) => p.status === "published")
                    .slice(0, 3)
                    .map((post) => (
                      <div key={post.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-sm text-muted-foreground">{post.views} views</p>
                        </div>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scholarships" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scholarships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Dialog open={isAddingScholarship} onOpenChange={setIsAddingScholarship}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Scholarship
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Scholarship</DialogTitle>
                  <DialogDescription>Create a new scholarship opportunity</DialogDescription>
                </DialogHeader>
                <ScholarshipForm onSubmit={handleAddScholarship} onCancel={() => setIsAddingScholarship(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredScholarships.map((scholarship) => (
              <Card key={scholarship.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{scholarship.title}</h3>
                        <Badge
                          variant={
                            scholarship.status === "active"
                              ? "default"
                              : scholarship.status === "expired"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {scholarship.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{scholarship.provider}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />${scholarship.amount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {scholarship.deadline}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {scholarship.applications} applications
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingScholarship(scholarship)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
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
                            <AlertDialogAction onClick={() => handleDeleteScholarship(scholarship.id)}>
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

        <TabsContent value="blog" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Dialog open={isAddingBlogPost} onOpenChange={setIsAddingBlogPost}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Blog Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Blog Post</DialogTitle>
                  <DialogDescription>Create a new blog post</DialogDescription>
                </DialogHeader>
                <BlogPostForm onSubmit={handleAddBlogPost} onCancel={() => setIsAddingBlogPost(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredBlogPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">By {post.author}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views} views
                        </span>
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {post.publishedAt}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingBlogPost(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
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
                            <AlertDialogAction onClick={() => handleDeleteBlogPost(post.id)}>Delete</AlertDialogAction>
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

        <TabsContent value="users" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{user.email}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {user.joinDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {user.applications} applications
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4" />
                          {user.profileComplete}% complete
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Scholarship Form Component
function ScholarshipForm({ onSubmit, onCancel, initialData = null }: any) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    provider: initialData?.provider || "",
    amount: initialData?.amount || "",
    deadline: initialData?.deadline || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || "",
    ...initialData,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="provider">Provider</Label>
          <Input
            id="provider"
            value={formData.provider}
            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number.parseInt(e.target.value) })}
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
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STEM">STEM</SelectItem>
              <SelectItem value="Leadership">Leadership</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
              <SelectItem value="Community Service">Community Service</SelectItem>
              <SelectItem value="Need-Based">Need-Based</SelectItem>
              <SelectItem value="Merit-Based">Merit-Based</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          rows={3}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Create"} Scholarship</Button>
      </DialogFooter>
    </form>
  )
}

// Blog Post Form Component
function BlogPostForm({ onSubmit, onCancel, initialData = null }: any) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    author: initialData?.author || "",
    category: initialData?.category || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    status: initialData?.status || "draft",
    ...initialData,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <SelectItem value="STEM">STEM</SelectItem>
              <SelectItem value="Success Stories">Success Stories</SelectItem>
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={6}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? "Update" : "Create"} Post</Button>
      </DialogFooter>
    </form>
  )
}
