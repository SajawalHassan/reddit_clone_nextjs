import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { linkFormSchema, mediaFormSchema, plainFormSchema } from "@/schemas/post-schema";
import { Community, Post } from "@prisma/client";
import { NextResponse } from "next/server";
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
  }
}

const POSTS_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await getCurrentProfile();

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    let posts: any = [];
    let communities: any = [];
    if (cursor) {
      communities = await db.community.findMany({
        where: {
          members: {
            some: {
              profileId: profile.id,
            },
          },
        },
        include: {
          posts: {
            take: POSTS_BATCH,
            skip: 1,
            cursor: {
              id: cursor as string,
            },
            include: {
              member: {
                include: {
                  profile: true,
                },
              },
            },
            orderBy: {
              upvotes: "desc",
            },
          },
        },
      });

      for (let i = 0; i < communities.length; i++) {
        posts.push(communities[i].posts);
      }
    } else {
      communities = await db.community.findMany({
        where: {
          members: {
            some: {
              profileId: profile.id,
            },
          },
        },
        include: {
          posts: {
            take: POSTS_BATCH,
            include: {
              member: {
                include: {
                  profile: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      for (let i = 0; i < communities.length; i++) {
        for (let j = 0; j < communities[i].posts.length; j++) {
          posts.push(communities[i].posts[j]);
        }
      }
    }

    let nextCursor = null;

    // If we haven't reached the end of posts
    if (posts.length === POSTS_BATCH) nextCursor = posts[POSTS_BATCH - 1].id;

    return NextResponse.json({ posts, communities, nextCursor });
  } catch (error) {
    console.log("POST_GET", error);
  }
}
