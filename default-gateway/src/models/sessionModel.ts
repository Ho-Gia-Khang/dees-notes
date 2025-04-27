import { object, string } from "zod";

export const createSessionSchema = object({
  body: object({
    phoneNumber: string({
      required_error: "phoneNumber is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
  }),
});
