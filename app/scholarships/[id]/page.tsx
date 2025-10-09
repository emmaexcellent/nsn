import { databaseId, databases } from "@/lib/appwrite";
import ScholarshipDetailMain from "./main";
import { Query } from "appwrite";

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

  return <ScholarshipDetailMain scholarship={response} similarScholarships={similarScholarships.documents} />;
};

export default ScholarshipDetailPage