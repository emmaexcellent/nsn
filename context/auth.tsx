"use client";

import { account } from "@/lib/appwrite";
import { apiRequest } from "@/lib/api-client";
import { normalizeProfile } from "@/lib/documents";
import { siteUrl } from "@/lib/utils";
import { ID, Models } from "appwrite";
import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  dateOfBirth?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  education?: {
    currentLevel: string;
    institution: string;
    major: string;
    gpa: number;
    graduationYear: number;
  };
  preferences?: {
    scholarshipTypes: string[];
    countries: string[];
    fieldOfStudy: string[];
    notifications: {
      email: boolean;
      sms: boolean;
      deadlineReminders: boolean;
      newOpportunities: boolean;
    };
  };
  profile?: {
    bio: string;
    achievements?: string[];
    extracurriculars: string[];
    workExperience: string[];
    languages: string[];
  };
  createdAt: string;
  lastLogin?: string;
  profileCompletion: number;
}

interface AuthContextType {
  user: Models.Document | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    userData: SignupData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (
    updates: Partial<Models.Document>
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  agreeToTerms: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const authAccount = await account.get();
        if (authAccount) {
          const userData = await apiRequest<Models.Document>("/api/user/profile");
          if (userData) {
            setUser(normalizeProfile(userData));
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      await account.createEmailPasswordSession(email, password);
      const userProfile = await apiRequest<Models.Document>("/api/user/profile");

      if (userProfile) {
        setUser(normalizeProfile(userProfile));

        return { success: true };
      } else {
        return { success: false, error: "Invalid email or password" };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      setLoading(true);

      // Create account
      const userAccount = await account.create(
        ID.unique(),
        userData.email,
        userData.password
      );

      await account.createEmailPasswordSession(
        userData.email,
        userData.password
      );

      const newUserProfile = await apiRequest<Models.Document>(
        "/api/user/profile",
        {
          method: "POST",
          body: JSON.stringify({
            firstName: userData.firstName,
            lastName: userData.lastName,
            dateOfBirth: userData.dateOfBirth,
          }),
        }
      );

      setUser(normalizeProfile({ ...newUserProfile, $id: userAccount.$id }));

      return { success: true };
    } catch (error: any) {
      console.error("Signup error:", error); // ✅ Log actual error
      return {
        success: false,
        error: error?.message || "Signup failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  const updateProfile = async (updates: Partial<Models.Document>) => {
    try {
      if (!user) return { success: false, error: "Not authenticated" };

      const {
        $id,
        $createdAt,
        $updatedAt,
        $permissions,
        ...safeUpdates
      } = updates as Partial<Models.Document>;

      const updatedUser = await apiRequest<Models.Document>("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify(safeUpdates),
      });

      setUser(normalizeProfile(updatedUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Profile update failed",
      };
    }
  };

  const resetPassword = async (email: string) => {
    const recoveryUrl = `${siteUrl}?mode=recover-password`;

    try {
      await account.createRecovery(email, recoveryUrl);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: "Password reset failed" };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await account.updatePassword(newPassword, currentPassword);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Password change failed",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    resetPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
