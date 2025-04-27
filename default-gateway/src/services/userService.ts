import omit from "lodash/omit";
import prisma from "./client";
import { UserInput } from "../models/userModel";
import bcrypt from "bcrypt";

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

//export async function updateUser() {}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch (err: any) {
    console.error(err);
  }
}
