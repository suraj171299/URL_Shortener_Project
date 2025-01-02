import { z } from "zod";

export const urlValidationSchema = z.object({
    longUrl: z.string({ required_error: "Long Url is required"})
        .url({ message: "Invalid Url"}),
    customAlias: z.string()
        .max(15, { message: "Alias cannot exceed 15 characters" })
        .optional(),
    topic: z.string()
        .max(15, { message: "Topic cannot exceed 15 characters" })
        .optional()
})

export const aliasValidationSchema = z.object({
    alias: z.string({ required_error: "Alias is required" })
        .min(1, { message: "Alias cannot be empty" })
        .max(15, { message: "Alias cannot exceed 15 characters" })
})

export const topicValidationSchema = z.object({
    topic: z.string({ required_error: "Topic is required" })
        .min(1, "Topic cannot be empty")
        .max(15, { message: "Topic cannot exceed 15 characters" })
})