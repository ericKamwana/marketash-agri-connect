
import * as z from "zod";

// User authentication schema
export const authSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must include uppercase, lowercase, and numbers"
    ),
});

// Bid schema
export const bidSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  bidAmount: z
    .number()
    .positive("Bid amount must be positive")
    .min(0.5, "Minimum bid increment is $0.50"),
  userId: z.string().optional(),
});

// Loan application schema
export const loanApplicationSchema = z.object({
  amount: z
    .number()
    .positive("Loan amount must be positive")
    .min(100, "Minimum loan amount is $100")
    .max(50000, "Maximum loan amount is $50,000"),
  term_months: z
    .number()
    .int("Loan term must be a whole number")
    .min(1, "Minimum term is 1 month")
    .max(60, "Maximum term is 60 months"),
  purpose: z
    .string()
    .min(5, "Purpose description must be at least 5 characters")
    .max(200, "Purpose description cannot exceed 200 characters"),
  collateral: z.string().optional(),
});

// Product listing schema
export const productListingSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(500, "Description cannot exceed 500 characters"),
  basePrice: z
    .number()
    .positive("Base price must be positive")
    .min(0.01, "Minimum price is $0.01"),
  unit: z.string().min(1, "Unit is required"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be positive"),
  location: z.string().min(1, "Location is required"),
  harvestDate: z.string().min(1, "Harvest date is required"),
});

// Crop diagnosis schema
export const cropDiagnosisSchema = z.object({
  cropType: z.string().min(1, "Crop type is required"),
  symptoms: z
    .string()
    .min(10, "Symptoms must be at least 10 characters")
    .max(500, "Symptoms cannot exceed 500 characters"),
  imageUrls: z.array(z.string().url("Invalid image URL")).optional(),
});
