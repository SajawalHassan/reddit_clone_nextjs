import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const values = await req.json();
    const { communityId } = values;

    const community = await db.community.update({
      where: {
        id: communityId,
      },
      data: {
        members: {
          create: [{ profileId: profile.id }],
        },
      },
      include: {
        members: true,
      },
    });

    if (!community) return new NextResponse("Community not found", { status: 404 });

    const currentMember = community.members.filter((member) => member.profileId === profile.id);

    return NextResponse.json({ community, currentMember: currentMember[0] });
  } catch (error) {
    console.log("COMMUNITY_LEAVE_PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
