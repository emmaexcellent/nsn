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

  const {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    loading,
    clearError,
    error,
  } = useSubmitBlogPost();

  const filteredBlogPosts = blogPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.author && p.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddBlogPost = async (formData: BlogFormDataType) => {
    const newPost = await createBlogPost(formData);
    if (newPost) {
      onBlogPostsChange([...blogPosts, newPost as Models.Document]);
      setIsAddingBlogPost(false);
      clearError();
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    await deleteBlogPost(id);
    onBlogPostsChange(blogPosts.filter((p) => p.$id !== id));
    clearError();
  };

  const handleUpdateBlogPost = async (formData: BlogFormDataType) => {
    if (editingBlogPost) {
      const result = await updateBlogPost(editingBlogPost.$id, formData);
      if (result) {
        const updatedList = blogPosts.map((p) =>
          p.$id === result.$id ? result : p
        );
        onBlogPostsChange(updatedList);
        setEditingBlogPost(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={onSearchChange}
        />
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <BlogPostForm
              onSubmit={handleAddBlogPost}
              isLoading={loading}
              onCancel={() => setIsAddingBlogPost(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
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

      {/* Edit Blog Post Dialog */}
      <Dialog
        open={!!editingBlogPost}
        onOpenChange={() => setEditingBlogPost(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>Update blog post details</DialogDescription>
          </DialogHeader>
          <BlogPostForm
            initialData={editingBlogPost}
            isLoading={loading}
            onSubmit={handleUpdateBlogPost}
            onCancel={() => setEditingBlogPost(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
