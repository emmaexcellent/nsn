"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { databaseId, databases } from "@/lib/appwrite";
import { Models, Query } from "appwrite";
import Loader from "@/components/loader";
import DashboardOverview from "./overview";
import ScholarshipsTab from "./scholarships-tab";
import BlogPostsTab from "./blog/blog-tabs";
import UsersTab from "./user-tab";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [scholarships, setScholarships] = useState<Models.Document[]>([]);
  const [blogPosts, setBlogPosts] = useState<Models.Document[]>([]);
  const [users, setUsers] = useState<Models.Document[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  
  if (dataLoading) return <Loader />;

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
