import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { createCommunityFormSchema } from "@/schemas/community-schema";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { fromZodError } from "zod-validation-error";

export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const values = await req.json();

    const validatedValues = createCommunityFormSchema.safeParse(values);
    if (!validatedValues.success) return new NextResponse(fromZodError(validatedValues.error).toString(), { status: 400 });

    const { name, uniqueName, type, imageUrl } = validatedValues.data;

    const communityNameTaken = await db.community.findUnique({
      where: {
        uniqueName,
      },
    });

    if (communityNameTaken) return new NextResponse("Community name is already taken.", { status: 400 });

    const newCommunity = await db.community.create({
      data: {
        profileId: profile.id,
        name,
        uniqueName,
        type,
        imageUrl,
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(newCommunity);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const communities = await db.community.findMany({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(communities);
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
