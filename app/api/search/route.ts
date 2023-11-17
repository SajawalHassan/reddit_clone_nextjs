import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const searchText = searchParams.get("searchText");
    if (!searchText) return new NextResponse("Search text missing", { status: 400 });

    const communities = await db.community.findMany({
      where: {
        uniqueName: {
          contains: searchText,
        },
      },
      include: {
        members: true,
      },
    });

    const profiles = await db.profile.findMany({
      where: {
        displayName: {
          contains: searchText,
        },
      },
    });

    return NextResponse.json({ communities, profiles });
  } catch (error) {
    console.log("[COMMUNITIES_SEARCH_GET]", error);
  }
}
