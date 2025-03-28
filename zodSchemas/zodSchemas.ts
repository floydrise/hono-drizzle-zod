import {z} from "zod";

export const todoSchema = z.object({
    title: z.string().min(3),
    is_done: z.boolean().default(false).optional(),
});
export const idSchema = z.object({
    id: z.coerce.number().int().positive(),
});
export const patchTodoSchema = z.object({
    title: z.string().min(3).optional(),
    is_done: z.boolean().optional(),
});