/**
 * API utility functions for data fetching
 */

import { getApiUrl } from "./config";

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Get default headers with auth token if available
 */
const getDefaultHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Try to get token from localStorage (for legacy support) or Zustand store
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth-storage");
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData?.state?.access_token) {
          headers.Authorization = `${authData.state.token_type || "Bearer"} ${authData.state.access_token}`;
        }
      } catch {
        // If parsing fails, try legacy token
        const legacyToken = localStorage.getItem("token");
        if (legacyToken) {
          headers.Authorization = `Bearer ${legacyToken}`;
        }
      }
    } else {
      // Fallback to legacy token
      const legacyToken = localStorage.getItem("token");
      if (legacyToken) {
        headers.Authorization = `Bearer ${legacyToken}`;
      }
    }
  }

  return headers;
};

/**
 * Make an API request
 * @param endpoint - API endpoint (e.g., 'applications', 'users/123')
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Promise with the response data
 * @throws ApiError if the request fails
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  const defaultHeaders = getDefaultHeaders();
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      const errorData = isJson ? await response.json().catch(() => null) : null;
      throw new ApiError(
        errorData?.message || `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return null as T;
    }

    return (isJson ? await response.json() : await response.text()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred",
      0
    );
  }
}

/**
 * GET request
 */
export async function get<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST request
 */
export async function post<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request
 */
export async function put<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request
 */
export async function patch<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
}
