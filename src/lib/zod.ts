// import { object, string } from "zod";
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address."),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z
  .object({
    username: z
      .string({ required_error: "Username is required" })
      .min(1, "Username required")
      .max(20, "Username can be max. 20 chars"),

    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),

    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be min. 6 chars long")
      .max(20, "Password can't be longer than 20 chars"),

    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
