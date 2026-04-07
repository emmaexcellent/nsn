import { Client, Account, Databases, Storage } from "appwrite";

const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const projectEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;

export const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID!;
export const bucketId =
  process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID ||
  process.env.APPWRITE_BUCKET_ID!;

export const client = new Client();

client
  .setEndpoint(projectEndpoint)
  .setProject(projectID); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID } from "appwrite";
