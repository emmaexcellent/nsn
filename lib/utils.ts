import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
