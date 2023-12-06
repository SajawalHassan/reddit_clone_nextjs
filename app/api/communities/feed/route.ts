import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const POSTS_BATCH = 10;

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const profile = await getCurrentProfile();

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const communityId = searchParams.get("communityId");
    const feedType = searchParams.get("feedType");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!communityId) return new NextResponse("Community id not found", { status: 404 });
    if (feedType !== "new" && feedType !== "hot") return new NextResponse("Feed type incorrect", { status: 400 });

    let posts: PostWithMemberWithProfileWithCommunityWithVotes[] = [];

    if (!cursor) {
      if (feedType === "new") {
        posts = await db.post.findMany({
          take: POSTS_BATCH,
          where: {
            communityId,
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
          orderBy: {
            createdAt: "desc",
          },
        });
      }
      if (feedType === "hot") {
        posts = await db.post.findMany({
          take: POSTS_BATCH,
          where: {
            communityId,
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
          orderBy: {
            upvotes: {
              _count: "desc",
            },
          },
        });
      }
    }

    if (cursor) {
      if (feedType === "new") {
        posts = await db.post.findMany({
          take: POSTS_BATCH,
          skip: 1,
          cursor: {
            id: cursor,
          },
          where: {
            communityId,
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
          orderBy: {
            createdAt: "desc",
          },
        });
      }
      if (feedType === "hot") {
        posts = await db.post.findMany({
          take: POSTS_BATCH,
          skip: 1,
          cursor: {
            id: cursor,
          },
          where: {
            communityId,
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
          orderBy: {
            upvotes: {
              _count: "desc",
            },
          },
        });
      }
    }

    let nextCursor = posts[POSTS_BATCH - 1]?.id;

    return NextResponse.json({ items: posts, feedItems: posts, nextCursor });
  } catch (error) {
    console.log("COMMUNITIES_FEED_GET", error);
  }
}