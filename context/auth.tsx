"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { account, isAppwriteConfigured } from "@/lib/appwrite"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  dateOfBirth?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  education?: {
    institution: string
    degree: string
    fieldOfStudy: string
    graduationYear: string
    gpa: string
  }
  preferences?: {
    scholarshipTypes: string[]
    notifications: {
      email: boolean
      sms: boolean
      digest: boolean
    }
  }
  profile?: {
    bio: string
    achievements: string[]
    languages: string[]
    experience: string
  }
  createdAt: string
  profileCompletion: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demo
const mockUser: User = {
  id: "demo-user-123",
  email: "demo@example.com",
  firstName: "Demo",
  lastName: "User",
  avatar: "/placeholder.svg?height=100&width=100",
  dateOfBirth: "1995-06-15",
  phone: "+1 (555) 123-4567",
  address: {
    street: "123 Demo Street",
    city: "Demo City",
    state: "CA",
    zipCode: "90210",
    country: "USA",
  },
  education: {
    institution: "Demo University",
    degree: "Bachelor of Science",
    fieldOfStudy: "Computer Science",
    graduationYear: "2024",
    gpa: "3.8",
  },
  preferences: {
    scholarshipTypes: ["Academic Merit", "STEM", "Graduate"],
    notifications: {
      email: true,
      sms: false,
      digest: true,
    },
  },
  profile: {
    bio: "Passionate computer science student with a focus on artificial intelligence and machine learning.",
    achievements: ["Dean's List 2023", "Hackathon Winner", "Research Publication"],
    languages: ["English", "Spanish", "Python"],
    experience: "2 years of internship experience at tech startups",
  },
  createdAt: "2024-01-15T10:00:00Z",
  profileCompletion: 85,
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      if (isAppwriteConfigured()) {
        // Try Appwrite authentication
        const session = await account.get()
        if (session) {
          // Convert Appwrite user to our User type
          const userData: User = {
            id: session.$id,
            email: session.email,
            firstName: session.name.split(" ")[0] || "",
            lastName: session.name.split(" ").slice(1).join(" ") || "",
            createdAt: session.$createdAt,
            profileCompletion: 25, // Base completion for new users
          }
          setUser(userData)
        }
      } else {
        // Check localStorage for mock authentication
        const storedUser = localStorage.getItem("nsn_user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }
    } catch (error) {
      console.log("No active session")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)

      if (isAppwriteConfigured()) {
        // Appwrite login
        await account.createEmailPasswordSession(email, password)
        await checkAuth()
        return { success: true }
      } else {
        // Mock login
        if (email === "demo@example.com" && password === "password123") {
          setUser(mockUser)
          localStorage.setItem("nsn_user", JSON.stringify(mockUser))
          return { success: true }
        } else {
          return { success: false, error: "Invalid credentials. Try demo@example.com / password123" }
        }
      }
    } catch (error: any) {
      return { success: false, error: error.message || "Login failed" }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)

      if (isAppwriteConfigured()) {
        // Appwrite signup
        await account.create("unique()", email, password, `${firstName} ${lastName}`)
        await account.createEmailPasswordSession(email, password)
        await checkAuth()
        return { success: true }
      } else {
        // Mock signup
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          firstName,
          lastName,
          createdAt: new Date().toISOString(),
          profileCompletion: 25,
        }
        setUser(newUser)
        localStorage.setItem("nsn_user", JSON.stringify(newUser))
        return { success: true }
      }
    } catch (error: any) {
      return { success: false, error: error.message || "Signup failed" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (isAppwriteConfigured()) {
        await account.deleteSession("current")
      } else {
        localStorage.removeItem("nsn_user")
      }
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) return { success: false, error: "No user logged in" }

      const updatedUser = { ...user, ...data }

      // Calculate profile completion
      updatedUser.profileCompletion = calculateProfileCompletion(updatedUser)

      setUser(updatedUser)

      if (!isAppwriteConfigured()) {
        localStorage.setItem("nsn_user", JSON.stringify(updatedUser))
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || "Profile update failed" }
    }
  }

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isAppwriteConfigured()) {
        // Appwrite password recovery
        await account.createRecovery(email, `${window.location.origin}/reset-password`)
        return { success: true }
      } else {
        // Mock password recovery
        return { success: true }
      }
    } catch (error: any) {
      return { success: false, error: error.message || "Password recovery failed" }
    }
  }

  const calculateProfileCompletion = (user: User): number => {
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

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    forgotPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
