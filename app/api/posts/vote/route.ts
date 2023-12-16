import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface voteInfoInterface {
  voteType: "upvote" | "downvote";
  amount: number;
  activeVote: "upvote" | "downvote" | "none";
}

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

    const voteInfo: voteInfoInterface = { voteType: "upvote", amount: 1, activeVote: "upvote" };

    if (wantsToUpvote) {
      if (hasUpvotedPost) {
        voteInfo["amount"] = 1;
        voteInfo["voteType"] = "downvote";
        voteInfo["activeVote"] = "none";

        await db.post.update({
          where: {
            id: postId,
          },
          data: {
            upvotes: {
              delete: [{ postId, profileId: profile.id }],
            },
          },
        });
      } else {
        if (hasDownvotedPost) {
          voteInfo["amount"] = 2;
          voteInfo["voteType"] = "upvote";
          voteInfo["activeVote"] = "upvote";

          await db.post.update({
            where: {
              id: postId,
            },
            data: {
              downvotes: {
                delete: [{ postId, profileId: profile.id }],
              },
              upvotes: {
                create: [{ profileId: profile.id }],
              },
            },
          });
        } else {
          voteInfo["amount"] = 1;
          voteInfo["voteType"] = "upvote";
          voteInfo["activeVote"] = "upvote";

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
        voteInfo["amount"] = 1;
        voteInfo["voteType"] = "upvote";
        voteInfo["activeVote"] = "none";

        await db.post.update({
          where: {
            id: postId,
          },
          data: {
            downvotes: {
              delete: [{ postId, profileId: profile.id }],
            },
          },
        });
      } else {
        if (hasUpvotedPost) {
          voteInfo["amount"] = 2;
          voteInfo["voteType"] = "downvote";
          voteInfo["activeVote"] = "downvote";

          await db.post.update({
            where: {
              id: postId,
            },
            data: {
              upvotes: {
                delete: [{ postId, profileId: profile.id }],
              },
              downvotes: {
                create: [{ profileId: profile.id }],
              },
            },
          });
        } else {
          voteInfo["amount"] = 1;
          voteInfo["voteType"] = "downvote";
          voteInfo["activeVote"] = "downvote";

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

    return NextResponse.json(voteInfo);
  } catch (error) {
    console.log("POST_VOTE_PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
