import bcrypt from "bcrypt";
import omit from "lodash/omit";
import { UserInput } from "../models/userModel";
import prisma from "./client";

export async function findUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (err: any) {
    console.error(err);
  }
}

export async function findUserByPhoneNumber(phoneNumber: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    });
    return user;
  } catch (err: any) {
    console.error(err);
  }
}

export async function createUser(input: Omit<UserInput, "comparePassword">) {
  try {
    // hash the password
    const salt = bcrypt.genSaltSync(10);
    input.password = bcrypt.hashSync(input.password, salt);

    // Create a new user
    const newUser = await prisma.user.create({
      data: input,
    });
    return newUser;
  } catch (error: any) {
    console.error(error);
  }
}

export async function validatePassword({
  phoneNumber,
  password,
}: {
  phoneNumber: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({ where: { phoneNumber } });

  if (!user) {
    return false;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return false;
  }
  return omit(user, "password");
}

export async function updateUser(
  updatedUser: Omit<UserInput, "comparePassword"> & { id: string }
) {
  try {
    const user = await prisma.user.update({
      where: { id: updatedUser.id },
      data: updatedUser,
    });
    return user;
  } catch (err: any) {
    console.error(err);
  }
}

export async function deleteUserById(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch (err: any) {
    console.error(err);
  }
}

export async function hasAdmin() {
  const adminUser = await prisma.user.findFirst({
    where: {
      role: "admin",
    },
  });
  return adminUser !== null;
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      phoneNumber: true,
      role: true,
      createdAt: true,
    },
  });
}
