"use client";

import { useEffect, useState } from "react";
import { Models, Query } from "appwrite";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { NewsletterSubscription } from "@/components/newsletter-subscription";
import { databaseId, databases } from "@/lib/appwrite";

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<Models.DefaultDocument[]>([]);
  const [featuredPost, setFeaturedPost] =
    useState<Models.DefaultDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "Tips",
    "Guide",
    "Success Story",
    "Field-Specific",
    "Graduate",
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await databases.listDocuments(
          databaseId, // replace with your actual database ID
          "blogs", // replace with your blog collection ID
          [Query.orderDesc("$createdAt"), Query.limit(20)]
        );
        const posts = response.documents;
        setBlogPosts(posts);
        const featured = posts.find((post) => post.tags?.includes("featured"));
        setFeaturedPost(featured || posts[0]);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-24 lg:py-36 pb-12">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Resources & Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Expert tips, comprehensive guides, and inspiring success stories to
            help you succeed in your scholarship journey
          </p>
        </div>

        {/* Featured Article */}
        <Card className="mb-12 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto">
              <Image
                src={featuredPost?.image || "/placeholder.svg"}
                alt={featuredPost?.title || "featured post"}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-gold text-navy">
                Featured
              </Badge>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  {featuredPost?.category}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {featuredPost?.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {featuredPost?.excerpt}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 pb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {featuredPost?.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {featuredPost?.$createdAt &&
                      new Date(
                        featuredPost?.$createdAt as string
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </div>
                  <div>{featuredPost?.readTime} min</div>
                </div>
                <Link href={`/blog/${featuredPost?.id}`}>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border p-6 mb-8">
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
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredPosts.length} articles found
            </p>
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
                <Badge className="absolute top-4 left-4 bg-navy/90 text-white">
                  {post.category}
                </Badge>
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
                    {new Date(post.$createdAt as string).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
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
  );
}
