"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Client, Databases, Query, ID } from "appwrite";
import { databaseId, databases } from "@/lib/appwrite";

interface BookmarkButtonProps {
  scholarshipId: string;
  profileId?: string;
  variant?: "heart" | "bookmark";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function BookmarkButton({
  scholarshipId,
  profileId,
  variant = "heart",
  size = "md",
  showLabel = false,
  className = "",
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [documentId, setDocumentId] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  const actionType = variant === "heart" ? "like" : "save";

  // 🔍 Check if user already interacted
  useEffect(() => {
    const checkInteraction = async () => {
      if(!profileId || !scholarshipId ) return;
      try {
        const response = await databases.listDocuments(
          databaseId,
          "saved_scholarships",
          [
            Query.equal("profile", profileId),
            Query.equal("scholarship", scholarshipId),
            Query.equal("action", actionType),
          ]
        );

        if (response.documents.length > 0) {
          setIsBookmarked(true);
          setDocumentId(response.documents[0].$id);
        }
      } catch (error) {
        console.error("Error checking interaction:", error);
      }
    };

    checkInteraction();
  }, [profileId, scholarshipId, actionType]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!profileId || !scholarshipId) return;
    setIsLoading(true);

    try {
      if (!isBookmarked) {
        await databases.createDocument(
          databaseId,
          "saved_scholarships",
          ID.unique(),
          {
            profile: profileId,
            scholarship: scholarshipId,
            action: actionType,
          }
        );
      } else {
        await databases.deleteDocument(
          databaseId,
          "saved_scholarships",
          documentId
        )
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Appwrite error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = variant === "heart" ? Heart : Bookmark;
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "sm" : "default"}
      onClick={handleBookmark}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200 hover:scale-110",
        isBookmarked &&
          variant === "heart" &&
          "text-red-500 hover:text-red-600",
        isBookmarked &&
          variant === "bookmark" &&
          "text-gold hover:text-gold/80",
        className
      )}
    >
      <Icon
        className={cn(
          sizeClasses[size],
          isBookmarked && variant === "heart" && "fill-red-500",
          isBookmarked && variant === "bookmark" && "fill-gold",
          isLoading && "animate-pulse"
        )}
      />
      {showLabel && (
        <span className="ml-2">{isBookmarked ? "Saved" : "Save"}</span>
      )}
    </Button>
  );
}
