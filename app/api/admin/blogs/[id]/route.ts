import { NextResponse } from "next/server";
import {
  createAdminServices,
  deleteFileIfPresent,
  publicDocumentPermissions,
  requireAdminProfile,
  uploadFileFromForm,
} from "@/lib/appwrite-server";
import { blogInputSchema } from "@/lib/schemas";

export const runtime = "nodejs";

const parseBlogFormData = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get("imageFile");
  const currentImageFileId = String(formData.get("imageFileId") || "");
  const upload = await uploadFileFromForm(file instanceof File ? file : null);

  return {
    currentImageFileId,
    uploadedImageFileId: upload?.fileId ?? null,
    payload: blogInputSchema.parse({
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      category: formData.get("category"),
      tags: formData.get("tags"),
      imageUrl: upload?.imageUrl ?? String(formData.get("imageUrl") || ""),
      imageFileId: upload?.fileId ?? currentImageFileId,
      slug: formData.get("slug"),
      author: formData.get("author"),
      readTime: formData.get("readTime"),
      status: formData.get("status"),
      publishedAt: String(formData.get("publishedAt") || ""),
    }),
  };
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let uploadedImageFileId: string | null = null;
  let previousImageFileId: string | null = null;

  try {
    await requireAdminProfile(request.headers.get("authorization"));
    const parsed = await parseBlogFormData(request);
    uploadedImageFileId = parsed.uploadedImageFileId;
    previousImageFileId =
      parsed.currentImageFileId &&
      parsed.currentImageFileId !== parsed.uploadedImageFileId
        ? parsed.currentImageFileId
        : null;
    const { databases, databaseId } = createAdminServices();
    const { id } = await params;

    const document = await databases.updateDocument(
      databaseId,
      "blogs",
      id,
      parsed.payload,
      publicDocumentPermissions
    );

    if (previousImageFileId) {
      await deleteFileIfPresent(previousImageFileId).catch((cleanupError) => {
        console.error("Failed to delete old blog image", cleanupError);
      });
    }

    return NextResponse.json(document);
  } catch (error) {
    if (uploadedImageFileId) {
      await deleteFileIfPresent(uploadedImageFileId).catch(() => undefined);
    }

    const message = error instanceof Error ? error.message : "Failed to update blog post";
    const status =
      message === "Unauthorized"
        ? 401
        : message === "Forbidden"
        ? 403
        : message.startsWith("[")
        ? 400
        : 500;

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminProfile(request.headers.get("authorization"));
    const { databases, databaseId } = createAdminServices();
    const { id } = await params;

    const existing = await databases.getDocument(databaseId, "blogs", id);
    await databases.deleteDocument(databaseId, "blogs", id);
    await deleteFileIfPresent(existing.imageFileId).catch((cleanupError) => {
      console.error("Failed to delete blog image", cleanupError);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete blog post";
    const status =
      message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;

    return NextResponse.json({ message }, { status });
  }
}
