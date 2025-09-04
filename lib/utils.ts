import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Site URL for password reset and other features
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

// Calculate days until deadline
export function getDaysUntilDeadline(deadline: string): number {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Get urgency color based on days remaining
export function getUrgencyColor(daysRemaining: number): string {
  if (daysRemaining <= 7) return "text-red-600"
  if (daysRemaining <= 30) return "text-orange-600"
  return "text-green-600"
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

// Generate initials from name
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Calculate profile completion percentage
export function calculateProfileCompletion(user: any): number {
  let completion = 25 // Base for having an account

  if (user.avatar) completion += 10
  if (user.phone) completion += 5
  if (user.address) completion += 15
  if (user.education) completion += 20
  if (user.profile?.bio) completion += 10
  if (user.profile?.achievements?.length) completion += 10
  if (user.preferences) completion += 5

  return Math.min(completion, 100)
}
