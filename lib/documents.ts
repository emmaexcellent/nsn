import type { Models } from "appwrite";

export type AppwriteDocument = Models.Document;

export interface BlogPostDocument extends AppwriteDocument {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  slug?: string;
  author?: string;
  readTime?: string | number;
  status?: string;
  image?: string;
  imageUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
  authorBio?: string;
  views?: number;
}

export interface ScholarshipDocument extends AppwriteDocument {
  title?: string;
  description?: string;
  about?: string;
  amount?: number | string;
  location?: string;
  country?: string;
  level?: string;
  eligibility?: string[] | string;
  required?: string[] | string;
  tags?: string[];
  link?: string;
  sponsor?: string;
  category?: string;
  deadline?: string;
  currency?: string;
  imageUrl?: string;
  imageFileId?: string;
}

export interface ProfileDocument extends AppwriteDocument {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  state?: string;
  country?: string;
  currentLevel?: string;
  institution?: string;
  courseOfStudy?: string;
  graduationYear?: number;
  gpa?: number;
  bio?: string;
  profileCompletion?: number;
  role?: string;
  achievements?: string[];
  languages?: string[];
  scholarshipTypes?: string[];
}

const toPlainObject = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

const toArray = (value: string[] | string | undefined): string[] => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value];
  }

  return [];
};

export const normalizeBlogPost = (document: BlogPostDocument) => ({
  ...document,
  slug: document.slug ?? document.$id,
  imageUrl: document.imageUrl ?? document.image ?? "/placeholder.svg",
  readTime:
    typeof document.readTime === "number"
      ? `${document.readTime}`
      : document.readTime ?? "",
  publishedAt: document.publishedAt ?? document.$createdAt,
  updatedAt: document.updatedAt ?? document.$updatedAt,
  tags: Array.isArray(document.tags) ? document.tags.filter(Boolean) : [],
  views: document.views ?? 0,
  title: document.title ?? "",
  excerpt: document.excerpt ?? "",
  content: document.content ?? "",
  category: document.category ?? "",
  author: document.author ?? "",
});

export const serializeBlogPost = (document: BlogPostDocument) =>
  toPlainObject(normalizeBlogPost(document));

export const serializeBlogPosts = (documents: BlogPostDocument[]) =>
  documents.map(serializeBlogPost);

export const normalizeScholarship = (document: ScholarshipDocument) => ({
  ...document,
  amount:
    typeof document.amount === "string"
      ? Number.parseInt(document.amount, 10) || 0
      : document.amount ?? 0,
  location: document.location ?? document.country ?? "",
  eligibility: toArray(document.eligibility),
  required: toArray(document.required),
  tags: Array.isArray(document.tags) ? document.tags.filter(Boolean) : [],
  currency: document.currency ?? "USD",
  title: document.title ?? "",
  description: document.description ?? "",
  about: document.about ?? "",
  level: document.level ?? "",
  link: document.link ?? "",
  sponsor: document.sponsor ?? "",
  category: document.category ?? "",
  deadline: document.deadline ?? "",
});

export const serializeScholarship = (document: ScholarshipDocument) =>
  toPlainObject(normalizeScholarship(document));

export const serializeScholarships = (documents: ScholarshipDocument[]) =>
  documents.map(serializeScholarship);

export const normalizeProfile = (document: ProfileDocument) => ({
  ...document,
  firstName: document.firstName ?? "",
  lastName: document.lastName ?? "",
  email: document.email ?? "",
  state: document.state ?? "",
  country: document.country ?? "",
  currentLevel: document.currentLevel ?? "",
  institution: document.institution ?? "",
  courseOfStudy: document.courseOfStudy ?? "",
  profileCompletion: document.profileCompletion ?? 0,
  role: document.role ?? "user",
  achievements: Array.isArray(document.achievements)
    ? document.achievements.filter(Boolean)
    : [],
  languages: Array.isArray(document.languages)
    ? document.languages.filter(Boolean)
    : [],
  scholarshipTypes: Array.isArray(document.scholarshipTypes)
    ? document.scholarshipTypes.filter(Boolean)
    : [],
});

export const serializeProfile = (document: ProfileDocument) =>
  toPlainObject(normalizeProfile(document));

export const calculateProfileCompletion = (
  data: Partial<ProfileDocument>
): number => {
  const requiredFields = [
    "firstName",
    "lastName",
    "phone",
    "dateOfBirth",
    "state",
    "country",
    "currentLevel",
    "institution",
    "courseOfStudy",
    "graduationYear",
    "gpa",
    "bio",
  ] as const;

  let completedCount = 0;
  const totalWeight = requiredFields.length * 2;

  for (const field of requiredFields) {
    const value = data[field];

    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      completedCount += 2;
    }
  }

  return Math.min(Math.round((completedCount / totalWeight) * 100), 100);
};
