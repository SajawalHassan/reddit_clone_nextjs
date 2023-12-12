import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, res: NextResponse) {
  try {
    const profile = await getCurrentProfile();

    const values = await req.json();
    const { type, postId } = values;

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!postId) return new NextResponse("Post id not found", { status: 404 });
    if (type !== "upvote" && type !== "downvote") return new NextResponse("Type incorrect", { status: 400 });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        upvotes: true,
        downvotes: true,
      },
    });

    if (!post) return new NextResponse("Post not found", { status: 404 });

    const wantsToUpvote = type === "upvote";
    const wantsToDownvote = type === "downvote";

    const hasUpvotedPost = post.upvotes.some((upvote) => upvote.profileId === profile.id);
    const hasDownvotedPost = post.downvotes.some((downvote) => downvote.profileId === profile.id);

    if (wantsToUpvote) {
      if (hasUpvotedPost) {
        await db.post.update({
          where: {
            id: postId,
          },
          data: {
            upvotes: {
              delete: { postId },
            },
          },
        });
      } else {
        if (hasDownvotedPost) {
          await db.post.update({
            where: {
              id: postId,
            },
            data: {
              downvotes: {
                delete: [{ postId }],
              },
              upvotes: {
                create: [{ profileId: profile.id }],
              },
            },
          });
        } else {
          await db.post.update({
            where: {
              id: postId,
            },
            data: {
              upvotes: {
                create: [{ profileId: profile.id }],
              },
            },
          });
        }
      }
    }

    if (wantsToDownvote) {
      if (hasDownvotedPost) {
        await db.post.update({
          where: {
            id: postId,
          },
          data: {
            downvotes: {
              delete: { postId },
            },
          },
        });
      } else {
        if (hasUpvotedPost) {
          await db.post.update({
            where: {
              id: postId,
            },
            data: {
              upvotes: {
                delete: [{ postId }],
              },
              downvotes: {
                create: [{ profileId: profile.id }],
              },
            },
          });
        } else {
          await db.post.update({
            where: {
              id: postId,
            },
            data: {
              downvotes: {
                create: [{ profileId: profile.id }],
              },
            },
          });
        }
      }
    }

    return NextResponse.json("Vote added");
  } catch (error) {
    console.log("POST_VOTE_PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
