"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Models } from "appwrite";
import SearchBar from "../search";
import BlogPostForm, { BlogFormDataType } from "./post-form";
import BlogPostCard from "./blog-card";
import useSubmitBlogPost from "./submit-blog";

interface BlogPostsTabProps {
  blogPosts: Models.Document[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onBlogPostsChange: (blogPosts: Models.Document[]) => void;
}

export default function BlogPostsTab({
  blogPosts,
  searchTerm,
  onSearchChange,
  onBlogPostsChange,
}: BlogPostsTabProps) {
  const [isAddingBlogPost, setIsAddingBlogPost] = useState(false);
  const [editingBlogPost, setEditingBlogPost] =
    useState<Models.Document | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    loading,
    clearError,
    error,
  } = useSubmitBlogPost();

  const filteredBlogPosts = blogPosts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetMessages = () => {
    clearError();
    setStatusMessage("");
  };

  const handleAddBlogPost = async (formData: BlogFormDataType) => {
    const newPost = await createBlogPost(formData);
    if (newPost) {
      onBlogPostsChange([newPost, ...blogPosts]);
      setIsAddingBlogPost(false);
      clearError();
      setStatusMessage("Blog post created successfully.");
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    const success = await deleteBlogPost(id);
    if (success) {
      onBlogPostsChange(blogPosts.filter((post) => post.$id !== id));
      clearError();
      setStatusMessage("Blog post deleted successfully.");
    }
  };

  const handleUpdateBlogPost = async (formData: BlogFormDataType) => {
    if (!editingBlogPost) {
      return;
    }

    const result = await updateBlogPost(editingBlogPost.$id, formData);
    if (result) {
      onBlogPostsChange(
        blogPosts.map((post) => (post.$id === result.$id ? result : post))
      );
      setEditingBlogPost(null);
      clearError();
      setStatusMessage("Blog post updated successfully.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={onSearchChange}
        />
        <Dialog
          open={isAddingBlogPost}
          onOpenChange={(open) => {
            setIsAddingBlogPost(open);
            if (!open) resetMessages();
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Blog Post</DialogTitle>
              <DialogDescription>Create a new blog post.</DialogDescription>
            </DialogHeader>
            <BlogPostForm
              onSubmit={handleAddBlogPost}
              isLoading={loading}
              onCancel={() => {
                setIsAddingBlogPost(false);
                resetMessages();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {statusMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {statusMessage}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{filteredBlogPosts.length} blog posts</span>
        {searchTerm ? <span>Filtered by &quot;{searchTerm}&quot;</span> : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredBlogPosts.map((post) => (
          <BlogPostCard
            key={post.$id}
            post={post}
            onEdit={setEditingBlogPost}
            isLoading={loading}
            onDelete={handleDeleteBlogPost}
          />
        ))}
      </div>

      {filteredBlogPosts.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-12 text-center text-sm text-muted-foreground">
          No blog posts match the current search.
        </div>
      ) : null}

      <Dialog
        open={!!editingBlogPost}
        onOpenChange={(open) => {
          if (!open) {
            setEditingBlogPost(null);
            resetMessages();
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>Update blog post details.</DialogDescription>
          </DialogHeader>
          <BlogPostForm
            initialData={editingBlogPost}
            isLoading={loading}
            onSubmit={handleUpdateBlogPost}
            onCancel={() => {
              setEditingBlogPost(null);
              resetMessages();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
