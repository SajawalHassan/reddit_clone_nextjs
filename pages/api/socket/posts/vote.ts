import { getCurrentProfile } from "@/lib/current-profile";
import { getCurrentProfileSocket } from "@/lib/current-profile-socket";
import { db } from "@/lib/db";
import { NextApiResponseSocket } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseSocket) {
  if (req.method !== "PATCH" && req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    let postId = "";
    const { type } = req.body;
    if (req.method === "PATCH") {
      postId = req.body.postId;
    } else if (req.method === "GET") {
      postId = req.query.postId as string;
    }

    if (!postId) return res.status(404).json({ message: "Post id not found" });
    if (req.method === "PATCH") {
      if (type !== "upvote" && type !== "downvote") return res.status(400).json({ message: "Type incorrect" });
    }

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        upvotes: true,
        downvotes: true,
      },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const wantsToUpvote = type === "upvote";
    const wantsToDownvote = type === "downvote";

    const hasUpvotedPost = post.upvotes.some((upvote) => upvote.postId === postId);
    const hasDownvotedPost = post.downvotes.some((downvote) => downvote.postId === postId);

    if (req.method === "GET") {
      return res.status(200).json({ hasUpvotedPost, hasDownvotedPost });
    }

    const upvoteKey = `post:${postId}:vote:up`;
    const downvoteKey = `post:${postId}:vote:down`;

    if (wantsToUpvote) {
      if (hasUpvotedPost) {
        res?.socket?.server?.io?.emit(downvoteKey, { num: 1, setDownvoteActive: false, setUpvoteActive: false });
      } else {
        if (hasDownvotedPost) {
          res?.socket?.server?.io?.emit(upvoteKey, { num: 2, setDownvoteActive: false, setUpvoteActive: true });
        } else {
          res?.socket?.server?.io?.emit(upvoteKey, { num: 1, setDownvoteActive: false, setUpvoteActive: true });
        }
      }
    }

    if (wantsToDownvote) {
      if (hasDownvotedPost) {
        res?.socket?.server?.io?.emit(upvoteKey, { num: 1, setDownvoteActive: false, setUpvoteActive: false });
      } else {
        if (hasUpvotedPost) {
          res?.socket?.server?.io?.emit(downvoteKey, { num: 2, setDownvoteActive: true, setUpvoteActive: false });
        } else {
          res?.socket?.server?.io?.emit(downvoteKey, { num: 2, setDownvoteActive: true, setUpvoteActive: false });
        }
      }
    }

    const profile = await getCurrentProfileSocket(req);
    if (!profile) return res.status(401).json({ message: "Unauthorized" });

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

    return res.status(200).json({ message: "Vote added" });
  } catch (error) {
    console.log("POST_SOCKET_VOTE_PATCH", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
