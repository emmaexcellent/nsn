import { Client, Account, Databases } from "appwrite"

// Environment variables with fallbacks
const projectEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const databaseID = process.env.NEXT_PUBLIC_DATABASE_ID

// Create Appwrite client
const client = new Client()

// Only configure if environment variables exist
if (projectEndpoint && projectID) {
  try {
    client.setEndpoint(projectEndpoint).setProject(projectID)
  } catch (error) {
    console.error("Failed to configure Appwrite client:", error)
  }
} else {
  console.warn("Appwrite environment variables not configured. Using mock authentication.")
}

// Initialize services
const account = new Account(client)
const databases = new Databases(client)

// Export configuration
export { client, account, databases, databaseID }

// Helper function to check if Appwrite is configured
export const isAppwriteConfigured = () => {
  return !!(projectEndpoint && projectID && databaseID)
}
