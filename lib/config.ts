/**
 * API Base URL Configuration
 * Set via NEXT_PUBLIC_API_BASE_URL environment variable
 * 
 * Examples:
 * - Development: http://localhost:8000/api
 * - Production: https://api.example.com
 * - Relative: /api (for Next.js API routes)
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

/**
 * Helper function to build full API URL
 * @param endpoint - API endpoint (e.g., 'applications', 'users', '/applications')
 * @returns Full API URL
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present, we'll add it
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  
  // Ensure API_BASE_URL doesn't end with a slash
  const baseUrl = API_BASE_URL.endsWith("/") 
    ? API_BASE_URL.slice(0, -1) 
    : API_BASE_URL;
  
  return `${baseUrl}/${cleanEndpoint}`;
}
