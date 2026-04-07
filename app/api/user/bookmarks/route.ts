import { NextResponse } from "next/server";
import {
  createAdminServices,
  ID,
  privateUserDocumentPermissions,
  Query,
  requireAuthenticatedProfile,
} from "@/lib/appwrite-server";
import { bookmarkPayloadSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedProfile(
      request.headers.get("authorization")
    );
    
    const payload = bookmarkPayloadSchema.parse(await request.json());
    const { databases, databaseId } = createAdminServices();

    const existing = await databases.listDocuments(
      databaseId,
      "saved_scholarships",
      [
        Query.equal("profileId", auth.user.$id),
        Query.equal("scholarshipId", payload.scholarshipId),
        Query.equal("action", payload.action),
        Query.limit(1),
      ],
    );

    if (existing.documents.length > 0) {
      return NextResponse.json(existing.documents[0]);
    }

    const document = await databases.createDocument(
      databaseId,
      "saved_scholarships",
      ID.unique(),
      {
        profile: auth.user.$id,
        scholarship: payload.scholarshipId,
        profileId: auth.user.$id,
        scholarshipId: payload.scholarshipId,
        action: payload.action,
      },
      privateUserDocumentPermissions(auth.user.$id),
    );

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save bookmark";
    const status =
      message === "Unauthorized"
        ? 401
        : message.startsWith("[")
        ? 400
        : 500;

    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedProfile(
      request.headers.get("authorization")
    );
    const payload = bookmarkPayloadSchema.parse(await request.json());
    const { databases, databaseId } = createAdminServices();

    const existing = await databases.listDocuments(databaseId, "saved_scholarships", [
      Query.equal("profile", auth.user.$id),
      Query.equal("scholarship", payload.scholarshipId),
      Query.equal("action", payload.action),
      Query.limit(1),
    ]);

    if (existing.documents.length === 0) {
      return NextResponse.json({ success: true });
    }

    await databases.deleteDocument(
      databaseId,
      "saved_scholarships",
      existing.documents[0].$id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove bookmark";
    const status =
      message === "Unauthorized"
        ? 401
        : message.startsWith("[")
        ? 400
        : 500;

    return NextResponse.json({ message }, { status });
  }
}
