import { TypeOf, object, string } from "zod";
import { phoneRegex } from "../constants";

export enum ERoles {
  user = "user",
  admin = "admin",
}

export default interface IUser {
  id: string;
  phoneNumber: string;
  userName: string;
  role: ERoles;
  createdAt: Date;
}

export interface UserInput {
  phoneNumber: string;
  userName: string;
  password: string;
  role: ERoles;
  comparePassword: (candidatePassword: string) => Promise<Boolean>;
}

export interface UpdateUserInput {
  phoneNumber?: string;
  userName?: string;
  password?: string;
}

export const createUserSchema = object({
  body: object({
    phoneNumber: string({
      required_error: "Phone Number is required",
    }).regex(phoneRegex, "Please enter a valid phone number"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short, please enter at least 6 characters"),
    userName: string({
      required_error: "User Name is required",
    }).min(3, "User Name must be at least 3 characters long"),
    role: string().optional(),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
