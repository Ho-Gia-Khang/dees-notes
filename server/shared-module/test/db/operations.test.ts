import { DatabaseOperations } from "../../src/db/operations";
import { prismaMock } from "../setup";
import { Prisma } from "@prisma/client";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

// Define File type to match Prisma schema
type File = {
  id: string;
  name: string;
  size: number;
  type: string;
  userId: string;
  uploadedAt: Date;
  uploadedBy: string;
};

// Mock data
const mockFile = {
  id: "file-123",
  name: "test-file.txt",
  size: 1024,
  type: "text/plain",
  userId: "user-123",
  uploadedAt: new Date(),
  uploadedBy: "Test User",
};

// Create a test implementation of DatabaseOperations
class TestFileOperations extends DatabaseOperations<typeof mockFile> {
  constructor() {
    super("File" as Prisma.ModelName);
  }
}

describe("DatabaseOperations", () => {
  let fileOperations: DatabaseOperations<File>;

  beforeEach(() => {
    jest.clearAllMocks();
    fileOperations = new DatabaseOperations<File>("File");
    // We don't need to replace the entire prismaMock.file object
    // Jest will automatically track calls to the mock functions
  });

  describe("create", () => {
    it("should create a new record", async () => {
      // Arrange
      const fileData = {
        name: mockFile.name,
        size: mockFile.size,
        type: mockFile.type,
        userId: mockFile.userId,
        uploadedBy: mockFile.uploadedBy,
        uploadedAt: mockFile.uploadedAt,
      };
      prismaMock.file.create.mockResolvedValue(mockFile);

      // Act
      const result = await fileOperations.create(fileData);

      // Assert
      expect(prismaMock.file.create).toHaveBeenCalledWith({
        data: fileData,
      });
      expect(result).toEqual(mockFile);
    });
  });

  describe("findById", () => {
    it("should find a record by ID", async () => {
      // Arrange
      prismaMock.file.findUnique.mockResolvedValue(mockFile);

      // Act
      const result = await fileOperations.findById(mockFile.id);

      // Assert
      expect(prismaMock.file.findUnique).toHaveBeenCalledWith({
        where: { id: mockFile.id },
      });
      expect(result).toEqual(mockFile);
    });

    it("should return null when record is not found", async () => {
      // Arrange
      prismaMock.file.findUnique.mockResolvedValue(null);

      // Act
      const result = await fileOperations.findById("non-existent-id");

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findMany", () => {
    it("should find many records with options", async () => {
      // Arrange
      const mockFiles = [mockFile];
      const options = {
        where: { type: "text/plain" },
        skip: 0,
        take: 10,
        orderBy: { uploadedAt: "desc" as const },
      };
      prismaMock.file.findMany.mockResolvedValue(mockFiles);

      // Act
      const result = await fileOperations.findMany(options);

      // Assert
      expect(prismaMock.file.findMany).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockFiles);
    });

    it("should find many records without options", async () => {
      // Arrange
      const mockFiles = [mockFile];
      prismaMock.file.findMany.mockResolvedValue(mockFiles);

      // Act
      const result = await fileOperations.findMany();

      // Assert
      expect(prismaMock.file.findMany).toHaveBeenCalledWith({});
      expect(result).toEqual(mockFiles);
    });
  });

  describe("update", () => {
    it("should update a record by ID", async () => {
      // Arrange
      const updateData = { name: "updated-file.txt" };
      const updatedFile = { ...mockFile, ...updateData };
      prismaMock.file.update.mockResolvedValue(updatedFile);

      // Act
      const result = await fileOperations.update(mockFile.id, updateData);

      // Assert
      expect(prismaMock.file.update).toHaveBeenCalledWith({
        where: { id: mockFile.id },
        data: updateData,
      });
      expect(result).toEqual(updatedFile);
    });
  });

  describe("delete", () => {
    it("should delete a record by ID", async () => {
      // Arrange
      prismaMock.file.delete.mockResolvedValue(mockFile);

      // Act
      const result = await fileOperations.delete(mockFile.id);

      // Assert
      expect(prismaMock.file.delete).toHaveBeenCalledWith({
        where: { id: mockFile.id },
      });
      expect(result).toEqual(mockFile);
    });
  });

  describe("count", () => {
    it("should count records with where condition", async () => {
      // Arrange
      const whereCondition = { type: "text/plain" };
      prismaMock.file.count.mockResolvedValue(5);

      // Act
      const result = await fileOperations.count(whereCondition);

      // Assert
      expect(prismaMock.file.count).toHaveBeenCalledWith({
        where: whereCondition,
      });
      expect(result).toBe(5);
    });

    it("should count all records without where condition", async () => {
      // Arrange

      prismaMock.file.count.mockResolvedValue(10);

      // Act
      const result = await fileOperations.count();

      // Assert
      expect(prismaMock.file.count).toHaveBeenCalledWith({ where: {} });
      expect(result).toBe(10);
    });
  });
});
