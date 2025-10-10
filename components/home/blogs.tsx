"use client";

import { useEffect, useState } from "react";
import { databaseId, databases } from "@/lib/appwrite"; // your Appwrite client setup
import { Models, Query } from "appwrite";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen } from "lucide-react";

const HomeBlogList = () => {
  const [blogPosts, setBlogPosts] = useState<Models.DefaultDocument[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await databases.listDocuments(databaseId, "blogs", [
          Query.limit(6),
          Query.orderDesc("$createdAt"),
        ]);
        setBlogPosts(response.documents);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Latest Resources
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Expert tips, guides, and success stories to help you succeed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={post.$id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden animate-fade-in !border-2"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-navy text-white">
                  {post.category}
                </Badge>
              </div>
              <CardContent className="p-6 space-y-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {post.date}
                </div>
                <CardTitle className="text-xl group-hover:text-navy dark:group-hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
                <Link
                  href={`/blog/${post.slug}`}
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
            <button className="border-navy text-navy hover:bg-navy hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy bg-transparent px-6 py-3 rounded-lg border text-lg font-medium inline-flex items-center">
              View All Resources
              <BookOpen className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeBlogList;
