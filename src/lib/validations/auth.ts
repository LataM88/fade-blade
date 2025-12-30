import { z } from "zod";

export const passwordValidation = z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" });

export const phoneValidation = z.string().min(9, { message: "Phone number is required" });

export const signUpSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    secondName: z.string().min(1, { message: "Second name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: passwordValidation,
    phoneNumber: phoneValidation,
});

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export type SignInFormData = z.infer<typeof signInSchema>;
