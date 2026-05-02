import {
  normalizeProfile,
  normalizeScholarship,
  type ProfileDocument,
  type ScholarshipDocument,
} from "@/lib/documents";

type RecommendedScholarship = ScholarshipDocument & {
  match: number;
  reason: string;
};

const normalizeText = (value: string | undefined) =>
  (value ?? "").trim().toLowerCase();

const tokenize = (value: string | undefined) =>
  normalizeText(value)
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length >= 3);

const includesNormalized = (value: string | undefined, target: string | undefined) => {
  const left = normalizeText(value);
  const right = normalizeText(target);

  if (!left || !right) {
    return false;
  }

  return left.includes(right) || right.includes(left);
};

export const buildScholarshipRecommendations = (
  profile: ProfileDocument,
  scholarships: ScholarshipDocument[],
  limit = 6
): RecommendedScholarship[] => {
  const user = normalizeProfile(profile);
  const normalizedScholarships = scholarships
    .map((scholarship) => normalizeScholarship(scholarship))
    .filter((scholarship) => scholarship.status === "active");

  const userKeywords = new Set([
    ...tokenize(user.courseOfStudy),
    ...tokenize(user.bio),
    ...user.scholarshipTypes.map((value) => normalizeText(value)),
  ]);

  const scored = normalizedScholarships
    .map((scholarship) => {
      let score = 0;
      const reasons: string[] = [];

      if (
        user.currentLevel &&
        includesNormalized(scholarship.level, user.currentLevel)
      ) {
        score += 35;
        reasons.push(`Matches your ${user.currentLevel} level`);
      }

      if (
        user.country &&
        (includesNormalized(scholarship.location, user.country) ||
          scholarship.tags.some((tag) => includesNormalized(tag, user.country)))
      ) {
        score += 20;
        reasons.push(`Open in ${user.country}`);
      }

      if (
        user.state &&
        scholarship.tags.some((tag) => includesNormalized(tag, user.state))
      ) {
        score += 8;
        reasons.push(`Relevant to ${user.state}`);
      }

      if (user.courseOfStudy) {
        const fieldMatches = [
          scholarship.title,
          scholarship.description,
          scholarship.about,
          scholarship.category,
          ...scholarship.tags,
          ...scholarship.eligibility,
        ].some((value) => includesNormalized(value, user.courseOfStudy));

        if (fieldMatches) {
          score += 20;
          reasons.push(`Aligned with ${user.courseOfStudy}`);
        }
      }

      if (user.scholarshipTypes.length > 0) {
        const preferenceMatch = user.scholarshipTypes.some((type) =>
          [scholarship.category, ...scholarship.tags].some((value) =>
            includesNormalized(value, type)
          )
        );

        if (preferenceMatch) {
          score += 10;
          reasons.push("Fits your scholarship preferences");
        }
      }

      if (typeof user.gpa === "number" && Number.isFinite(user.gpa) && user.gpa >= 3.3) {
        const meritSignals = [scholarship.category, ...scholarship.tags].some((value) =>
          ["merit", "prestige", "leadership", "competitive"].some((signal) =>
            includesNormalized(value, signal)
          )
        );

        if (meritSignals) {
          score += 7;
          reasons.push("Strong fit for your academic standing");
        }
      }

      if (userKeywords.size > 0) {
        const scholarshipKeywords = new Set([
          ...tokenize(scholarship.title),
          ...tokenize(scholarship.description),
          ...tokenize(scholarship.about),
          ...scholarship.tags.map((tag) => normalizeText(tag)),
          ...scholarship.eligibility.map((item) => normalizeText(item)),
        ]);

        let keywordMatches = 0;
        for (const keyword of userKeywords) {
          if (scholarshipKeywords.has(keyword)) {
            keywordMatches += 1;
          }
        }

        if (keywordMatches > 0) {
          score += Math.min(keywordMatches * 5, 20);
          reasons.push("Shares keywords with your profile");
        }
      }

      if (score === 0) {
        if (scholarship.level || scholarship.category) {
          reasons.push("Popular active scholarship to explore");
        } else {
          reasons.push("Active scholarship recommendation");
        }
      }

      return {
        ...scholarship,
        match: Math.min(score, 100),
        reason: reasons[0],
      };
    })
    .sort((left, right) => {
      if (right.match !== left.match) {
        return right.match - left.match;
      }

      return new Date(left.deadline).getTime() - new Date(right.deadline).getTime();
    });

  const filtered = scored.filter((scholarship) => scholarship.match > 0);
  const source = filtered.length > 0 ? filtered : scored;

  return source.slice(0, limit);
};

export type { RecommendedScholarship };
