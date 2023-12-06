import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const communityId = searchParams.get("communityId");

    if (!communityId) return new NextResponse("community id missing", { status: 404 });

    const community = await db.community.findUnique({
      where: {
        id: communityId,
      },
    });

    return NextResponse.json(community);
  } catch (error) {
    console.log("COMMUNITY_SPECIFIC_GET", error);
  }
}
