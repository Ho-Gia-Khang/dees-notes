/**
 * Shared types for use across services
 */

export * from "./models";

/**
 * API Error interface, in object form, with the key is the field that get error, and the value is the error content
 */
export type IApiError = {
  message: Record<string, string>;
  code?: string;
};

// Pagination types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  error?: IApiError;
}

// Common user types
export interface UserBasic {
  id: string;
  username: string;
  email: string;
}

// Service health check
export interface ServiceHealth {
  service: string;
  status: "healthy" | "degraded" | "unhealthy";
  version: string;
  timestamp: string;
  details?: Record<string, any>;
}
