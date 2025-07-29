// Jest setup file
import { beforeEach, jest } from "@jest/globals";
import { PrismaClient } from "@prisma/client";
import { mockDeep, MockProxy, mockReset } from "jest-mock-extended";

// Define a more specific type for our mock
type MockedPrismaClient = MockProxy<PrismaClient> & {
  file: {
    create: jest.Mock;
    findUnique: jest.Mock;
    findMany: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
};

// Create a mock instance of PrismaClient
export const prismaMock = mockDeep<PrismaClient>() as MockedPrismaClient;

// Mock the PrismaClient
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => prismaMock),
    Prisma: {
      ModelName: {
        File: "File",
      },
    },
  };
});

// Reset mocks before each test
beforeEach(() => {
  mockReset(prismaMock);

  // Ensure mock functions are properly configured
  jest.clearAllMocks();
});

// No need to create another instance, we already have prismaMock

// Mock the global prisma singleton
jest.mock("../src/db/client", () => {
  return {
    prisma: prismaMock,
  };
});
