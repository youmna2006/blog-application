const { z } = require("zod");

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
});

const loginSchema = z.object({email: z.string().trim().email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required")
});

const updateProfileSchema = z.object({
    username: z
      .string()
      .trim()
      .min(3)
      .max(50)
      .optional(),

    email: z
      .string()
      .trim()
      .email()
      .optional()
  })
  .refine((data) => Object.keys(data).length > 0,{ message: "At least one field is required" });

module.exports = { registerSchema,loginSchema,updateProfileSchema};