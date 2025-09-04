"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookmarkButtonProps {
  scholarshipId: number
  variant?: "heart" | "bookmark"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BookmarkButton({ scholarshipId, variant = "bookmark", size = "md", className }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if scholarship is bookmarked on component mount
    const bookmarked = localStorage.getItem(`bookmark_${scholarshipId}`)
    setIsBookmarked(bookmarked === "true")
  }, [scholarshipId])

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    const newBookmarkState = !isBookmarked
    setIsBookmarked(newBookmarkState)

    // Save to localStorage
    localStorage.setItem(`bookmark_${scholarshipId}`, newBookmarkState.toString())

    setIsLoading(false)
  }

  const Icon = variant === "heart" ? Heart : Bookmark

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const buttonSizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBookmark}
      disabled={isLoading}
      className={cn(
        buttonSizeClasses[size],
        "rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200",
        isBookmarked && variant === "heart" && "text-red-500 hover:text-red-600",
        isBookmarked && variant === "bookmark" && "text-blue-500 hover:text-blue-600",
        className,
      )}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Icon
        className={cn(
          sizeClasses[size],
          "transition-all duration-200",
          isBookmarked && "fill-current",
          isLoading && "animate-pulse",
        )}
      />
    </Button>
  )
}
