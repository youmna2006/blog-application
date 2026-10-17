const { z } = require("zod");

const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200),

  content: z
    .string()
    .trim()
    .min(1, "Content is required")
});

const updatePostSchema = z.object({
    title: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .optional(),

    content: z
      .string()
      .trim()
      .min(1)
      .optional()
  })

  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field is required" }
  );

module.exports = {createPostSchema,updatePostSchema};