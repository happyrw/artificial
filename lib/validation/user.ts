import * as z from 'zod';

export const UserValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(3).max(30),
    username: z.string().min(3).max(30),
    bio: z.string().min(3).max(1000),
});

export const formSchema = z.object({
    title: z.string(),
    publicId: z.string().optional(),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string(),
});