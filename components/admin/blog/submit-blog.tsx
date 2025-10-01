import { useState } from "react";
import { ID } from "appwrite";
import { databases, storage, databaseId, bucketId } from "@/lib/appwrite";

export default function useBlogPostActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = (data: any) => {
    const required = [
      "title",
      "excerpt",
      "content",
      "category",
      "authorName",
      "readTime",
      "status",
    ];
    for (const field of required) {
      if (!data[field]) return `Missing required field: ${field}`;
    }
    return null;
  };

  const uploadImage = async (file: File | null): Promise<string> => {
    if (!file) return "";
    const uploaded = await storage.createFile(bucketId, ID.unique(), file);
    return storage.getFilePreview(bucketId, uploaded.$id);
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const createBlogPost = async (formData: any) => {
    setLoading(true);
    setError("");

    const validationError = validate(formData);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return null;
    }

    try {
      const imageUrl = await uploadImage(formData.imageFile);
      const slug = generateSlug(formData.title);

      const response = await databases.createDocument(
        databaseId,
        "blogs",
        ID.unique(),
        {
          ...formData,
          imageUrl,
          slug,
          readTime: parseInt(formData.readTime),
        }
      );

      return response;
    } catch (err: any) {
      console.error("Create error:", err);
      setError(err.message || "Failed to create blog post.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBlogPost = async (id: string, formData: any) => {
    setLoading(true);
    setError("");

    const validationError = validate(formData);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return null;
    }

    try {
      let imageUrl = formData.imageUrl;
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile);
      }

      const slug = generateSlug(formData.title);

      const response = await databases.updateDocument(
        databaseId,
        "blogs",
        id,
        {
          ...formData,
          imageUrl,
          slug,
          readTime: parseInt(formData.readTime),
        }
      );

      return response;
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update blog post.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (id: string) => {
    setLoading(true);
    setError("");

    try {
      await databases.deleteDocument(databaseId, "blogs", id);
      return true;
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete blog post.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    loading,
    setError,
    error,
  };
}
