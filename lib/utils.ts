import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? Number.parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// Date formatting
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Relative date formatting
export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffInMs = d.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays < 0) {
    return "Expired"
  } else if (diffInDays === 0) {
    return "Today"
  } else if (diffInDays === 1) {
    return "Tomorrow"
  } else if (diffInDays <= 7) {
    return `${diffInDays} days`
  } else if (diffInDays <= 30) {
    const weeks = Math.ceil(diffInDays / 7)
    return `${weeks} week${weeks > 1 ? "s" : ""}`
  } else {
    const months = Math.ceil(diffInDays / 30)
    return `${months} month${months > 1 ? "s" : ""}`
  }
}

// Calculate deadline urgency
export function getDeadlineUrgency(deadline: string): "high" | "medium" | "low" | "expired" {
  const deadlineDate = new Date(deadline)
  const now = new Date()
  const diffInMs = deadlineDate.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays < 0) return "expired"
  if (diffInDays <= 7) return "high"
  if (diffInDays <= 30) return "medium"
  return "low"
}

// Text truncation
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}

// Generate user initials
export function getUserInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || ""
  const last = lastName?.charAt(0)?.toUpperCase() || ""
  return first + last || "U"
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password strength validation
export function validatePassword(password: string): {
  isValid: boolean
  strength: "weak" | "medium" | "strong"
  issues: string[]
} {
  const issues: string[] = []
  let score = 0

  if (password.length < 8) {
    issues.push("At least 8 characters")
  } else {
    score += 1
  }

  if (!/[A-Z]/.test(password)) {
    issues.push("One uppercase letter")
  } else {
    score += 1
  }

  if (!/[a-z]/.test(password)) {
    issues.push("One lowercase letter")
  } else {
    score += 1
  }

  if (!/\d/.test(password)) {
    issues.push("One number")
  } else {
    score += 1
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push("One special character")
  } else {
    score += 1
  }

  let strength: "weak" | "medium" | "strong" = "weak"
  if (score >= 4) strength = "strong"
  else if (score >= 2) strength = "medium"

  return {
    isValid: issues.length === 0,
    strength,
    issues,
  }
}

// Calculate profile completion percentage
export function calculateProfileCompletion(user: any): number {
  if (!user) return 0

  let completion = 25 // Base for having an account

  if (user.avatar) completion += 10
  if (user.phone) completion += 5
  if (user.address?.street && user.address?.city) completion += 15
  if (user.education?.institution && user.education?.degree) completion += 20
  if (user.profile?.bio) completion += 10
  if (user.profile?.achievements && user.profile.achievements.length > 0) completion += 10
  if (user.preferences?.scholarshipTypes && user.preferences.scholarshipTypes.length > 0) completion += 5

  return Math.min(completion, 100)
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}
