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
const INITIAL_COMMUNITIES = 10;

export async function GET(req: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    const joinedCommunities = await db.community.findMany({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        posts: true,
      },
    });

    // Shuffle communities using fisher-yates algorithm
    const communityIndicies = Array.from({ length: joinedCommunities.length }, (_, i) => i);

    for (let lastIndex = communityIndicies.length - 1; lastIndex > 0; lastIndex--) {
      if (communityIndicies[lastIndex] === undefined) continue;

      const randNum = Math.floor(Math.random() * (lastIndex + 1)) as number;
      [communityIndicies[lastIndex], communityIndicies[randNum]] = [communityIndicies[randNum], communityIndicies[lastIndex]];
    }
    const shuffledCommunities = communityIndicies.map((i) => joinedCommunities[i]);

    // Calculate how many posts to get from each joined community to in total sum up to POSTS_BATCH var
    const postsToGet: number[] = [];

    let remainingPosts = POSTS_BATCH;
    for (let i = 0; i < joinedCommunities.length; i++) {
      if (i > INITIAL_COMMUNITIES) break;

      const communityPosts = joinedCommunities[i].posts.length;
      if (communityPosts < remainingPosts) {
        postsToGet.push(communityPosts);
        remainingPosts -= communityPosts;
      } else {
        // If there aren't enough posts in community as there should be, described by the postsToGet array
        postsToGet.push(remainingPosts);
        remainingPosts = 0;
        break;
      }
    }
    if (remainingPosts > 0) postsToGet[0] += remainingPosts;

    let posts: any[] = [];
    if (cursor) {
      for (let i = 0; i < shuffledCommunities.length; i++) {
        if (i > INITIAL_COMMUNITIES) break;

        const foundPosts = await db.post.findMany({
          take: postsToGet[i],
          skip: 1,
          cursor: {
            id: cursor,
          },
          where: {
            communityId: shuffledCommunities[i].id,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
            community: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        posts.push(...foundPosts);
      }
    } else {
      for (let i = 0; i < shuffledCommunities.length; i++) {
        if (i > INITIAL_COMMUNITIES) break;

        const foundPosts = await db.post.findMany({
          take: postsToGet[i],
          where: {
            communityId: shuffledCommunities[i].id,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
            community: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        posts.push(...foundPosts);
      }
    }

    // Shuffle the posts
    const indicies = Array.from({ length: posts.length }, (_, i) => i);

    for (let lastIndex = indicies.length - 1; lastIndex > 0; lastIndex--) {
      if (indicies[lastIndex] === undefined) continue;

      const randNum = Math.floor(Math.random() * (lastIndex + 1)) as number;
      [indicies[lastIndex], indicies[randNum]] = [indicies[randNum], indicies[lastIndex]];
    }
    const shuffledPosts = indicies.map((i) => posts[i]);

    let nextCursor = posts[POSTS_BATCH - 1]?.id;

    // Return the unshuffled posts for react-query and return the shuffled posts for the feed
    return NextResponse.json({ items: posts, feedItems: shuffledPosts, nextCursor });
  } catch (error) {
    console.log("POST_GET", error);
  }
}
