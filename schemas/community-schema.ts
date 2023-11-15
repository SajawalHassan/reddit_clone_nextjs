import { CommunityType } from "@prisma/client";
import * as z from "zod";

export const createCommunityFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be between 3 and 21 characters" }).max(21, { message: "Name must be between 3 and 21 characters" }),
  uniqueName: z
    .string()
    .min(3, { message: "Unique name must be between 3 and 21 characters" })
    .max(21, { message: "Unique name must be between 3 and 21 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Unique name can only contain alphabets and numbers, the only special character allowed is _",
    }),
  imageUrl: z.string(),
  type: z.nativeEnum(CommunityType),
});
