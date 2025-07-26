import { object, string } from "zod";

export const createSessionSchema = object({
  body: object({
    phoneNumber: string({
      error: "phoneNumber is required",
    }),
    password: string({
      error: "Password is required",
    }),
  }),
});

export const renewSessionSchema = object({
  body: object({
    refreshToken: string({
      error: "refreshToken is required",
    }),
  }),
});
