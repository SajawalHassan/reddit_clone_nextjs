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
    const { type, commentId } = values;

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!commentId) return new NextResponse("Comment id not found", { status: 404 });
    if (type !== "upvote" && type !== "downvote") return new NextResponse("Type incorrect", { status: 400 });

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        upvotes: true,
        downvotes: true,
      },
    });

    if (!comment) return new NextResponse("Comment not found", { status: 404 });

    const wantsToUpvote = type === "upvote";
    const wantsToDownvote = type === "downvote";

    const hasUpvotedComment = comment.upvotes.some((upvote) => upvote.profileId === profile.id);
    const hasDownvotedComment = comment.downvotes.some((downvote) => downvote.profileId === profile.id);

    const voteInfo: voteInfoInterface = { voteType: "upvote", amount: 1, activeVote: "upvote" };

    if (wantsToUpvote) {
      if (hasUpvotedComment) {
        voteInfo["amount"] = 1;
        voteInfo["voteType"] = "downvote";
        voteInfo["activeVote"] = "none";

        await db.comment.update({
          where: {
            id: commentId,
          },
          data: {
            upvotes: {
              delete: { commentId, profileId: profile.id },
            },
          },
        });
      } else {
        if (hasDownvotedComment) {
          voteInfo["amount"] = 2;
          voteInfo["voteType"] = "upvote";
          voteInfo["activeVote"] = "upvote";

          await db.comment.update({
            where: {
              id: commentId,
            },
            data: {
              downvotes: {
                delete: [{ commentId, profileId: profile.id }],
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

          await db.comment.update({
            where: {
              id: commentId,
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
      if (hasDownvotedComment) {
        voteInfo["amount"] = 1;
        voteInfo["voteType"] = "upvote";
        voteInfo["activeVote"] = "none";

        await db.comment.update({
          where: {
            id: commentId,
          },
          data: {
            downvotes: {
              delete: [{ commentId, profileId: profile.id }],
            },
          },
        });
      } else {
        if (hasUpvotedComment) {
          voteInfo["amount"] = 2;
          voteInfo["voteType"] = "downvote";
          voteInfo["activeVote"] = "downvote";

          await db.comment.update({
            where: {
              id: commentId,
            },
            data: {
              upvotes: {
                delete: [{ commentId, profileId: profile.id }],
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

          await db.comment.update({
            where: {
              id: commentId,
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
    console.log("POSTS_COMMENTS_PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
