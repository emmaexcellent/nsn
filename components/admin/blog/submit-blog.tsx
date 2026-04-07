import { useState, useCallback } from "react";
import { Models } from "appwrite";
import { BlogFormDataType } from "./post-form";
import { apiRequest } from "@/lib/api-client";

interface BlogPostActions {
  createBlogPost: (
    formData: BlogFormDataType
  ) => Promise<Models.Document | null>;
  updateBlogPost: (
    id: string,
    formData: BlogFormDataType
  ) => Promise<Models.Document | null>;
  deleteBlogPost: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string;
  clearError: () => void;
}

const REQUIRED_FIELDS: (keyof BlogFormDataType)[] = [
  "title",
  "excerpt",
  "content",
  "category",
  "author",
  "readTime",
  "status",
];

export default function useBlogPostActions(): BlogPostActions {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = useCallback(() => setError(""), []);

  const validate = useCallback((data: BlogFormDataType): string | null => {
    for (const field of REQUIRED_FIELDS) {
      if (!data[field]?.toString().trim()) {
        return `Missing required field: ${field}`;
      }
    }

    const readTimeNum = parseInt(data.readTime.toString(), 10);
    if (isNaN(readTimeNum) || readTimeNum <= 0) {
      return "Read time must be a positive number";
    }

    return null;
  }, []);

  const generateSlug = useCallback((title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }, []);

  const toFormData = useCallback(
    (formData: BlogFormDataType) => {
      if (formData.imageFile) {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ];
        if (!validTypes.includes(formData.imageFile.type)) {
          throw new Error(
            "Invalid file type. Please upload an image (JPEG, PNG, WebP, GIF)"
          );
        }

        const maxSize = 5 * 1024 * 1024;
        if (formData.imageFile.size > maxSize) {
          throw new Error("File size too large. Maximum size is 5MB");
        }
      }

      const payload = new FormData();
      const trimmedTags = (formData.tags ?? []).filter((tag) => tag.trim());
      const slug = generateSlug(formData.title);
      const status = formData.status === "published" ? "published" : "draft";

      payload.append("title", formData.title);
      payload.append("excerpt", formData.excerpt);
      payload.append("content", formData.content);
      payload.append("category", formData.category);
      payload.append("tags", JSON.stringify(trimmedTags));
      payload.append("imageUrl", formData.imageUrl || "");
      payload.append("imageFileId", formData.imageFileId || "");
      payload.append("slug", slug);
      payload.append("author", formData.author);
      payload.append("readTime", String(parseInt(formData.readTime.toString(), 10)));
      payload.append("status", status);
      payload.append(
        "publishedAt",
        status === "published" ? new Date().toISOString() : ""
      );

      if (formData.imageFile) {
        payload.append("imageFile", formData.imageFile);
      }

      return payload;
    },
    [generateSlug]
  );

  const createBlogPost = useCallback(
    async (formData: BlogFormDataType): Promise<Models.Document | null> => {
      setLoading(true);
      clearError();

      try {
        const validationError = validate(formData);
        if (validationError) {
          setError(validationError);
          return null;
        }

        return await apiRequest<Models.Document>("/api/admin/blogs", {
          method: "POST",
          body: toFormData(formData),
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create blog post. Please try again.";

        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [clearError, toFormData, validate]
  );

  const updateBlogPost = useCallback(
    async (
      id: string,
      formData: BlogFormDataType
    ): Promise<Models.Document | null> => {
      setLoading(true);
      clearError();

      try {
        const validationError = validate(formData);
        if (validationError) {
          setError(validationError);
          return null;
        }

        return await apiRequest<Models.Document>(`/api/admin/blogs/${id}`, {
          method: "PATCH",
          body: toFormData(formData),
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update blog post. Please try again.";

        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [clearError, toFormData, validate]
  );

  const deleteBlogPost = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      clearError();

      try {
        await apiRequest(`/api/admin/blogs/${id}`, {
          method: "DELETE",
        });

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to delete blog post. Please try again.";

        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [clearError]
  );

  return {
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    loading,
    error,
    clearError,
  };
}
