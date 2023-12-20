import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { linkFormSchema, mediaFormSchema, plainFormSchema } from "@/schemas/post-schema";
import { Community, Post } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { SafeParseReturnType } from "zod";
import { fromZodError } from "zod-validation-error";

export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const values = await req.json();

    let validatedValues: SafeParseReturnType<any, any>;
    if (values.type === "plain") {
      validatedValues = plainFormSchema.safeParse(values);
      if (!validatedValues.success) return new NextResponse(fromZodError(validatedValues.error).toString(), { status: 400 });
    } else if (values.type === "media") {
      validatedValues = mediaFormSchema.safeParse(values);
      if (!validatedValues.success) return new NextResponse(fromZodError(validatedValues.error).toString(), { status: 400 });
    } else {
      validatedValues = linkFormSchema.safeParse(values);
      if (!validatedValues.success) return new NextResponse(fromZodError(validatedValues.error).toString(), { status: 400 });
    }

    const { title, froalaContent, communityId, isSpoiler, imageUrl, link } = validatedValues.data;

    if ((froalaContent && imageUrl) || (froalaContent && link)) {
      return new NextResponse("Multiple content types are not supported", { status: 400 });
    }

    const member = await db.member.findFirst({
      where: {
        communityId,
        profileId: profile.id,
      },
    });

    if (!member) {
      return new NextResponse("No member found", { status: 404 });
    }

    const community = await db.community.update({
      where: {
        id: communityId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        posts: {
          create: [{ title, memberId: member?.id, spoiler: isSpoiler, content: froalaContent, imageUrl, link }],
        },
      },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const post = community.posts[0];

    return NextResponse.json({ community, post });
  } catch (error) {
    console.log("POST_CREATE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

const POSTS_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    let posts: any[] = [];

    if (!cursor) {
      posts = await db.post.findMany({
        take: POSTS_BATCH,
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

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const profile = await getCurrentProfile();

    const { searchParams } = new URL(req.url);
    const communityId = searchParams.get("communityId");
    const postId = searchParams.get("postId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!communityId) return new NextResponse("Community id missing", { status: 400 });
    if (!postId) return new NextResponse("Post id missing", { status: 400 });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        member: true,
      },
    });

    if (!post) return new NextResponse("Post not found", { status: 404 });
    if (post.member.profileId !== profile.id) return new NextResponse("Forbidden", { status: 403 });

    await db.$executeRaw`DELETE FROM Comment WHERE postId = ${postId};`;
    await db.$executeRaw`DELETE FROM Post WHERE id = ${postId};`;

    return new NextResponse("Post deleted!");
  } catch (error) {
    console.log("POSTS_DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
