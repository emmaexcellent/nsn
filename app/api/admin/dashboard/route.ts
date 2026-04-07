import { NextResponse } from "next/server";
import { requireAdminProfile, createAdminServices, Query } from "@/lib/appwrite-server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await requireAdminProfile(request.headers.get("authorization"));

    const { databases, databaseId } = createAdminServices();
    const [scholarshipsResponse, blogsResponse, usersResponse, applicationsResponse] =
      await Promise.all([
        databases.listDocuments(databaseId, "scholarships", [
          Query.orderDesc("$createdAt"),
          Query.limit(500),
        ]),
        databases.listDocuments(databaseId, "blogs", [
          Query.orderDesc("$createdAt"),
          Query.limit(500),
        ]),
        databases.listDocuments(databaseId, "profile", [
          Query.orderDesc("$createdAt"),
          Query.limit(500),
        ]),
        databases.listDocuments(databaseId, "saved_scholarships", [
          Query.equal("action", "apply"),
          Query.limit(5000),
        ]),
      ]);

    const applicationCounts = applicationsResponse.documents.reduce<Record<string, number>>(
      (counts, document) => {
        const scholarshipId = String(document.scholarship || "");
        if (!scholarshipId) return counts;
        counts[scholarshipId] = (counts[scholarshipId] ?? 0) + 1;
        return counts;
      },
      {}
    );

    const userApplicationCounts = applicationsResponse.documents.reduce<Record<string, number>>(
      (counts, document) => {
        const profileId = String(document.profile || "");
        if (!profileId) return counts;
        counts[profileId] = (counts[profileId] ?? 0) + 1;
        return counts;
      },
      {}
    );

    const scholarships = scholarshipsResponse.documents.map((document) => ({
      ...document,
      applicationCount: applicationCounts[document.$id] ?? 0,
    }));

    const users = usersResponse.documents.map((document) => ({
      ...document,
      applicationCount: userApplicationCounts[document.$id] ?? 0,
    }));

    return NextResponse.json({
      scholarships,
      blogPosts: blogsResponse.documents,
      users,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load admin data";
    const status =
      message === "Unauthorized" ? 401 : message === "Forbidden" ? 403 : 500;

    return NextResponse.json({ message }, { status });
  }
}
