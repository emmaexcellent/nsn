"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { databases, databaseId } from "@/lib/appwrite";
import { Query } from "appwrite";
import Image from "next/image";
import {
  Calendar,
  Clock,
  User,
  ChevronLeft,
  Bookmark,
  Eye,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  normalizeBlogPost,
  type BlogPostDocument,
} from "@/lib/documents";
import { apiRequest } from "@/lib/api-client";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<ReturnType<typeof normalizeBlogPost> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<
    ReturnType<typeof normalizeBlogPost>[]
  >([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const slug = params.slug as string;

  const fetchBlogPost = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await databases.listDocuments(databaseId, "blogs", [
        Query.equal("slug", slug),
        Query.limit(1),
      ]);

      if (response.documents.length === 0) {
        setError("Blog post not found");
        return;
      }

      const postData = normalizeBlogPost(
        response.documents[0] as BlogPostDocument
      );
      setPost(postData);

      await apiRequest(`/api/blogs/${postData.$id}/view`, {
        method: "POST",
        body: JSON.stringify({
          views: (postData.views || 0) + 1,
        }),
        skipAuth: true,
      });

      const relatedResponse = await databases.listDocuments(databaseId, "blogs", [
        Query.equal("category", postData.category ?? ""),
        Query.notEqual("$id", postData.$id),
        Query.equal("status", "published"),
        Query.orderDesc("$createdAt"),
        Query.limit(3),
      ]);

      setRelatedPosts(
        relatedResponse.documents.map((document) =>
          normalizeBlogPost(document as BlogPostDocument)
        )
      );

      const bookmarks = JSON.parse(
        localStorage.getItem("blog-bookmarks") || "[]"
      ) as string[];
      setIsBookmarked(bookmarks.includes(slug));
    } catch (err) {
      console.error("Error fetching blog post:", err);
      setError("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      void fetchBlogPost();
    }
  }, [slug, fetchBlogPost]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(
      localStorage.getItem("blog-bookmarks") || "[]"
    ) as string[];

    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((bookmark) => bookmark !== slug);
      localStorage.setItem("blog-bookmarks", JSON.stringify(newBookmarks));
    } else {
      bookmarks.push(slug);
      localStorage.setItem("blog-bookmarks", JSON.stringify(bookmarks));
    }

    setIsBookmarked(!isBookmarked);
  };

  const sharePost = (platform: string) => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title ?? "Scholarship article";

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank",
          "noopener,noreferrer"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`,
          "_blank",
          "noopener,noreferrer"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank",
          "noopener,noreferrer"
        );
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const markdownComponents: Components = {
    h1: (props) => (
      <h1
        className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="text-xl font-bold mt-5 mb-3 text-gray-900 dark:text-white"
        {...props}
      />
    ),
    h4: (props) => (
      <h4
        className="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-white"
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="my-4 text-gray-700 dark:text-gray-300 leading-relaxed"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="my-4 ml-6 list-disc text-gray-700 dark:text-gray-300"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="my-4 ml-6 list-decimal text-gray-700 dark:text-gray-300"
        {...props}
      />
    ),
    li: (props) => <li className="mb-2" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-600 dark:text-gray-400"
        {...props}
      />
    ),
    code: ({ className, ...props }) => {
      const isInline = !className;

      if (isInline) {
        return (
          <code
            className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono"
            {...props}
          />
        );
      }

      return (
        <code
          className={`block bg-gray-100 dark:bg-gray-800 p-4 rounded my-4 overflow-x-auto text-sm font-mono ${className}`}
          {...props}
        />
      );
    },
    a: (props) => (
      <a
        className="text-blue-600 dark:text-blue-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    strong: (props) => (
      <strong className="font-bold text-gray-900 dark:text-white" {...props} />
    ),
    em: (props) => <em className="italic" {...props} />,
    hr: (props) => (
      <hr className="my-8 border-gray-300 dark:border-gray-700" {...props} />
    ),
    table: (props) => (
      <div className="overflow-x-auto my-6">
        <table
          className="min-w-full divide-y divide-gray-300 dark:divide-gray-700"
          {...props}
        />
      </div>
    ),
    th: (props) => (
      <th
        className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-left text-sm font-semibold text-gray-900 dark:text-white"
        {...props}
      />
    ),
    td: (props) => (
      <td
        className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700"
        {...props}
      />
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-8"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">Article</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || "Post Not Found"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/blog")}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="border-b dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Badge variant="secondary" className="mb-2">
            {post.category}
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="font-medium text-gray-900 dark:text-white">
              {post.author}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readTime} min read</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{post.views || 0} views</span>
          </div>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="w-full flex items-center justify-center">
          {post.imageUrl && (
            <div className="relative h-auto rounded-xl overflow-hidden mb-8">
              <Image
                src={post.imageUrl}
                alt={post.title || "Blog image"}
                height={600}
                width={500}
                className="h-auto object-cover"
                priority
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            onClick={toggleBookmark}
          >
            <Bookmark
              className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
            />
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sharePost("twitter")}
          >
            <Twitter className="w-4 h-4 mr-2" />
            Tweet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sharePost("facebook")}
          >
            <Facebook className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sharePost("linkedin")}
          >
            <Linkedin className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {post.content || ""}
          </ReactMarkdown>
        </div>

        {post.authorBio && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {post.author}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Author
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{post.authorBio}</p>
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.$id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="border dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {relatedPost.imageUrl && (
                      <div className="relative h-32">
                        <Image
                          src={relatedPost.imageUrl}
                          alt={relatedPost.title || "Related post image"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 text-sm">
                        {relatedPost.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{relatedPost.readTime} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">
            Enjoyed this article?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Share it with your friends and help spread the knowledge.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => sharePost("twitter")}
              className="flex-1"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sharePost("linkedin")}
              className="flex-1"
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </div>

        {post.updatedAt && (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">
            Last updated: {formatDate(post.updatedAt)}
          </div>
        )}

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/blog")}
            className="mx-auto"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to All Articles
          </Button>
        </div>
      </article>
    </div>
  );
}
