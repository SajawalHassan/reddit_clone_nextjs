import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const currentProfile = await getCurrentProfile();

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("profileId");

    if (!currentProfile) return new NextResponse("Unauthorized", { status: 401 });
    if (!profileId) return new NextResponse("profile id missing", { status: 404 });

    const profile = await db.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) return new NextResponse("Profile not found", { status: 404 });

    return NextResponse.json(profile);
  } catch (error) {
    console.log("PROFILE_SPECIFIC_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
