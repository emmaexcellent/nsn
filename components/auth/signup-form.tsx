"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth"
import { useRouter } from "next/navigation"

interface SignupFormProps {
  onViewChange: (view: "login" | "signup" | "forgot") => void
}

export function SignupForm({ onViewChange }: SignupFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { signup } = useAuth()
  const router = useRouter()

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)

    return { minLength, hasUpper, hasLower, hasNumber }
  }

  const getPasswordStrength = (password: string) => {
    const validation = validatePassword(password)
    const score = Object.values(validation).filter(Boolean).length

    if (score === 0) return { strength: 0, label: "", color: "" }
    if (score <= 2) return { strength: 25, label: "Weak", color: "bg-red-500" }
    if (score === 3) return { strength: 50, label: "Fair", color: "bg-yellow-500" }
    if (score === 4) return { strength: 100, label: "Strong", color: "bg-green-500" }

    return { strength: 0, label: "", color: "" }
  }

  const validateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 13
    }

    return age >= 13
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

    if (!formData.password) newErrors.password = "Password is required"
    else {
      const validation = validatePassword(formData.password)
      if (!validation.minLength) newErrors.password = "Password must be at least 8 characters"
      else if (!validation.hasUpper || !validation.hasLower || !validation.hasNumber) {
        newErrors.password = "Password must contain uppercase, lowercase, and numbers"
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    else if (!validateAge(formData.dateOfBirth)) {
      newErrors.dateOfBirth = "You must be at least 13 years old"
    }

    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
      })

      setIsSuccess(true)

      // Redirect to profile page after 2 seconds
      setTimeout(() => {
        router.push("/profile?welcome=true")
      }, 2000)
    } catch (error) {
      setErrors({ submit: "Failed to create account. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  if (isSuccess) {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Account Created Successfully!</h3>
          <p className="text-gray-600">
            Welcome to Newton Scholarship Nexus! Redirecting you to complete your profile...
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Setting up your profile...</span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          className={errors.dateOfBirth ? "border-red-500" : ""}
        />
        {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {formData.password && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
              <span className="text-sm font-medium">{passwordStrength.label}</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(validatePassword(formData.password)).map(([key, valid]) => (
                  <div
                    key={key}
                    className={`flex items-center space-x-1 ${valid ? "text-green-600" : "text-gray-400"}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${valid ? "bg-green-600" : "bg-gray-300"}`} />
                    <span>
                      {key === "minLength" && "8+ characters"}
                      {key === "hasUpper" && "Uppercase"}
                      {key === "hasLower" && "Lowercase"}
                      {key === "hasNumber" && "Number"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {formData.confirmPassword && formData.password === formData.confirmPassword && (
          <p className="text-sm text-green-600 flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>Passwords match</span>
          </p>
        )}
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
          />
          <Label htmlFor="agreeToTerms" className="text-sm">
            I agree to the{" "}
            <a href="/terms" className="text-navy hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-navy hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <Button type="submit" className="w-full bg-navy hover:bg-navy/90" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      <div className="text-center">
        <button type="button" onClick={() => onViewChange("login")} className="text-sm text-navy hover:underline">
          Already have an account? Sign in
        </button>
      </div>
    </form>
  )
}
