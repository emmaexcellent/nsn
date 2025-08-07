"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"

interface CountdownTimerProps {
  deadline: string
  variant?: "compact" | "detailed" | "badge"
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

export function CountdownTimer({ deadline, variant = "compact", className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadlineDate = new Date(deadline).getTime()
      const now = new Date().getTime()
      const difference = deadlineDate - now

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

  const getUrgencyColor = () => {
    if (timeLeft.total <= 0) return "bg-red-100 text-red-800 border-red-200"
    if (timeLeft.days <= 7) return "bg-red-100 text-red-800 border-red-200"
    if (timeLeft.days <= 30) return "bg-orange-100 text-orange-800 border-orange-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  const getUrgencyIcon = () => {
    if (timeLeft.total <= 0 || timeLeft.days <= 7) {
      return <AlertTriangle className="h-3 w-3" />
    }
    return <Clock className="h-3 w-3" />
  }

  if (timeLeft.total <= 0) {
    return (
      <Badge variant="outline" className={`${getUrgencyColor()} ${className}`}>
        {getUrgencyIcon()}
        <span className="ml-1">Deadline Passed</span>
      </Badge>
    )
  }

  if (variant === "badge") {
    return (
      <Badge variant="outline" className={`${getUrgencyColor()} ${className}`}>
        {getUrgencyIcon()}
        <span className="ml-1">
          {timeLeft.days > 0 ? `${timeLeft.days}d` : `${timeLeft.hours}h ${timeLeft.minutes}m`}
        </span>
      </Badge>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getUrgencyIcon()}
        <span className="text-sm font-medium">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours > 0 && `${timeLeft.hours}h `}
          {timeLeft.minutes > 0 && `${timeLeft.minutes}m`}
          {timeLeft.days === 0 && timeLeft.hours === 0 && ` ${timeLeft.seconds}s`}
        </span>
      </div>
    )
  }

  if (variant === "detailed") {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center space-x-1 mb-2">
          {getUrgencyIcon()}
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Remaining</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white dark:bg-gray-700 rounded p-2">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{timeLeft.days}</div>
            <div className="text-xs text-gray-500">Days</div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded p-2">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{timeLeft.hours}</div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded p-2">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{timeLeft.minutes}</div>
            <div className="text-xs text-gray-500">Minutes</div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded p-2">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{timeLeft.seconds}</div>
            <div className="text-xs text-gray-500">Seconds</div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
