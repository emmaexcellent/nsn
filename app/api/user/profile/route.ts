import { NextResponse } from "next/server";
import {
  createAdminServices,
  prepareProfileDocumentData,
  privateUserDocumentPermissions,
  requireAuthenticatedProfile,
  requireAuthenticatedUser,
} from "@/lib/appwrite-server";
import { normalizeProfile } from "@/lib/documents";
import { profileCreateSchema, profileUpdateSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedProfile(
      request.headers.get("authorization")
    );

    return NextResponse.json(auth.profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load profile";
    const status = message === "Unauthorized" ? 401 : 500;

    return NextResponse.json({ message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(
      request.headers.get("authorization")
    );
    const payload = profileCreateSchema.parse(await request.json());
    const { databases, databaseId } = createAdminServices();
    const documentId = auth.user.$id;
    const profileData = prepareProfileDocumentData(auth.user, payload);

    try {
      const existing = await databases.getDocument(databaseId, "profile", documentId);

      return NextResponse.json(normalizeProfile(existing));
    } catch {
      const document = await databases.createDocument(
        databaseId,
        "profile",
        documentId,
        profileData,
        privateUserDocumentPermissions(documentId)
      );

      return NextResponse.json(normalizeProfile(document), { status: 201 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create profile";
    const status = message === "Unauthorized" ? 401 : message.startsWith("[") ? 400 : 500;

    return NextResponse.json({ message }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuthenticatedProfile(
      request.headers.get("authorization")
    );
    const payload = profileUpdateSchema.parse(await request.json());
    const { databases, databaseId } = createAdminServices();
    const profileData = prepareProfileDocumentData(auth.user, {
      ...auth.profile,
      ...payload,
    });

    const document = await databases.updateDocument(
      databaseId,
      "profile",
      auth.user.$id,
      profileData,
      privateUserDocumentPermissions(auth.user.$id)
    );

    return NextResponse.json(normalizeProfile(document));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    const status = message === "Unauthorized" ? 401 : message.startsWith("[") ? 400 : 500;

    return NextResponse.json({ message }, { status });
  }
}
