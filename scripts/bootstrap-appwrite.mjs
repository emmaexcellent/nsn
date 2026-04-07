import fs from "node:fs";
import path from "node:path";
import {
  Client,
  Databases,
  Permission,
  Query,
  Role,
  Storage,
} from "node-appwrite";

const projectRoot = process.cwd();

function loadEnvFile(filepath) {
  if (!fs.existsSync(filepath)) return;

  const contents = fs.readFileSync(filepath, "utf8");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(projectRoot, ".env"));
loadEnvFile(path.join(projectRoot, ".env.local"));

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const endpoint = requireEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT");
const projectId = requireEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
const apiKey = requireEnv("APPWRITE_API_KEY");
const databaseId = requireEnv("NEXT_PUBLIC_DATABASE_ID");
const databaseName = process.env.APPWRITE_DATABASE_NAME || "nsn";
const bucketId = process.env.APPWRITE_BUCKET_ID || "media";
const bucketName = process.env.APPWRITE_BUCKET_NAME || "media";

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

const COLLECTIONS = [
  {
    id: "profile",
    name: "Profiles",
    documentSecurity: true,
    permissions: [],
    attributes: [
      { type: "string", key: "email", size: 255, required: true },
      { type: "string", key: "firstName", size: 120, required: true },
      { type: "string", key: "lastName", size: 120, required: true },
      { type: "datetime", key: "dateOfBirth", required: false },
      { type: "string", key: "phone", size: 50, required: false },
      { type: "string", key: "state", size: 120, required: false },
      { type: "string", key: "country", size: 120, required: false },
      { type: "string", key: "currentLevel", size: 80, required: false },
      { type: "string", key: "institution", size: 255, required: false },
      { type: "string", key: "courseOfStudy", size: 255, required: false },
      { type: "integer", key: "graduationYear", required: false, min: 1900, max: 2200 },
      { type: "float", key: "gpa", required: false, min: 0, max: 5 },
      { type: "string", key: "bio", size: 5000, required: false },
      { type: "integer", key: "profileCompletion", required: true, min: 0, max: 100, xdefault: 0 },
      {
        type: "enum",
        key: "role",
        elements: ["user", "admin"],
        required: true,
        xdefault: "user",
      },
      { type: "string", key: "achievements", size: 255, required: false, array: true },
      { type: "string", key: "languages", size: 80, required: false, array: true },
      { type: "string", key: "scholarshipTypes", size: 120, required: false, array: true },
    ],
    indexes: [
      { key: "profile_email", type: "key", attributes: ["email"] },
      { key: "profile_role", type: "key", attributes: ["role"] },
    ],
  },
  {
    id: "scholarships",
    name: "Scholarships",
    documentSecurity: true,
    permissions: [],
    attributes: [
      { type: "string", key: "title", size: 255, required: true },
      { type: "string", key: "description", size: 2000, required: true },
      { type: "string", key: "about", size: 20000, required: true },
      { type: "integer", key: "amount", required: true, min: 0 },
      { type: "string", key: "location", size: 120, required: true },
      { type: "string", key: "level", size: 80, required: true },
      { type: "string", key: "eligibility", size: 500, required: true, array: true },
      { type: "string", key: "required", size: 500, required: true, array: true },
      { type: "string", key: "tags", size: 120, required: true, array: true },
      { type: "url", key: "link", required: true },
      { type: "string", key: "sponsor", size: 255, required: true },
      { type: "string", key: "category", size: 120, required: true },
      { type: "datetime", key: "deadline", required: true },
      { type: "url", key: "imageUrl", required: false },
      { type: "string", key: "imageFileId", size: 120, required: false },
      { type: "string", key: "currency", size: 10, required: true, xdefault: "USD" },
      {
        type: "enum",
        key: "status",
        elements: ["active", "expired", "draft"],
        required: true,
        xdefault: "active",
      },
    ],
    indexes: [
      { key: "scholarships_category", type: "key", attributes: ["category"] },
      { key: "scholarships_location", type: "key", attributes: ["location"] },
      { key: "scholarships_level", type: "key", attributes: ["level"] },
      { key: "scholarships_deadline", type: "key", attributes: ["deadline"] },
      { key: "scholarships_status", type: "key", attributes: ["status"] },
      { key: "scholarships_tags", type: "key", attributes: ["tags"] },
      { key: "scholarships_title_search", type: "fulltext", attributes: ["title"] },
      { key: "scholarships_description_search", type: "fulltext", attributes: ["description"] },
    ],
  },
  {
    id: "blogs",
    name: "Blogs",
    documentSecurity: true,
    permissions: [],
    attributes: [
      { type: "string", key: "title", size: 255, required: true },
      { type: "string", key: "excerpt", size: 2000, required: true },
      { type: "string", key: "content", size: 50000, required: true },
      { type: "string", key: "category", size: 120, required: true },
      { type: "string", key: "tags", size: 120, required: false, array: true },
      { type: "url", key: "imageUrl", required: false },
      { type: "string", key: "imageFileId", size: 120, required: false },
      { type: "string", key: "slug", size: 255, required: true },
      { type: "string", key: "author", size: 255, required: true },
      { type: "integer", key: "readTime", required: true, min: 1 },
      {
        type: "enum",
        key: "status",
        elements: ["draft", "published"],
        required: true,
        xdefault: "draft",
      },
      { type: "datetime", key: "publishedAt", required: false },
      { type: "string", key: "authorBio", size: 5000, required: false },
      { type: "integer", key: "views", required: true, min: 0, xdefault: 0 },
    ],
    indexes: [
      { key: "blogs_slug_unique", type: "unique", attributes: ["slug"] },
      { key: "blogs_category", type: "key", attributes: ["category"] },
      { key: "blogs_status", type: "key", attributes: ["status"] },
      { key: "blogs_publishedAt", type: "key", attributes: ["publishedAt"] },
      { key: "blogs_tags", type: "key", attributes: ["tags"] },
      { key: "blogs_title_search", type: "fulltext", attributes: ["title"] },
      { key: "blogs_excerpt_search", type: "fulltext", attributes: ["excerpt"] },
    ],
  },
  {
    id: "saved_scholarships",
    name: "Saved Scholarships",
    documentSecurity: true,
    permissions: [],
    attributes: [
      { type: "string", key: "profile", size: 120, required: true },
      { type: "string", key: "scholarship", size: 120, required: true },
      {
        type: "enum",
        key: "action",
        elements: ["save", "like", "apply"],
        required: true,
      },
    ],
    indexes: [
      { key: "saved_profile", type: "key", attributes: ["profile"] },
      { key: "saved_scholarship", type: "key", attributes: ["scholarship"] },
      { key: "saved_action", type: "key", attributes: ["action"] },
      {
        key: "saved_profile_scholarship_action",
        type: "unique",
        attributes: ["profile", "scholarship", "action"],
      },
    ],
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureDatabase() {
  try {
    const database = await databases.get(databaseId);
    console.log(`Database exists: ${database.$id}`);
    return database;
  } catch {
    console.log(`Creating database: ${databaseId}`);
    return databases.create(databaseId, databaseName, true);
  }
}

async function ensureBucket() {
  const bucketPermissions = [Permission.read(Role.any())];

  try {
    const bucket = await storage.getBucket(bucketId);
    console.log(`Bucket exists: ${bucket.$id}`);
    return bucket;
  } catch {
    console.log(`Creating bucket: ${bucketId}`);
    return storage.createBucket(
      bucketId,
      bucketName,
      bucketPermissions,
      false,
      true,
      5 * 1024 * 1024,
      ["jpg", "jpeg", "png", "webp", "gif"],
      "gzip",
      true,
      true,
      true
    );
  }
}

async function ensureCollection(collection) {
  try {
    const existing = await databases.getCollection(databaseId, collection.id);
    console.log(`Collection exists: ${existing.$id}`);
    return existing;
  } catch {
    console.log(`Creating collection: ${collection.id}`);
    return databases.createCollection(
      databaseId,
      collection.id,
      collection.name,
      collection.permissions,
      collection.documentSecurity,
      true
    );
  }
}

async function listAttributeKeys(collectionId) {
  const attributes = await databases.listAttributes(databaseId, collectionId);
  return new Map(attributes.attributes.map((attribute) => [attribute.key, attribute]));
}

async function waitForAttribute(collectionId, key) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const attribute = await databases.getAttribute(databaseId, collectionId, key);
      if (attribute.status === "available") {
        return attribute;
      }

      if (attribute.status === "failed") {
        throw new Error(
          `Attribute ${collectionId}.${key} failed to provision: ${attribute.error || "unknown error"}`
        );
      }
    } catch (error) {
      if (attempt === 59) throw error;
    }

    await sleep(1500);
  }

  throw new Error(`Timed out waiting for attribute ${collectionId}.${key}`);
}

async function createAttribute(collectionId, attribute) {
  const existingAttributes = await listAttributeKeys(collectionId);
  if (existingAttributes.has(attribute.key)) {
    console.log(`Attribute exists: ${collectionId}.${attribute.key}`);
    return;
  }

  console.log(`Creating attribute: ${collectionId}.${attribute.key}`);

  switch (attribute.type) {
    case "string":
      await databases.createStringAttribute(
        databaseId,
        collectionId,
        attribute.key,
        attribute.size,
        attribute.required,
        attribute.xdefault,
        attribute.array || false
      );
      break;
    case "integer":
      await databases.createIntegerAttribute(
        databaseId,
        collectionId,
        attribute.key,
        attribute.required,
        attribute.min,
        attribute.max,
        attribute.xdefault,
        attribute.array || false
      );
      break;
    case "float":
      await databases.createFloatAttribute(
        databaseId,
        collectionId,
        attribute.key,
        attribute.required,
        attribute.min,
        attribute.max,
        attribute.xdefault,
        attribute.array || false
      );
      break;
    case "datetime":
      await databases.createDatetimeAttribute(
        databaseId,
        collectionId,
        attribute.key,
        attribute.required,
        attribute.xdefault,
        attribute.array || false
      );
      break;
    case "enum":
      await databases.createEnumAttribute(
        databaseId,
        collectionId,
        attribute.key,
        attribute.elements,
        attribute.required,
        attribute.xdefault,
        attribute.array || false
      );
      break;
    case "url":
      await databases.createUrlAttribute(
        databaseId,
        collectionId,
        attribute.key,
        attribute.required,
        attribute.xdefault,
        attribute.array || false
      );
      break;
    default:
      throw new Error(`Unsupported attribute type: ${attribute.type}`);
  }

  await waitForAttribute(collectionId, attribute.key);
}

async function listIndexKeys(collectionId) {
  const indexes = await databases.listIndexes(databaseId, collectionId);
  return new Map(indexes.indexes.map((index) => [index.key, index]));
}

async function waitForIndex(collectionId, key) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const index = await databases.getIndex(databaseId, collectionId, key);
      if (index.status === "available") {
        return index;
      }

      if (index.status === "failed") {
        throw new Error(
          `Index ${collectionId}.${key} failed to provision: ${index.error || "unknown error"}`
        );
      }
    } catch (error) {
      if (attempt === 59) throw error;
    }

    await sleep(1500);
  }

  throw new Error(`Timed out waiting for index ${collectionId}.${key}`);
}

async function createIndex(collectionId, index) {
  const existingIndexes = await listIndexKeys(collectionId);
  if (existingIndexes.has(index.key)) {
    console.log(`Index exists: ${collectionId}.${index.key}`);
    return;
  }

  console.log(`Creating index: ${collectionId}.${index.key}`);
  await databases.createIndex(
    databaseId,
    collectionId,
    index.key,
    index.type,
    index.attributes
  );

  await waitForIndex(collectionId, index.key);
}

async function ensureCollections() {
  for (const collection of COLLECTIONS) {
    await ensureCollection(collection);

    for (const attribute of collection.attributes) {
      await createAttribute(collection.id, attribute);
    }

    for (const index of collection.indexes) {
      await createIndex(collection.id, index);
    }
  }
}

async function main() {
  console.log(`Bootstrapping Appwrite resources for project ${projectId}`);
  await ensureDatabase();
  await ensureBucket();
  await ensureCollections();
  console.log("Appwrite bootstrap completed.");
}

main().catch((error) => {
  console.error("Bootstrap failed.");
  console.error(error);
  process.exitCode = 1;
});
