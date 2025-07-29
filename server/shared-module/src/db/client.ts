import { PrismaClient } from '@prisma/client';

// Create a singleton instance of the Prisma client
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

// Use type 'any' to avoid TypeScript issues with global variables
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Create a global variable for the Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Export the Prisma client as a singleton
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// In non-production environments, add the Prisma client to the global object
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
