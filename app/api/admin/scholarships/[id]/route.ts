import { NextResponse } from "next/server";
import {
  createAdminServices,
  deleteFileIfPresent,
  publicDocumentPermissions,
  requireAdminProfile,
  uploadFileFromForm,
} from "@/lib/appwrite-server";
import { scholarshipInputSchema } from "@/lib/schemas";

export const runtime = "nodejs";

const parseScholarshipFormData = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get("imageFile");
  const currentImageFileId = String(formData.get("imageFileId") || "");
  const upload = await uploadFileFromForm(file instanceof File ? file : null);

  return {
    currentImageFileId,
    uploadedImageFileId: upload?.fileId ?? null,
    payload: scholarshipInputSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      about: formData.get("about"),
      amount: formData.get("amount"),
      location: formData.get("location"),
      level: formData.get("level"),
      eligibility: formData.get("eligibility"),
      required: formData.get("required"),
      tags: formData.get("tags"),
      link: formData.get("link"),
      sponsor: formData.get("sponsor"),
      category: formData.get("category"),
      deadline: formData.get("deadline"),
      imageUrl: upload?.imageUrl ?? String(formData.get("imageUrl") || ""),
      imageFileId: upload?.fileId ?? currentImageFileId,
      currency: String(formData.get("currency") || "USD"),
      status: String(formData.get("status") || "active"),
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
    const parsed = await parseScholarshipFormData(request);
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
      "scholarships",
      id,
      parsed.payload,
      publicDocumentPermissions
    );

    if (previousImageFileId) {
      await deleteFileIfPresent(previousImageFileId).catch((cleanupError) => {
        console.error("Failed to delete old scholarship image", cleanupError);
      });
    }

    return NextResponse.json(document);
  } catch (error) {
    if (uploadedImageFileId) {
      await deleteFileIfPresent(uploadedImageFileId).catch(() => undefined);
    }

    const message =
      error instanceof Error ? error.message : "Failed to update scholarship";
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

    const existing = await databases.getDocument(databaseId, "scholarships", id);
    await databases.deleteDocument(databaseId, "scholarships", id);
    await deleteFileIfPresent(existing.imageFileId).catch((cleanupError) => {
      console.error("Failed to delete scholarship image", cleanupError);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete scholarship";
    const status =
      message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;

    return NextResponse.json({ message }, { status });
  }
}
