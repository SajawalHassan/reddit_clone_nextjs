import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const POSTS_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const profileId = searchParams.get("profileId");

    if (!profileId) return new NextResponse("Profile id missing", { status: 400 });

    let posts: any[] = [];

    if (!cursor) {
      posts = await db.post.findMany({
        take: POSTS_BATCH,
        where: {
          member: {
            profileId: profile.id,
          },
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          community: true,
          upvotes: true,
          downvotes: true,
          comments: true,
        },
      });
    } else {
      posts = await db.post.findMany({
        take: POSTS_BATCH,
        skip: 1,
        where: {
          member: {
            profileId: profile.id,
          },
        },
        cursor: {
          id: cursor,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
          community: true,
          upvotes: true,
          downvotes: true,
          comments: true,
        },
      });
    }

    let nextCursor = posts[POSTS_BATCH - 1]?.id;

    return NextResponse.json({ items: posts, feedItems: posts, nextCursor });
  } catch (error) {
    console.log("POST_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
