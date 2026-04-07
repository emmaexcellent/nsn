"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [currentView, setCurrentView] = useState<
    "login" | "signup" | "forgot-password"
  >(defaultView);

  useEffect(() => {
    if (isOpen) {
      setCurrentView(defaultView);
    }
  }, [defaultView, isOpen]);

  const handleSuccess = () => {
    onClose();
    setCurrentView("login");
    router.push("/dashboard");
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
      <DialogContent className="sm:max-w-lg py-6 border-0 overflow-y-auto max-h-[95%]">
        {renderCurrentView()}
      </DialogContent>
    </Dialog>
  );
}
