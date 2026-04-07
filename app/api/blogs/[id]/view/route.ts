import { NextResponse } from "next/server";
import { createAdminServices } from "@/lib/appwrite-server";
import { blogViewPayloadSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { views } = blogViewPayloadSchema.parse(await request.json());
    const { databases, databaseId } = createAdminServices();
    const { id } = await params;

    const document = await databases.updateDocument(databaseId, "blogs", id, {
      views,
    });

    return NextResponse.json(document);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to record view";
    const status = message.startsWith("[") ? 400 : 500;

    return NextResponse.json({ message }, { status });
  }
}
