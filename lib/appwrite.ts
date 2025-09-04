import { Client, Account, Databases } from "appwrite"

// Environment variables with fallbacks and validation
const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const projectEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID

// Validate required environment variables
if (!projectID) {
  console.warn("NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set")
}

if (!projectEndpoint) {
  console.warn("NEXT_PUBLIC_APPWRITE_ENDPOINT is not set")
}

if (!databaseId) {
  console.warn("NEXT_PUBLIC_DATABASE_ID is not set")
}

export const client = new Client()

// Only configure client if environment variables are available
if (projectEndpoint && projectID) {
  try {
    client.setEndpoint(projectEndpoint).setProject(projectID)
  } catch (error) {
    console.error("Failed to configure Appwrite client:", error)
  }
}

export const account = new Account(client)
export const databases = new Databases(client)
export { databaseId }
export { ID } from "appwrite"
