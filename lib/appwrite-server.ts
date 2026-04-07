import {
  Account,
  Client,
  Databases,
  ID,
  Permission,
  Query,
  Role,
} from "node-appwrite";
import { createHash } from "node:crypto";
import { calculateProfileCompletion, normalizeProfile } from "@/lib/documents";
import type { ProfileCreateInput, ProfileUpdateInput } from "@/lib/schemas";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY;
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudFolder = process.env.CLOUDINARY_FOLDER ?? "nsn";
const maxUploadSizeBytes = 5 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type UploadedImageAsset = {
  fileId: string;
  imageUrl: string;
};

const requireEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const createBaseClient = () =>
  new Client()
    .setEndpoint(requireEnv(endpoint, "NEXT_PUBLIC_APPWRITE_ENDPOINT"))
    .setProject(requireEnv(projectId, "NEXT_PUBLIC_APPWRITE_PROJECT_ID"));

const createCloudinarySignature = (
  params: Record<string, string>,
  apiSecret: string
) =>
  createHash("sha1")
    .update(
      Object.entries(params)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
        .map(([key, value]) => `${key}=${value}`)
        .join("&") + apiSecret
    )
    .digest("hex");

const createCloudinaryPublicId = (fileName: string) => {
  const extensionIndex = fileName.lastIndexOf(".");
  const baseName =
    extensionIndex > 0 ? fileName.slice(0, extensionIndex) : fileName;
  const sanitizedBaseName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return [cloudFolder, `${Date.now()}-${ID.unique()}-${sanitizedBaseName || "image"}`].join(
    "/"
  );
};

const validateImageFile = (file: File) => {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error(
      "Invalid file type. Please upload an image (JPEG, PNG, WebP, GIF)."
    );
  }

  if (file.size > maxUploadSizeBytes) {
    throw new Error("File size too large. Maximum size is 5MB.");
  }
};

export const createAdminServices = () => {
  const client = createBaseClient().setKey(requireEnv(apiKey, "APPWRITE_API_KEY"));

  return {
    account: new Account(client),
    databases: new Databases(client),
    databaseId: requireEnv(databaseId, "NEXT_PUBLIC_DATABASE_ID"),
  };
};

export const createUserServices = (jwt: string) => {
  const client = createBaseClient().setJWT(jwt);

  return {
    account: new Account(client),
    databases: new Databases(client),
    databaseId: requireEnv(databaseId, "NEXT_PUBLIC_DATABASE_ID"),
  };
};

export const getBearerToken = (authorizationHeader: string | null) => {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim();
};

export const requireAuthenticatedUser = async (
  authorizationHeader: string | null
) => {
  const jwt = getBearerToken(authorizationHeader);

  if (!jwt) {
    throw new Error("Unauthorized");
  }

  const userServices = createUserServices(jwt);
  const user = await userServices.account.get();

  return {
    jwt,
    user,
  };
};

export const requireAuthenticatedProfile = async (
  authorizationHeader: string | null
) => {
  const auth = await requireAuthenticatedUser(authorizationHeader);
  const adminServices = createAdminServices();
  const profile = await adminServices.databases.getDocument(
    adminServices.databaseId,
    "profile",
    auth.user.$id
  );

  return {
    ...auth,
    profile: normalizeProfile(profile),
  };
};

export const requireAdminProfile = async (authorizationHeader: string | null) => {
  const auth = await requireAuthenticatedProfile(authorizationHeader);

  if (auth.profile.role !== "admin") {
    throw new Error("Forbidden");
  }

  return auth;
};

export const publicDocumentPermissions = [Permission.read(Role.any())];

export const privateUserDocumentPermissions = (userId: string) => [
  Permission.read(Role.user(userId)),
];

export const prepareProfileDocumentData = (
  user: { email: string },
  payload: Partial<ProfileCreateInput | ProfileUpdateInput>
) => {
  const profileData = {
    email: user.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    dateOfBirth: payload.dateOfBirth,
    phone: payload.phone,
    state: payload.state,
    country: payload.country,
    currentLevel: payload.currentLevel,
    institution: payload.institution,
    courseOfStudy: payload.courseOfStudy,
    graduationYear: payload.graduationYear,
    gpa: payload.gpa,
    bio: payload.bio,
    achievements: payload.achievements,
    languages: payload.languages,
    scholarshipTypes: payload.scholarshipTypes,
  };

  return {
    ...profileData,
    profileCompletion: calculateProfileCompletion(profileData),
  };
};

export const uploadFileFromForm = async (
  file: File | null | undefined
): Promise<UploadedImageAsset | null> => {
  if (!file || file.size === 0) {
    return null;
  }

  validateImageFile(file);

  const apiSecret = requireEnv(cloudApiSecret, "CLOUDINARY_API_SECRET");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = createCloudinaryPublicId(file.name);
  const signatureParams = {
    folder: cloudFolder,
    public_id: publicId,
    timestamp,
  };
  const signature = createCloudinarySignature(signatureParams, apiSecret);
  const uploadForm = new FormData();

  uploadForm.append("file", file);
  uploadForm.append(
    "api_key",
    requireEnv(cloudApiKey, "CLOUDINARY_API_KEY")
  );
  uploadForm.append("timestamp", timestamp);
  uploadForm.append("folder", cloudFolder);
  uploadForm.append("public_id", publicId);
  uploadForm.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${requireEnv(
      cloudName,
      "CLOUDINARY_CLOUD_NAME"
    )}/image/upload`,
    {
      method: "POST",
      body: uploadForm,
    }
  );

  const result = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    error?: { message?: string };
  };

  if (!response.ok || !result.secure_url || !result.public_id) {
    throw new Error(
      result.error?.message || "Failed to upload image to Cloudinary."
    );
  }

  return {
    fileId: result.public_id,
    imageUrl: result.secure_url,
  };
};

export const deleteFileIfPresent = async (
  fileId: string | undefined | null
) => {
  if (!fileId) {
    return;
  }

  const apiSecret = requireEnv(cloudApiSecret, "CLOUDINARY_API_SECRET");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createCloudinarySignature(
    { invalidate: "true", public_id: fileId, timestamp },
    apiSecret
  );
  const deleteForm = new FormData();

  deleteForm.append(
    "api_key",
    requireEnv(cloudApiKey, "CLOUDINARY_API_KEY")
  );
  deleteForm.append("public_id", fileId);
  deleteForm.append("timestamp", timestamp);
  deleteForm.append("invalidate", "true");
  deleteForm.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${requireEnv(
      cloudName,
      "CLOUDINARY_CLOUD_NAME"
    )}/image/destroy`,
    {
      method: "POST",
      body: deleteForm,
    }
  );

  const result = (await response.json()) as {
    result?: string;
    error?: { message?: string };
  };

  if (!response.ok || result.error?.message) {
    throw new Error(
      result.error?.message || "Failed to delete image from Cloudinary."
    );
  }
};

export { ID, Query };
