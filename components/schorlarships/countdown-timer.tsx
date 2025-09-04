"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"

interface CountdownTimerProps {
  deadline: string
  variant?: "default" | "compact" | "detailed"
  showIcon?: boolean
  urgencyThreshold?: number // days
}

export function CountdownTimer({
  deadline,
  variant = "default",
  showIcon = true,
  urgencyThreshold = 7,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    total: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadlineDate = new Date(deadline)
      const now = new Date()
      const difference = deadlineDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds, total: difference })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  const isUrgent = timeLeft.days <= urgencyThreshold && timeLeft.total > 0
  const isExpired = timeLeft.total <= 0

  const getVariantClasses = () => {
    if (isExpired) return "bg-gray-500 text-white"
    if (isUrgent) return "bg-red-500 text-white animate-pulse"
    return "bg-green-500 text-white"
  }

  const formatTime = () => {
    if (isExpired) return "Expired"

    if (variant === "compact") {
      if (timeLeft.days > 0) return `${timeLeft.days}d ${timeLeft.hours}h`
      if (timeLeft.hours > 0) return `${timeLeft.hours}h ${timeLeft.minutes}m`
      return `${timeLeft.minutes}m ${timeLeft.seconds}s`
    }

    if (variant === "detailed") {
      return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
    }

    // Default variant
    if (timeLeft.days > 0) return `${timeLeft.days} days left`
    if (timeLeft.hours > 0) return `${timeLeft.hours} hours left`
    return `${timeLeft.minutes} minutes left`
  }

  return (
    <Badge className={`${getVariantClasses()} flex items-center gap-1 text-xs font-medium`}>
      {showIcon && (isExpired ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />)}
      {formatTime()}
    </Badge>
  )
}
