// import { object, string } from "zod";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(20, "Username must contain at most 20 characters"),

    email: z.string().email("Invalid email"),

    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be min. 6 chars long")
      .max(20, "Password can't be longer than 20 chars"),

    password_confirmation: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords don't match",
  });

export const todoSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich").max(200),
  description: z.string().min(1, "Beschreibung ist erforderlich").max(20000),
  status: z.enum(["open", "doing", "completed"]).default("open"),
  tags: z.array(z.string()).optional(),
  due_date: z.string().optional(),
});

export type TodoFormValues = z.infer<typeof todoSchema>;
