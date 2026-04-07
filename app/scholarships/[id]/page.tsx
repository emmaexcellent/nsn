import { databaseId, databases } from "@/lib/appwrite";
import ScholarshipDetailMain from "./main";
import { Query } from "appwrite";
import {
  serializeScholarship,
  serializeScholarships,
  type ScholarshipDocument,
} from "@/lib/documents";

const ScholarshipDetailPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const response = await databases.getDocument(databaseId, "scholarships", id);
  const similarScholarships = await databases.listDocuments(
    databaseId,
    "scholarships",
    [Query.equal("category", response.category), Query.limit(3)]
  )

  return (
    <ScholarshipDetailMain
      scholarship={serializeScholarship(response as ScholarshipDocument)}
      similarScholarships={serializeScholarships(
        similarScholarships.documents as ScholarshipDocument[]
      )}
    />
  );
};

export default ScholarshipDetailPage
