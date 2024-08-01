import { z } from "zod";

export const authFormSchema = (type: string) =>
  z.object({
    //sign up
    firstName: type === "sign-in" ? z.string().optional() : z.string().min(3).max(20),
    lastName: type === "sign-in" ? z.string().optional() : z.string().min(3).max(20),
    address1: type === "sign-in" ? z.string().optional() : z.string().max(50),
    city: type === "sign-in" ? z.string().optional() : z.string().max(50),
    state: type === "sign-in" ? z.string().optional() : z.string().min(2).max(2),
    postalCode: type === "sign-in" ? z.string().optional() : z.string().min(3).max(6),
    dateOfBirth: type === "sign-in" ? z.string().optional() : z.string().min(3),
    ssn: type === "sign-in" ? z.string().optional() : z.string().min(3),
    //both
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters."),
  });
