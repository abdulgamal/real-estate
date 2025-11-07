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
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface RegisterResponse {
  message: number | string;
  status: string;
  status_code: number;
  data: {
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
}

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password_confirmation: "",
    userType: "homeowner",
  });
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    // Validate password confirmation
    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await post<RegisterResponse>("/register", formData);
      
      // Handle successful registration response
      if (response.data && response.data.user && response.data.access_token) {
        // Store auth data in Zustand
        setAuth({
          user: response.data.user,
          access_token: response.data.access_token,
          token_type: response.data.token_type || "Bearer",
        });
        
        toast.success("Registration successful! Redirecting to dashboard...");
        setSuccess(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        toast.error("Registration successful but invalid response format");
        setError("Registration successful but invalid response format");
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
          const errorMessage = errorData.message || (Object.keys(fieldErrorMap).length > 0 ? "Please fix the errors below" : "Registration failed. Please try again.");
          toast.error(errorMessage);
          setError(errorMessage);
        } else {
          const errorMessage = err.message || "Registration failed. Please try again.";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Registration Successful!</h2>
              <p className="text-muted-foreground">
                Your account has been created. Redirecting to dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create your account
          </CardTitle>
          <CardDescription className="text-center">
            Fill in your information to get started
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={fieldErrors.firstName ? "border-destructive" : ""}
                />
                {fieldErrors.firstName && (
                  <p className="text-sm text-destructive">{fieldErrors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={fieldErrors.lastName ? "border-destructive" : ""}
                />
                {fieldErrors.lastName && (
                  <p className="text-sm text-destructive">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

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
                placeholder="Enter password"
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

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Confirm password"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={fieldErrors.password_confirmation ? "border-destructive" : ""}
              />
              {fieldErrors.password_confirmation && (
                <p className="text-sm text-destructive">{fieldErrors.password_confirmation}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

