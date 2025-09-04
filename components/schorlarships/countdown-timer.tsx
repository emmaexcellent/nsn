"use client";

import { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { differenceInDays, formatDistanceToNow } from "date-fns";

interface CountdownTimerProps {
  deadline: string;
  variant?: "badge" | "compact";
  className?: string;
}

export default function CountdownTimer({
  deadline,
  variant = "badge",
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const deadlineDate = new Date(deadline);
      const now = new Date();

      if (deadlineDate < now) {
        setTimeLeft("Expired");
        return;
      }

      const daysLeft = differenceInDays(deadlineDate, now);

      if (variant === "compact") {
        setTimeLeft(`${daysLeft}d left`);
      } else {
        if (daysLeft <= 0) {
          setTimeLeft("Last day");
        } else if (daysLeft <= 7) {
          setTimeLeft(`${daysLeft} days remaining`);
        } else {
          setTimeLeft(`Due ${formatDistanceToNow(deadlineDate)}`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60 * 60 * 1000); // Update every hour

    return () => clearInterval(interval);
  }, [deadline, variant]);

  const isUrgent = timeLeft.includes("days") && parseInt(timeLeft) <= 3;

  if (variant === "badge") {
    return (
      <Badge
        variant={
          timeLeft === "Expired"
            ? "destructive"
            : isUrgent
            ? "destructive"
            : "outline"
        }
        className={`text-xs ${className}`}
      >
        {timeLeft}
      </Badge>
    );
  }

  return (
    <span
      className={`text-sm ${
        timeLeft === "Expired"
          ? "text-red-600"
          : isUrgent
          ? "text-orange-500"
          : "text-gray-500"
      } ${className}`}
    >
      {timeLeft}
    </span>
  );
}
