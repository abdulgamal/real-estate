"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { post, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LoginResponse {
  message?: number | string;
  status?: string;
  status_code?: number;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
      user_type: string;
      first_name: string;
      last_name: string;
      institution_name: string | null;
      investor_type_id: number | null;
      business_name: string | null;
      business_type_id: number | null;
      industry_id: number | null;
    };
    access_token: string;
    token_type: string;
  };
  // Legacy format support
  token?: string;
  access_token?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    try {
      const response = await post<LoginResponse>("/login", formData);
      
      // Handle new response format with data object
      if (response.data && response.data.user && response.data.access_token) {
        setAuth({
          user: response.data.user,
          access_token: response.data.access_token,
          token_type: response.data.token_type || "Bearer",
        });
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
      } 
      // Handle legacy format (direct token/access_token)
      else if (response.token || response.access_token) {
        const token = response.token || response.access_token;
        // For legacy format, we'll store minimal user data
        // You may need to fetch user data separately if needed
        if (token) {
          localStorage.setItem("token", token);
        }
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
      } else {
        toast.error("Invalid response from server");
        setError("Invalid response from server");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // Handle validation errors with field-specific messages
        if (err.data && typeof err.data === 'object' && 'errors' in err.data) {
          const errorData = err.data as { errors?: Record<string, string[]>; message?: string };
          const validationErrors = errorData.errors || {};
          const fieldErrorMap: Record<string, string> = {};
          
          // Convert array of error messages to single string per field
          Object.keys(validationErrors).forEach((field) => {
            if (Array.isArray(validationErrors[field]) && validationErrors[field].length > 0) {
              fieldErrorMap[field] = validationErrors[field][0];
            }
          });
          
          setFieldErrors(fieldErrorMap);
          
          // Set general error message if provided
          const errorMessage = errorData.message || (Object.keys(fieldErrorMap).length > 0 ? "Please fix the errors below" : "Invalid email or password");
          toast.error(errorMessage);
          setError(errorMessage);
        } else {
          const errorMessage = err.message || "Invalid email or password";
          toast.error(errorMessage);
          setError(errorMessage);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign in to your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={fieldErrors.email ? "border-destructive" : ""}
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={fieldErrors.password ? "border-destructive" : ""}
              />
              {fieldErrors.password && (
                <p className="text-sm text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

