import * as z from "zod";

export const plainFormSchema = z.object({
  title: z.string().min(1, "Please enter a title!").max(300, "Max characters for title exceeded!"),
  communityId: z.string().min(1, "Please select a community"),
  isSpoiler: z.boolean(),
  postContent: z.string(),
  imageUrl: z.string(),
  link: z.string(),
});

export const mediaFormSchema = z.object({
  title: z.string().min(1, "Please enter a title!").max(300, "Max characters for title exceeded!"),
  communityId: z.string().min(1, "Please select a community"),
  isSpoiler: z.boolean(),
  postContent: z.string(),
  imageUrl: z.string().min(1, "Please submit an image"),
  link: z.string(),
});

export const linkFormSchema = z.object({
  title: z.string().min(1, "Please enter a title!").max(300, "Max characters for title exceeded!"),
  communityId: z.string().min(1, "Please select a community"),
  isSpoiler: z.boolean(),
  postContent: z.string(),
  imageUrl: z.string(),
  link: z.string().min(1, "Please enter a link").url("Invalid url"),
});
