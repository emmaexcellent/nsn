"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Models } from "appwrite";
import Loader from "@/components/loader";
import DashboardOverview from "./overview";
import ScholarshipsTab from "./scholarships-tab";
import BlogPostsTab from "./blog/blog-tabs";
import UsersTab from "./user-tab";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";
import { apiRequest } from "@/lib/api-client";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [scholarships, setScholarships] = useState<Models.Document[]>([]);
  const [blogPosts, setBlogPosts] = useState<Models.Document[]>([]);
  const [users, setUsers] = useState<Models.Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Check admin access
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // No user logged in, redirect to home
        router.push("/");
        return;
      }

      if (user?.role !== "admin") {
        // User is not admin, show unauthorized state
        setAccessDenied(true);
        setDataLoading(false); // Stop data loading since user can't access
        return;
      }

      // User is admin, proceed with data fetching
      setAccessDenied(false);
    }
  }, [user, authLoading, router]);

  // Fetch data only when admin access is confirmed
  const fetchData = useCallback(async () => {
    if (accessDenied || !user || user.role !== "admin") return;

    setDataLoading(true);
    setErrorMessage("");
    try {
      const response = await apiRequest<{
        scholarships: Models.Document[];
        blogPosts: Models.Document[];
        users: Models.Document[];
      }>("/api/admin/dashboard");

      setScholarships(response.scholarships);
      setBlogPosts(response.blogPosts);
      setUsers(response.users);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load the admin dashboard."
      );
    } finally {
      setDataLoading(false);
    }
  }, [accessDenied, user]);

  // Fetch data when admin access is confirmed
  useEffect(() => {
    if (user?.role === "admin" && !accessDenied) {
      fetchData();
    }
  }, [user, accessDenied, fetchData]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  // Show unauthorized component if access is denied
  if (accessDenied) {
    return (
      <div className="max-w-6xl w-full mx-auto px-4 py-8 pt-24">
        <Unauthorized
          title="Access Denied"
          message="You don't have permission to access the admin dashboard."
          suggestion="Please contact an administrator if you believe this is an error."
        />
      </div>
    );
  }

  // Show loading state while fetching dashboard data
  if (dataLoading) {
    return (
      <div className="max-w-6xl w-full mx-auto px-4 py-8 pt-24">
        <DashboardHeader />
        <div className="mt-8">
          <Tabs>
            <TabsList className="grid w-full grid-cols-2 gap-2 opacity-50 md:grid-cols-4">
              <TabsTrigger value="overview" className="min-w-0 text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="scholarships"
                className="min-w-0 text-xs sm:text-sm"
              >
                Scholarships
              </TabsTrigger>
              <TabsTrigger value="blog" className="min-w-0 text-xs sm:text-sm">
                Blog Posts
              </TabsTrigger>
              <TabsTrigger value="users" className="min-w-0 text-xs sm:text-sm">
                Users
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-8 flex justify-center items-center h-64">
            <div className="text-center">
              <Loader />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading dashboard data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-8 pt-24">
      <DashboardHeader />
      {errorMessage ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setSearchTerm("");
        }}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
          <TabsTrigger value="overview" className="min-w-0 text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="scholarships"
            className="min-w-0 text-xs sm:text-sm"
          >
            Scholarships
          </TabsTrigger>
          <TabsTrigger value="blog" className="min-w-0 text-xs sm:text-sm">
            Blog Posts
          </TabsTrigger>
          <TabsTrigger value="users" className="min-w-0 text-xs sm:text-sm">
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DashboardOverview
            scholarships={scholarships}
            blogPosts={blogPosts}
            users={users}
          />
        </TabsContent>

        <TabsContent value="scholarships">
          <ScholarshipsTab
            scholarships={scholarships}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onScholarshipsChange={setScholarships}
          />
        </TabsContent>

        <TabsContent value="blog">
          <BlogPostsTab
            blogPosts={blogPosts}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onBlogPostsChange={setBlogPosts}
          />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab
            users={users}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Manage scholarships, blog posts, and users
      </p>
    </div>
  );
}

interface UnauthorizedProps {
  title?: string;
  message?: string;
  suggestion?: string;
}

function Unauthorized({
  title = "Access Denied",
  message = "You don't have permission to access this page.",
  suggestion = "Please contact an administrator if you believe this is an error.",
}: UnauthorizedProps) {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-2 max-w-md">
        {message}
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-500 mb-8 max-w-md">
        {suggestion}
      </p>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.push("/")}>
          Go Home
        </Button>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    </div>
  );
}
