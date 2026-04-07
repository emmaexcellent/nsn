import { NextResponse } from "next/server";
import {
  createAdminServices,
  deleteFileIfPresent,
  ID,
  publicDocumentPermissions,
  requireAdminProfile,
  uploadFileFromForm,
} from "@/lib/appwrite-server";
import { scholarshipInputSchema } from "@/lib/schemas";

export const runtime = "nodejs";

const parseScholarshipFormData = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get("imageFile");
  const upload = await uploadFileFromForm(file instanceof File ? file : null);

  return {
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
      imageFileId: upload?.fileId ?? String(formData.get("imageFileId") || ""),
      currency: String(formData.get("currency") || "USD"),
      status: String(formData.get("status") || "active"),
    }),
  };
};

export async function POST(request: Request) {
  let uploadedImageFileId: string | null = null;

  try {
    await requireAdminProfile(request.headers.get("authorization"));
    const parsed = await parseScholarshipFormData(request);
    uploadedImageFileId = parsed.uploadedImageFileId;
    const { databases, databaseId } = createAdminServices();

    const document = await databases.createDocument(
      databaseId,
      "scholarships",
      ID.unique(),
      parsed.payload,
      publicDocumentPermissions
    );

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (uploadedImageFileId) {
      await deleteFileIfPresent(uploadedImageFileId).catch(() => undefined);
    }

    const message =
      error instanceof Error ? error.message : "Failed to create scholarship";
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
