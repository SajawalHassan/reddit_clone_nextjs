import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    return NextResponse.json(profile);
  } catch (error) {
    console.log("[PROFILE_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const values = await req.json();
    const { data } = values;

    const newProfile = await db.profile.update({
      where: {
        id: profile.id,
      },
      data,
    });

    return NextResponse.json(newProfile);
  } catch (error) {
    console.log("[PROFILE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
