import { createAdminServices, Query } from "@/lib/appwrite-server";
import {
  serializeScholarships,
  type ScholarshipDocument,
} from "@/lib/documents";
import HomePageMain from "./main";

const HomePage = async () => {
  const { databases, databaseId } = createAdminServices();
  let featuredScholarships: ScholarshipDocument[] = [];

  try {
    const response = await databases.listDocuments(databaseId, "scholarships", [
      Query.equal("status", ["active"]),
      Query.contains("tags", "featured"),
      Query.limit(3),
    ]);
    featuredScholarships = serializeScholarships(
      response.documents as ScholarshipDocument[]
    );
  } catch {
    try {
      const fallback = await databases.listDocuments(databaseId, "scholarships", [
        Query.equal("status", ["active"]),
        Query.limit(3),
        Query.orderDesc("$createdAt"),
      ]);
      featuredScholarships = serializeScholarships(
        fallback.documents as ScholarshipDocument[]
      );
    } catch {
      featuredScholarships = [];
    }
  }

  return <HomePageMain featuredScholarships={featuredScholarships} />;
};

export default HomePage;
