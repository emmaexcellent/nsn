"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookmarkButtonProps {
  scholarshipId: number
  initialBookmarked?: boolean
  variant?: "heart" | "bookmark"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function BookmarkButton({
  scholarshipId,
  initialBookmarked = false,
  variant = "heart",
  size = "md",
  showLabel = false,
  className = "",
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isLoading, setIsLoading] = useState(false)

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In a real app, you would make an API call here
      // await toggleBookmark(scholarshipId)

      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error("Failed to bookmark scholarship:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const Icon = variant === "heart" ? Heart : Bookmark
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "sm" : "default"}
      onClick={handleBookmark}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200 hover:scale-110",
        isBookmarked && variant === "heart" && "text-red-500 hover:text-red-600",
        isBookmarked && variant === "bookmark" && "text-gold hover:text-gold/80",
        className,
      )}
    >
      <Icon
        className={cn(
          sizeClasses[size],
          isBookmarked && variant === "heart" && "fill-red-500",
          isBookmarked && variant === "bookmark" && "fill-gold",
          isLoading && "animate-pulse",
        )}
      />
      {showLabel && <span className="ml-2">{isBookmarked ? "Saved" : "Save"}</span>}
    </Button>
  )
}
