"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, BookOpen, LogOut, Settings, User } from "lucide-react";
// import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth";
import { AuthModal } from "./auth/auth-modal";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const { theme, setTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup">(
     "login"
   );
  const { user, logout, loading } = useAuth();
  const path = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/blog", label: "Resources" },
    { href: "/about", label: "About NSN" },
    { href: "/contact", label: "Contact" },
  ];

  
  const getLogoSource = () => {
    if (path === "/" && !isScrolled) {
      return "/images/nsn-white.png";
    }
    // return theme === "dark" ? "/images/nsn-white.png" : "/images/nsnlogo.png";
    return "/images/nsnlogo.png"
  };

  const logoSource = getLogoSource();

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsScrolled(true);
  };

  const handleAuthClick = (view: "login" | "signup") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };


  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800"
            : path === "/"
            ? "bg-transparent"
            : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md"
        )}
      >
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo - Consistent rendering */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src={logoSource}
                width={100}
                height={50}
                alt="NSN Logo"
                className="transition-all duration-300"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "hover:text-navy dark:hover:text-gold transition-colors duration-300 font-medium",
                    path === "/" && !isScrolled
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className="w-full h-full flex items-center justify-center bg-background p-1 rounded-full">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <Settings className="mr-2 h-4 w-4" />
                          Profile Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                !loading && (
                  <div className="hidden sm:flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleAuthClick("login")}
                      className={cn(
                        "font-medium",
                        path === "/" && !isScrolled
                          ? "text-white hover:bg-white/10 hover:text-white"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      Log In
                    </Button>
                    <Button
                      onClick={() => handleAuthClick("signup")}
                      className="bg-navy hover:bg-navy/90 text-white"
                    >
                      Sign Up
                    </Button>
                  </div>
                )
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenMobileMenu}
                className={cn(
                  "lg:hidden",
                  path === "/" && !isScrolled
                    ? "text-white hover:bg-white/10 hover:text-white"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="w-full lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col space-y-3 pt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "hover:text-navy dark:hover:text-gold transition-colors duration-300 font-medium px-2 py-1",
                      path === item.href
                        ? "text-navy dark:text-gold"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="flex flex-col gap-3 pt-2">
                  {user ? (
                    <>
                      <Link href="/dashboard">
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/profile">
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Profile Settings
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    !loading && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => handleAuthClick("login")}
                          className="w-full justify-center bg-transparent"
                        >
                          Log In
                        </Button>
                        <Button
                          onClick={() => handleAuthClick("signup")}
                          className="w-full bg-navy hover:bg-navy/90 text-white"
                        >
                          Create Account
                        </Button>
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultView={authModalView}
      />
    </>
  );
}
