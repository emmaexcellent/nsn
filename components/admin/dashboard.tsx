"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { databaseId, databases } from "@/lib/appwrite";
import { Models, Query } from "appwrite";
import Loader from "@/components/loader";
import DashboardOverview from "./overview";
import ScholarshipsTab from "./scholarships-tab";
import BlogPostsTab from "./blog/blog-tabs";
import UsersTab from "./user-tab";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Button } from "../ui/button";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [scholarships, setScholarships] = useState<Models.DefaultDocument[]>(
    []
  );
  const [blogPosts, setBlogPosts] = useState<Models.DefaultDocument[]>([]);
  const [users, setUsers] = useState<Models.DefaultDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);
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
    try {
      const [scholarshipResponse, blogResponse, userResponse] =
        await Promise.all([
          databases.listDocuments(databaseId, "scholarships", [
            Query.orderDesc("$createdAt"),
          ]),
          databases.listDocuments(databaseId, "blogs", [
            Query.orderDesc("$createdAt"),
          ]),
          databases.listDocuments(databaseId, "profile", [
            Query.orderDesc("$createdAt"),
          ]),
        ]);

      setScholarships(scholarshipResponse.documents);
      setBlogPosts(blogResponse.documents);
      setUsers(userResponse.documents);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally show error state to user
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
            <TabsList className="grid w-full grid-cols-4 opacity-50 pointer-events-none">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
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