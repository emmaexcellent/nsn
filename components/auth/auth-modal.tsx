"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { ForgotPasswordForm } from "./forgot-password-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "signup";
}

export function AuthModal({
  isOpen,
  onClose,
  defaultView = "login",
}: AuthModalProps) {
  const [currentView, setCurrentView] = useState<
    "login" | "signup" | "forgot-password"
  >(defaultView);

  const handleSuccess = () => {
    onClose();
    // Reset to login view for next time
    setCurrentView("login");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToSignup={() => setCurrentView("signup")}
            onForgotPassword={() => setCurrentView("forgot-password")}
          />
        );
      case "signup":
        return (
          <SignupForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setCurrentView("login")}
          />
        );
      case "forgot-password":
        return <ForgotPasswordForm onBack={() => setCurrentView("login")} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-y-auto max-h-[95%]">
        {renderCurrentView()}
      </DialogContent>
    </Dialog>
  );
}
