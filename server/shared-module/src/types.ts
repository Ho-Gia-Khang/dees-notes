/**
 * Shared types for use across services
 */

export * from "./models";

// Common response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

// Pagination types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
