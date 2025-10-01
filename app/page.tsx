import { databases, databaseId } from "@/lib/appwrite";
import HomePageMain from "./main"
import { Query } from "appwrite";

const HomePage = async () => {

    const fetchScholarships = await databases.listDocuments(
      databaseId,
      "scholarships",
      [Query.equal("tags", ["featured"]), Query.limit(3)]
    );

    return <HomePageMain featuredScholarships={fetchScholarships.documents} />;
}

export default HomePage