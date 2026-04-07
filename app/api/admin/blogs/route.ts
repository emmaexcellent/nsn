import { NextResponse } from "next/server";
import {
  createAdminServices,
  deleteFileIfPresent,
  ID,
  publicDocumentPermissions,
  requireAdminProfile,
  uploadFileFromForm,
} from "@/lib/appwrite-server";
import { blogInputSchema } from "@/lib/schemas";

export const runtime = "nodejs";

const parseBlogFormData = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get("imageFile");
  const upload = await uploadFileFromForm(file instanceof File ? file : null);

  return {
    uploadedImageFileId: upload?.fileId ?? null,
    payload: blogInputSchema.parse({
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      category: formData.get("category"),
      tags: formData.get("tags"),
      imageUrl: upload?.imageUrl ?? String(formData.get("imageUrl") || ""),
      imageFileId: upload?.fileId ?? String(formData.get("imageFileId") || ""),
      slug: formData.get("slug"),
      author: formData.get("author"),
      readTime: formData.get("readTime"),
      status: formData.get("status"),
      publishedAt: String(formData.get("publishedAt") || new Date().toISOString()),
    }),
  };
};

export async function POST(request: Request) {
  let uploadedImageFileId: string | null = null;

  try {
    await requireAdminProfile(request.headers.get("authorization"));
    const parsed = await parseBlogFormData(request);
    uploadedImageFileId = parsed.uploadedImageFileId;
    const { databases, databaseId } = createAdminServices();

    const document = await databases.createDocument(
      databaseId,
      "blogs",
      ID.unique(),
      parsed.payload,
      publicDocumentPermissions
    );

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (uploadedImageFileId) {
      await deleteFileIfPresent(uploadedImageFileId).catch(() => undefined);
    }

    const message = error instanceof Error ? error.message : "Failed to create blog post";
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
