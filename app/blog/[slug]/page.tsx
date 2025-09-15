"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import {
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Calendar,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Reply,
  ThumbsUp,
} from "lucide-react"
import { useAuth } from "@/context/auth"

// Mock blog post data
const mockBlogPost = {
  id: 1,
  slug: "scholarship-essay-tips",
  title: "10 Essential Tips for Writing Winning Scholarship Essays",
  excerpt:
    "Master the art of scholarship essay writing with these proven strategies that have helped thousands of students secure funding for their education.",
  content: `
    <div class="prose max-w-none">
      <p>Writing a compelling scholarship essay can be the difference between receiving funding and missing out on educational opportunities. After reviewing thousands of successful applications, we've identified the key strategies that make essays stand out.</p>
      
      <h2>1. Start with a Compelling Hook</h2>
      <p>Your opening sentence should grab the reader's attention immediately. Consider starting with a thought-provoking question, a surprising statistic, or a brief anecdote that relates to your scholarship goals.</p>
      
      <h2>2. Tell Your Unique Story</h2>
      <p>Scholarship committees read hundreds of essays. What makes yours different? Focus on experiences, challenges, or perspectives that are uniquely yours. Avoid generic statements and clichés.</p>
      
      <h2>3. Address the Prompt Directly</h2>
      <p>Make sure you're answering the specific question asked. Many applicants write great essays that don't actually address the prompt. Read the requirements carefully and structure your response accordingly.</p>
      
      <h2>4. Show, Don't Just Tell</h2>
      <p>Instead of simply stating that you're passionate about environmental science, describe the moment you realized the impact of climate change on your community. Use specific examples and vivid details.</p>
      
      <h2>5. Demonstrate Impact and Growth</h2>
      <p>Scholarship providers want to invest in students who will make a difference. Show how your experiences have shaped you and how you plan to use your education to create positive change.</p>
      
      <h2>6. Research the Organization</h2>
      <p>Tailor your essay to align with the scholarship provider's values and mission. This shows genuine interest and helps you stand out from generic applications.</p>
      
      <h2>7. Use a Clear Structure</h2>
      <p>Organize your essay with a clear introduction, body paragraphs that each focus on a specific point, and a strong conclusion that ties everything together.</p>
      
      <h2>8. Edit Ruthlessly</h2>
      <p>Your first draft is never your final draft. Review for clarity, grammar, and flow. Read it aloud to catch awkward phrasing. Consider having others review it as well.</p>
      
      <h2>9. Stay Within Word Limits</h2>
      <p>Respect the word count requirements. Going significantly over or under the limit can hurt your chances. Use the space efficiently to make your strongest points.</p>
      
      <h2>10. End with a Strong Conclusion</h2>
      <p>Your conclusion should reinforce your main message and leave a lasting impression. Avoid simply summarizing what you've already said – instead, look forward to your future goals and impact.</p>
      
      <p>Remember, a great scholarship essay is more than just good writing – it's a window into who you are as a person and what you hope to achieve. Take the time to craft something that truly represents your voice and aspirations.</p>
    </div>
  `,
  author: {
    name: "Sarah Johnson",
    bio: "Education Consultant and Former Scholarship Committee Member",
    avatar: "/placeholder-user.jpg",
  },
  publishedAt: "2024-01-15",
  readTime: 8,
  category: "Application Tips",
  tags: ["Essays", "Writing Tips", "Application Strategy", "Student Success"],
  likes: 234,
  views: 1847,
  comments: [],
}

// Mock related posts
const relatedPosts = [
  {
    id: 2,
    slug: "financial-aid-guide",
    title: "Complete Guide to Financial Aid Options",
    excerpt: "Explore all available financial aid options including grants, loans, and work-study programs.",
    publishedAt: "2024-01-10",
    readTime: 12,
    category: "Financial Aid",
  },
  {
    id: 3,
    slug: "interview-preparation",
    title: "Scholarship Interview Preparation Guide",
    excerpt: "Ace your scholarship interviews with these proven preparation strategies and common questions.",
    publishedAt: "2024-01-08",
    readTime: 6,
    category: "Interview Tips",
  },
  {
    id: 4,
    slug: "stem-scholarships",
    title: "Top STEM Scholarships for 2024",
    excerpt: "Discover the best STEM scholarship opportunities available for science and technology students.",
    publishedAt: "2024-01-05",
    readTime: 10,
    category: "STEM",
  },
]

export default function BlogPostDetail() {
  const params = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(mockBlogPost)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(mockBlogPost.likes)
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Alex Thompson",
      content:
        "This is incredibly helpful! I used these tips for my recent scholarship application and it made such a difference in how I approached the essay.",
      publishedAt: "2024-01-16",
      likes: 12,
      replies: [
        {
          id: 2,
          author: "Sarah Johnson",
          content: "So glad to hear it helped! Best of luck with your application.",
          publishedAt: "2024-01-16",
          likes: 3,
        },
      ],
    },
    {
      id: 3,
      author: "Maria Rodriguez",
      content:
        "The tip about researching the organization really resonates with me. I spent time understanding the scholarship provider's mission and it definitely showed in my essay.",
      publishedAt: "2024-01-17",
      likes: 8,
      replies: [],
    },
    {
      id: 4,
      author: "James Wilson",
      content: "Question: How long should the hook be? I'm struggling with making it compelling but not too long.",
      publishedAt: "2024-01-18",
      likes: 5,
      replies: [
        {
          id: 5,
          author: "Sarah Johnson",
          content:
            "Great question! Usually 1-2 sentences is perfect. You want to grab attention quickly and then transition into your main story.",
          publishedAt: "2024-01-18",
          likes: 7,
        },
      ],
    },
  ])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyContent, setReplyContent] = useState("")
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleLike = () => {
    if (!user) {
      // Redirect to login or show login modal
      return
    }

    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = post.title

    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case "copy":
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400")
    }

    setShareMenuOpen(false)
  }

  const handleAddComment = () => {
    if (!user) {
      // Redirect to login or show login modal
      return
    }

    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      author: user.name,
      content: newComment,
      publishedAt: new Date().toISOString().split("T")[0],
      likes: 0,
      replies: [],
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  const handleAddReply = (commentId: number) => {
    if (!user || !replyContent.trim()) return

    const reply = {
      id: Date.now(),
      author: user.name,
      content: replyContent,
      publishedAt: new Date().toISOString().split("T")[0],
      likes: 0,
    }

    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )

    setReplyContent("")
    setReplyingTo(null)
  }

  const handleLikeComment = (commentId: number, isReply = false, parentId = null) => {
    if (!user) return

    if (isReply) {
      setComments(
        comments.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply,
                ),
              }
            : comment,
        ),
      )
    } else {
      setComments(
        comments.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment)),
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{post.category}</Badge>
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{post.excerpt}</p>

                {/* Author and Meta Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <Image
                        src={post.author.avatar || "/placeholder.svg"}
                        alt={post.author.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{post.author.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{post.author.bio}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime} min read
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center gap-2"
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                      {likes}
                    </Button>

                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShareMenuOpen(!shareMenuOpen)}
                        className="flex items-center gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>

                      {shareMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10">
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare("facebook")}
                              className="justify-start"
                            >
                              <Facebook className="h-4 w-4 mr-2" />
                              Facebook
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare("twitter")}
                              className="justify-start"
                            >
                              <Twitter className="h-4 w-4 mr-2" />
                              Twitter
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare("linkedin")}
                              className="justify-start"
                            >
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleShare("copy")}
                              className="justify-start"
                            >
                              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                              {copied ? "Copied!" : "Copy Link"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <MessageCircle className="h-4 w-4" />
                      {comments.length} comments
                    </span>
                  </div>

                  <span className="text-sm text-gray-600 dark:text-gray-400">{post.views} views</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </article>

            {/* Comments Section */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments ({comments.length})</h3>

              {/* Add Comment Form */}
              {user ? (
                <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <Image
                        src={user.avatar || "/placeholder-user.jpg"}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-3"
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-3">Please log in to leave a comment</p>
                  <Button variant="outline">Sign In</Button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {comment.author.charAt(0)}
                        </div>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{comment.author}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(comment.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeComment(comment.id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                          >
                            <ThumbsUp className="h-4 w-4" />
                            {comment.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(comment.id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
                          >
                            <Reply className="h-4 w-4" />
                            Reply
                          </Button>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && user && (
                          <div className="mt-4 ml-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Avatar className="h-8 w-8">
                                <Image
                                  src={user.avatar || "/placeholder-user.jpg"}
                                  alt={user.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              </Avatar>
                              <div className="flex-1">
                                <Textarea
                                  placeholder="Write a reply..."
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  className="mb-2"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddReply(comment.id)}
                                    disabled={!replyContent.trim()}
                                  >
                                    Reply
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setReplyingTo(null)
                                      setReplyContent("")
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 ml-4 space-y-4">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                              >
                                <Avatar className="h-8 w-8">
                                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {reply.author.charAt(0)}
                                  </div>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                      {reply.author}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(reply.publishedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{reply.content}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-xs"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    {reply.likes}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Author Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Author</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <Image
                        src={post.author.avatar || "/placeholder.svg"}
                        alt={post.author.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{post.author.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{post.author.bio}</p>
                </CardContent>
              </Card>

              {/* Related Posts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="block group">
                      <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {relatedPost.category}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relatedPost.readTime} min
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                          {relatedPost.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{relatedPost.excerpt}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {new Date(relatedPost.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Get the latest scholarship tips and opportunities delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Enter your email" type="email" />
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
