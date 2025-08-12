"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const path = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/blog", label: "Resources" },
    { href: "/about", label: "About NSN" },
    { href: "/contact", label: "Contact" },
  ];

  // Improved logo selection logic
  const getLogoSource = () => {
    // Always use white logo on homepage when not scrolled
    if (path === "/" && !isScrolled) {
      return "/images/nsn-white.png";
    }
    // Use theme-based logo otherwise
    return theme === "dark" ? "/images/nsn-white.png" : "/images/nsnlogo.png";
  };

  const logoSource = getLogoSource();

  return (
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
      <div className="w-full max-w-6xl mx-auto px-4 py-4">
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden sm:flex"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Link href="/dashboard">
              <Button className="hidden sm:flex bg-navy hover:bg-navy/90 text-white">
                Dashboard
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
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
            <div className="flex flex-col space-y-4 pt-4">
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
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 mr-2" />
                  ) : (
                    <Moon className="h-4 w-4 mr-2" />
                  )}
                  {theme === "dark" ? "Light" : "Dark"} Mode
                </Button>
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="bg-navy hover:bg-navy/90 text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
