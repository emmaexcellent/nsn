"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { ScholarshipCard } from "@/components/schorlarships/scholarship-card";
import { databaseId, databases } from "@/lib/appwrite";
import { Models, Query } from "appwrite";
import Loader from "@/components/loader";
import {
  normalizeScholarship,
  type ScholarshipDocument,
} from "@/lib/documents";

const PAGE_LIMIT = 10;

export default function ScholarshipsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [scholarships, setScholarships] = useState<Models.Document[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const cache = useRef<Map<string, Models.Document[]>>(new Map());

  const categories = [
    "all",
    "Merit-Based",
    "Need-Based",
    "Research",
    "Government",
    "Private",
  ];
  const countries = [
    "all",
    "USA",
    "UK",
    "Germany",
    "Australia",
    "Canada",
    "Global",
  ];
  const levels = ["all", "Undergraduate", "Graduate", "PhD", "Postdoc"];

  const buildFilters = useCallback(() => {
    const filters = [];

    if (selectedCategory !== "all")
      filters.push(Query.equal("category", selectedCategory));
    if (selectedCountry !== "all")
      filters.push(Query.equal("location", selectedCountry));
    if (selectedLevel !== "all")
      filters.push(Query.equal("level", selectedLevel));
    if (searchTerm.trim()) {
      filters.push(
        Query.or([
          Query.search("title", searchTerm),
          Query.search("description", searchTerm),
        ])
      );
    }

    return filters;
  }, [searchTerm, selectedCategory, selectedCountry, selectedLevel]);

  const fetchScholarships = useCallback(async (reset = true) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const filters = buildFilters();
      const offset = reset ? 0 : page * PAGE_LIMIT;

      const cacheKey = JSON.stringify({ filters, offset });

      if (cache.current.has(cacheKey)) {
        const cachedData = cache.current.get(cacheKey);
        setScholarships((current) =>
          reset ? cachedData ?? [] : [...current, ...(cachedData ?? [])]
        );
        setHasMore(cachedData?.length === PAGE_LIMIT);
        if (reset) setPage(1);
        else setPage((prev) => prev + 1);
        setLoading(false);
        return;
      }

      const response = await databases.listDocuments(
        databaseId,
        "scholarships",
        [...filters, Query.limit(PAGE_LIMIT), Query.offset(offset), Query.orderDesc("$createdAt")]
      );

      const normalizedDocuments = response.documents.map((document) =>
        normalizeScholarship(document as ScholarshipDocument)
      );

      cache.current.set(cacheKey, normalizedDocuments);

      setScholarships((current) =>
        reset ? normalizedDocuments : [...current, ...normalizedDocuments]
      );
      setHasMore(normalizedDocuments.length === PAGE_LIMIT);
      if (reset) setPage(1);
      else setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      setErrorMessage("Unable to load scholarships right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [buildFilters, page]);

  useEffect(() => {
    void fetchScholarships(true);
  }, [fetchScholarships]);

  if (loading && scholarships.length === 0) return <Loader />;

  return (
    <div className="min-h-screen py-24 lg:py-32">
      <div className="relative w-full max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Scholarship Opportunities
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover and apply to scholarships that match your profile and
            aspirations
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 mb-8 border">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Country Filter */}
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country === "all" ? "All Countries" : country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Level Filter */}
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === "all" ? "All Levels" : level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {scholarships.length} scholarship
              {scholarships.length === 1 ? "" : "s"} shown
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedCountry("all");
                  setSelectedLevel("all");
                  cache.current.clear();
                  setScholarships([]);
                  setPage(0);
                }}
                disabled={loading}
              >
                Reset
              </Button>
              <Button onClick={() => fetchScholarships(true)} disabled={loading}>
                {loading ? "Applying..." : "Apply Filters"}
              </Button>
            </div>
          </div>
        </div>
        {errorMessage ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}
        {/* Scholarships Grid or Loader */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5 sm:px-3">
          {scholarships.map((scholarship, index) => (
            <ScholarshipCard
              key={scholarship.$id}
              scholarship={scholarship}
              animationDelay={index * 100}
            />
          ))}
        </div>
        {!loading && scholarships.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed bg-white p-8 text-center dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              No scholarships match these filters
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Try broader filters or reset the search to explore more opportunities.
            </p>
          </div>
        ) : null}

        {/* Load More */}
        {hasMore && scholarships.length > 0 && (
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => fetchScholarships(false)}
              disabled={loading}
              className="border-navy text-navy hover:bg-navy hover:text-white dark:border-gold dark:text-gold dark:hover:bg-gold dark:hover:text-navy bg-transparent"
            >
              {loading ? "Loading..." : "Load More Scholarships"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
