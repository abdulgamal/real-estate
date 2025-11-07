"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, FileText, BarChart3, User, Shield, Menu, X, LogOut, MessageCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/auth";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const navigation: NavigationItem[] = [
    { name: "Home", href: "/", icon: Home },
    { name: "Application", href: "/application", icon: FileText },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Uliza", href: "/uliza", icon: MessageCircle },
  ];

  const isActive = (path: string): boolean => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    clearAuth();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/paysoko_logo_trans.png"
                alt="Logo"
                width={220}
                height={44}
                className="mr-2"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  asChild
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className={`flex items-center gap-2 px-4 py-2 text-base font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Link href={item.href}>
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
            {!isAuthenticated ? (
              <div className="ml-6 flex items-center gap-3 pl-6 border-l border-gray-200">
                <Button 
                  asChild 
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-blue-600 text-white hover:bg-blue-700 font-medium"
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            ) : (
              <div className="ml-6 flex items-center gap-3 pl-6 border-l border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.name || user?.email || "User"}
                  </span>
                </div>
                <Button 
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              {!isAuthenticated ? (
                <div className="pt-3 space-y-2 border-t border-gray-200 mt-3">
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="pt-3 space-y-2 border-t border-gray-200 mt-3">
                  <div className="flex items-center gap-3 px-4 py-3 text-gray-600">
                    <User className="h-5 w-5" />
                    <span className="text-base font-medium">
                      {user?.first_name && user?.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user?.name || user?.email || "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

