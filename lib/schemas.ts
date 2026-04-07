import { z } from "zod";

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}, z.string().trim().optional());

const optionalJsonArrayField = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  return [];
}, z.array(z.string().trim().min(1)).optional());

const dateTimeField = z
  .string()
  .trim()
  .min(1)
  .transform((value, ctx) => {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid datetime value",
      });
      return z.NEVER;
    }

    return parsed.toISOString();
  });

const optionalDateTimeField = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}, dateTimeField.optional());

const jsonArrayField = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }

  return [];
}, z.array(z.string().trim().min(1)));

export const scholarshipInputSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  about: z.string().trim().min(1),
  amount: z.coerce.number().nonnegative(),
  location: z.string().trim().min(1),
  level: z.string().trim().min(1),
  eligibility: jsonArrayField,
  required: jsonArrayField,
  tags: jsonArrayField,
  link: z.string().trim().url(),
  sponsor: z.string().trim().min(1),
  category: z.string().trim().min(1),
  deadline: dateTimeField,
  imageUrl: optionalTrimmedString,
  imageFileId: optionalTrimmedString,
  currency: z.string().trim().default("USD"),
  status: z.enum(["active", "expired", "draft"]).default("active"),
});

export const blogInputSchema = z.object({
  title: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
  content: z.string().trim().min(1),
  category: z.string().trim().min(1),
  tags: optionalJsonArrayField.default([]),
  imageUrl: optionalTrimmedString,
  imageFileId: optionalTrimmedString,
  slug: z.string().trim().min(1),
  author: z.string().trim().min(1),
  readTime: z.coerce.number().positive(),
  status: z.enum(["draft", "published"]),
  publishedAt: optionalDateTimeField,
});

export const bookmarkPayloadSchema = z.object({
  scholarshipId: z.string().trim().min(1),
  action: z.enum(["save", "like"]),
});

export const applicationPayloadSchema = z.object({
  scholarshipId: z.string().trim().min(1),
});

export const blogViewPayloadSchema = z.object({
  views: z.coerce.number().nonnegative(),
});

export const profileCreateSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  dateOfBirth: optionalDateTimeField,
  phone: optionalTrimmedString,
  state: optionalTrimmedString,
  country: optionalTrimmedString,
  currentLevel: optionalTrimmedString,
  institution: optionalTrimmedString,
  courseOfStudy: optionalTrimmedString,
  graduationYear: z.coerce.number().int().min(1900).max(2200).optional(),
  gpa: z.coerce.number().min(0).max(5).optional(),
  bio: optionalTrimmedString,
  achievements: optionalJsonArrayField.default([]),
  languages: optionalJsonArrayField.default([]),
  scholarshipTypes: optionalJsonArrayField.default([]),
});

export const profileUpdateSchema = profileCreateSchema.partial();

export type ScholarshipInput = z.infer<typeof scholarshipInputSchema>;
export type BlogInput = z.infer<typeof blogInputSchema>;
export type ProfileCreateInput = z.infer<typeof profileCreateSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
