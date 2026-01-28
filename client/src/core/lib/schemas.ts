import { z } from "zod";

export const insertUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["business_user", "admin"]).default("business_user"),
  status: z.enum(["pending", "approved", "restricted"]).default("pending"),
  businessName: z.string().min(1, "Business Name is required"),
  phone: z.string().optional(),
  location: z.string().optional(),
  productionFocus: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  needs: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
