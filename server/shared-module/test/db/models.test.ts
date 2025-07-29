import { FileOperations } from "../../src/db/models";
import { prismaMock } from "../setup";
import { describe, expect, it, beforeEach } from "@jest/globals";

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

describe("FileOperations", () => {
  let fileOperations: FileOperations;

  beforeEach(() => {
    fileOperations = new FileOperations();
    // We don't need to replace the entire prismaMock.file object
    // Jest will automatically track calls to the mock functions
  });

  describe("findByUserId", () => {
    it("should find files by user ID", async () => {
      // Arrange
      const userId = "user-123";
      const mockFiles = [mockFile];
      prismaMock.file.findMany.mockResolvedValue(mockFiles);

      // Act
      const result = await fileOperations.findByUserId(userId);

      // Assert
      expect(prismaMock.file.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(mockFiles);
    });
  });

  describe("findByType", () => {
    it("should find files by type", async () => {
      // Arrange
      const fileType = "text/plain";
      const mockFiles = [mockFile];
      prismaMock.file.findMany.mockResolvedValue(mockFiles);

      // Act
      const result = await fileOperations.findByType(fileType);

      // Assert
      expect(prismaMock.file.findMany).toHaveBeenCalledWith({
        where: { type: fileType },
      });
      expect(result).toEqual(mockFiles);
    });
  });
});
