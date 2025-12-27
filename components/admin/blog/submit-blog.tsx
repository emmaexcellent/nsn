import { useState, useCallback } from "react";
import { ID, Models } from "appwrite";
import { databases, storage, databaseId, bucketId } from "@/lib/appwrite";
import { BlogFormDataType } from "./post-form";

// Types for better type safety
interface UploadResult {
  imageUrl: string;
  fileId: string;
}

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

// Constants for validation
const REQUIRED_FIELDS: (keyof BlogFormDataType)[] = [
  "title",
  "excerpt",
  "content",
  "category",
  "author",
  "readTime",
  "status",
];

const COLLECTION_ID = "blogs";

export default function useBlogPostActions(): BlogPostActions {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearError = useCallback(() => setError(""), []);

  // Validate form data
  const validate = useCallback((data: BlogFormDataType): string | null => {
    for (const field of REQUIRED_FIELDS) {
      if (!data[field]?.toString().trim()) {
        return `Missing required field: ${field}`;
      }
    }

    // Validate readTime is a positive number
    const readTimeNum = parseInt(data.readTime.toString());
    if (isNaN(readTimeNum) || readTimeNum <= 0) {
      return "Read time must be a positive number";
    }

    return null;
  }, []);

  // Generate slug from title
  const generateSlug = useCallback((title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD") // Normalize diacritics
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  }, []);

  // Upload image to storage
  const uploadImage = useCallback(
    async (file: File | null): Promise<UploadResult> => {
      if (!file) return { imageUrl: "", fileId: "" };

      try {
        // Validate file type
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ];
        if (!validTypes.includes(file.type)) {
          throw new Error(
            "Invalid file type. Please upload an image (JPEG, PNG, WebP, GIF)"
          );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
          throw new Error("File size too large. Maximum size is 5MB");
        }

        const fileId = ID.unique();
        await storage.createFile(bucketId, fileId, file);

        // Get optimized preview URL with optional transformations
        const imageUrl = storage.getFileView(bucketId, fileId);

        return { imageUrl, fileId };
      } catch (err) {
        console.error("Image upload error:", err);
        throw err;
      }
    },
    []
  );

  // Delete image from storage
  const deleteImage = useCallback(async (fileId: string): Promise<void> => {
    if (!fileId) return;

    try {
      await storage.deleteFile(bucketId, fileId);
    } catch (err) {
      console.error("Failed to delete image:", err);
      // Don't throw error here - we don't want to block the main operation
    }
  }, []);

  // Clean form data by removing imageFile and converting types
  const cleanFormData = useCallback((formData: BlogFormDataType) => {
    const { imageFile, readTime, ...rest } = formData;

    return {
      ...rest,
      readTime: parseInt(readTime.toString()),
      ...(formData.tags && {
        tags: Array.isArray(formData.tags) ? formData.tags : [],
      }),
    };
  }, []);

  // Create blog post
  const createBlogPost = useCallback(
    async (formData: BlogFormDataType): Promise<Models.Document | null> => {
      setLoading(true);
      clearError();

      try {
        // Validate form data
        const validationError = validate(formData);
        if (validationError) {
          setError(validationError);
          return null;
        }

        // Upload image if present
        let imageUrl = "";
        let imageFileId = "";
        if (formData.imageFile) {
          const uploadResult = await uploadImage(formData.imageFile);
          imageUrl = uploadResult.imageUrl;
          imageFileId = uploadResult.fileId;
        }

        // Generate slug
        const slug = generateSlug(formData.title);

        // Clean and prepare data
        const cleanedData = cleanFormData(formData);

        // Create document
        const response = await databases.createDocument(
          databaseId,
          COLLECTION_ID,
          ID.unique(),
          {
            ...cleanedData,
            slug,
            ...(imageUrl && { imageUrl }),
            ...(imageFileId && { imageFileId }),
            publishedAt: new Date().toISOString(),
          }
        );

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create blog post. Please try again.";

        setError(errorMessage);
        console.error("Create blog post error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [validate, uploadImage, generateSlug, cleanFormData, clearError]
  );

  // Update blog post
  const updateBlogPost = useCallback(
    async (
      id: string,
      formData: BlogFormDataType
    ): Promise<Models.Document | null> => {
      setLoading(true);
      clearError();

      try {
        // Validate form data
        const validationError = validate(formData);
        if (validationError) {
          setError(validationError);
          return null;
        }

        let imageUrl = formData.imageUrl || "";
        let imageFileId = formData.imageFileId || "";
        let oldImageFileId = formData.imageFileId;

        // Handle image update
        if (formData.imageFile) {
          try {
            const uploadResult = await uploadImage(formData.imageFile);
            imageUrl = uploadResult.imageUrl;
            imageFileId = uploadResult.fileId;

            // Delete old image if it exists
            if (oldImageFileId && oldImageFileId !== imageFileId) {
              await deleteImage(oldImageFileId);
            }
          } catch (err) {
            setError("Failed to upload new image. Please try again.");
            return null;
          }
        }

        // Generate slug (only if title changed)
        const slug = generateSlug(formData.title);

        // Clean and prepare data
        const cleanedData = cleanFormData(formData);

        // Update document
        const response = await databases.updateDocument(
          databaseId,
          COLLECTION_ID,
          id,
          {
            ...cleanedData,
            slug,
            ...(imageUrl && { imageUrl: imageUrl }),
            ...(imageFileId && { imageFileId }),
          }
        );

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to update blog post. Please try again.";

        setError(errorMessage);
        console.error("Update blog post error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [
      validate,
      uploadImage,
      deleteImage,
      generateSlug,
      cleanFormData,
      clearError,
    ]
  );

  // Delete blog post
  const deleteBlogPost = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      clearError();

      try {
        // First, try to get the document to delete its image
        let imageFileId = "";
        try {
          const document = await databases.getDocument(
            databaseId,
            COLLECTION_ID,
            id
          );
          imageFileId = document.imageFileId || "";
        } catch (err) {
          console.warn("Could not fetch document for image cleanup:", err);
        }

        // Delete the document
        await databases.deleteDocument(databaseId, COLLECTION_ID, id);

        // Delete associated image if exists
        if (imageFileId) {
          await deleteImage(imageFileId);
        }

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to delete blog post. Please try again.";

        setError(errorMessage);
        console.error("Delete blog post error:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [deleteImage, clearError]
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
