"use client";

import { useEffect, useRef, useState } from "react";
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

const PAGE_LIMIT = 10;

export default function ScholarshipsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [scholarships, setScholarships] = useState<Models.DefaultDocument[]>(
    []
  );
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const cache = useRef<Map<string, Models.DefaultDocument[]>>(new Map());

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

  const buildFilters = () => {
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
  };

  const fetchScholarships = async (reset = true) => {
    setLoading(true);
    try {
      const filters = buildFilters();
      const offset = reset ? 0 : page * PAGE_LIMIT;

      const cacheKey = JSON.stringify({ filters, offset });

      if (cache.current.has(cacheKey)) {
        const cachedData = cache.current.get(cacheKey);
        const newScholarships = reset
          ? cachedData ?? []
          : [...scholarships, ...(cachedData ?? [])];
        setScholarships(newScholarships);
        setHasMore(cachedData?.length === PAGE_LIMIT);
        if (reset) setPage(1);
        else setPage((prev) => prev + 1);
        setLoading(false);
        return;
      }

      const response = await databases.listDocuments(
        databaseId,
        "scholarships",
        [...filters, Query.limit(PAGE_LIMIT), Query.offset(offset)]
      );

      cache.current.set(cacheKey, response.documents);

      const newScholarships = reset
        ? response.documents
        : [...scholarships, ...response.documents];
      setScholarships(newScholarships);
      setHasMore(response.documents.length === PAGE_LIMIT);
      if (reset) setPage(1);
      else setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships(true);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen py-24 lg:py-40">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
          <div className="flex justify-end mt-5">
            <Button onClick={() => fetchScholarships()} disabled={loading}>
              Apply Filters
            </Button>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {scholarships.length} scholarships found
            </p>
          </div>
        </div>
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

        {/* Load More */}
        {hasMore && (
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
