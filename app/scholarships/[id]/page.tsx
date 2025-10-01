import { databaseId, databases } from "@/lib/appwrite";
import ScholarshipDetailMain from "./main";

const ScholarshipDetailPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const response = await databases.getDocument(databaseId, "scholarships", id);
  return <ScholarshipDetailMain scholarship={response} />;
};

export default ScholarshipDetailPage