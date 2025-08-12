"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Heart, Bookmark } from "lucide-react";
import { toast } from "sonner";

interface BookmarkButtonProps {
  scholarshipId: string;
  initialBookmarked?: boolean;
  variant?: "heart" | "bookmark";
  size?: "sm" | "default";
}

export default function BookmarkButton({
  scholarshipId,
  initialBookmarked = false,
  variant = "bookmark",
  size = "default",
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = true

  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to save scholarships");
      return;
    }

    setIsLoading(true);
    try {
      const response = true

      if (response) {
        setIsBookmarked(!isBookmarked);
        toast.success(
          isBookmarked
            ? "Removed from saved scholarships"
            : "Added to saved scholarships"
        );
      } else {
        throw new Error("Failed to update bookmark");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = variant === "heart" ? Heart : Bookmark;

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleBookmark}
      disabled={isLoading}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Icon
        className={`h-4 w-4 ${
          isBookmarked
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-gray-600"
        }`}
      />
    </Button>
  );
}
