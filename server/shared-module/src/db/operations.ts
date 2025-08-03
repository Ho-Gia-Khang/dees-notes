import { prisma } from "./client";
import { Prisma, PrismaClient } from "@prisma/client";
import { PaginationParams, PaginatedResponse } from "../types";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants";

// Type for model keys in PrismaClient
type PrismaModels = keyof Omit<
  PrismaClient,
  | "$connect"
  | "$disconnect"
  | "$on"
  | "$transaction"
  | "$use"
  | "$extends"
  | "$queryRaw"
  | "$executeRaw"
  | "$queryRawUnsafe"
  | "$executeRawUnsafe"
>;

// Generic type for database operations
type ModelName = Prisma.ModelName;

/**
 * Generic CRUD operations for Prisma models
 */
export class DatabaseOperations<T extends Record<string, any>> {
  private model: any;

  constructor(modelName: ModelName) {
    // Convert model name to lowercase for accessing prisma client
    const modelKey = modelName.toLowerCase() as PrismaModels;
    this.model = prisma[modelKey];
  }

  /**
   * Create a new record
   * @param data The data to create (fields with default values are optional)
   * @returns The created record
   */
  async create(data: any): Promise<T> {
    return this.model.create({
      data,
    }) as Promise<T>;
  }

  /**
   * Find a record by ID
   * @param id The ID of the record to find
   * @returns The found record or null
   */
  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    }) as Promise<T | null>;
  }

  /**
   * Find many records with optional filtering, pagination, and sorting
   * @param options Query options
   * @returns Array of records
   */
  async findMany(
    options: {
      where?: Record<string, any>;
      skip?: number;
      take?: number;
      orderBy?: Record<string, "asc" | "desc">;
    } = {}
  ): Promise<T[]> {
    const { where, skip, take, orderBy } = options;

    return this.model.findMany({
      where,
      skip,
      take,
      orderBy,
    }) as Promise<T[]>;
  }

  /**
   * Update a record by ID
   * @param id The ID of the record to update
   * @param data The data to update
   * @returns The updated record
   */
  async update(id: string, data: Partial<Omit<T, "id">>): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    }) as Promise<T>;
  }

  /**
   * Delete a record by ID
   * @param id The ID of the record to delete
   * @returns The deleted record
   */
  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    }) as Promise<T>;
  }

  /**
   * Count records with optional filtering
   * @param where Filter conditions
   * @returns Count of records
   */
  async count(where: Record<string, any> = {}): Promise<number> {
    return this.model.count({ where });
  }

  /**
   * Get paginated results
   * @param pagination Pagination parameters
   * @param where Filter conditions
   * @param orderBy Sorting options
   * @returns Paginated response
   */
  async findPaginated({
    where,
    pagination = {},
    orderBy = {},
  }: {
    where: Record<string, any>;
    pagination?: PaginationParams;
    orderBy?: Record<string, "asc" | "desc">;
  }): Promise<PaginatedResponse<T>> {
    const page = pagination.page || DEFAULT_PAGE;
    const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;
    const skip = page * pageSize;

    const [items, total] = await Promise.all([
      this.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      }),
      this.count(where),
    ]);

    return {
      items,
      total,
    };
  }
}
