import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const values = await req.json();
    const { memberId, communityId } = values;

    const community = await db.community.update({
      where: {
        id: communityId,
      },
      data: {
        members: {
          create: [{ id: memberId, profileId: profile.id }],
        },
      },
    });

    if (!community) return new NextResponse("Community not found", { status: 404 });

    return NextResponse.json("Left community");
  } catch (error) {
    console.log("COMMUNITY_LEAVE_PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
