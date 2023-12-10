import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const profile = await getCurrentProfile();

    const { searchParams } = new URL(req.url);
    const communityId = searchParams.get("communityId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!communityId) return new NextResponse("community id missing", { status: 404 });

    const community = await db.community.findUnique({
      where: {
        id: communityId,
      },
      include: {
        members: true,
      },
    });

    if (!community) return new NextResponse("Community not found", { status: 404 });

    const currentMember = community.members.filter((member) => member.profileId === profile.id);

    return NextResponse.json({ community, currentMember });
  } catch (error) {
    console.log("COMMUNITY_SPECIFIC_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
