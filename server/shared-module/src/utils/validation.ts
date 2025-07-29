/**
 * Validation utilities for consistent data validation across services
 */

export class ValidationError extends Error {
  public readonly errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Simple validator function to check if a value is defined and not null
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

/**
 * Simple validator function to check if a string is not empty
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Simple validator function to check if a value is a valid email
 */
export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  
  // Simple email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Validate an object against a schema of validation functions
 */
export function validateObject<T extends Record<string, any>>(
  obj: unknown, 
  schema: Record<keyof T, (value: unknown) => boolean>,
  requiredFields: Array<keyof T> = []
): ValidationResult<T> {
  if (typeof obj !== 'object' || obj === null) {
    return {
      success: false,
      errors: { _general: ['Input must be an object'] }
    };
  }

  const errors: Record<string, string[]> = {};
  const validatedData: Partial<T> = {};

  // Check required fields
  for (const field of requiredFields) {
    if (!(field in obj)) {
      errors[field as string] = [`${String(field)} is required`];
    }
  }

  // Validate fields according to schema
  for (const [field, validator] of Object.entries(schema)) {
    const value = (obj as any)[field];
    
    if (value !== undefined) {
      if (validator(value)) {
        validatedData[field as keyof T] = value;
      } else {
        errors[field] = [`Invalid value for ${field}`];
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors
    };
  }

  return {
    success: true,
    data: validatedData as T
  };
}
