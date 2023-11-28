import { getCurrentProfileSocket } from "@/lib/current-profile-socket";
import { db } from "@/lib/db";
import { NextApiResponseSocket } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseSocket) {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed" });

  try {
    const profile = await getCurrentProfileSocket(req);
    if (!profile) return res.status(401).json({ message: "Unauthorized" });

    const { type, postId } = req.body;

    if (type !== "upvote" && type !== "downvote") return res.status(400).json({ message: "Type incorrect" });
    if (!postId) return res.status(404).json({ message: "Post id not found" });

    let post = null;
    post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        upvotes: true,
        downvotes: true,
      },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const postProfileUpvote = await db.postProfileUpvotes.findUnique({
      where: {
        profileId: profile.id,
        postId,
      },
    });

    const postProfileDownvote = await db.postProfileDownvotes.findUnique({
      where: {
        profileId: profile.id,
        postId,
      },
    });

    const hasBeenUpvoted = post.upvotes.some((upvoteModel) => upvoteModel.id === postProfileUpvote?.id);
    const hasBeenDownvoted = post.downvotes.some((downvoteModel) => downvoteModel.id === postProfileDownvote?.id);

    if (type === "upvote") {
      if (!hasBeenUpvoted) {
        // Has not been upvoted by this person before (we want to add an upvote)
        if (hasBeenDownvoted) {
          res?.socket?.server?.io?.emit(`post:${postId}:vote:up`);
        }
        res?.socket?.server?.io?.emit(`post:${postId}:vote:up`);
      } else {
        // Has been upvoted by this person before (we want to remove an upvote)
        res?.socket?.server?.io?.emit(`post:${postId}:vote:down`);
      }
    } else if (type === "downvote") {
      if (!hasBeenDownvoted) {
        // Has not been downvoted by this person before (we want to add an downvote)
        if (hasBeenUpvoted) {
          res?.socket?.server?.io?.emit(`post:${postId}:vote:down`);
        }
        res?.socket?.server?.io?.emit(`post:${postId}:vote:down`);
      } else {
        // Has been downvoted by this person before (we want to remove an downvote)
        res?.socket?.server?.io?.emit(`post:${postId}:vote:up`);
      }
    }

    if (type === "upvote") {
      if (!hasBeenUpvoted) {
        // Has not been upvoted by this person before (we want to add an upvote)
        if (hasBeenDownvoted) {
          post = await db.post.update({
            where: {
              id: postId,
            },
            data: {
              downvotes: {
                delete: [{ profileId: profile.id }],
              },
            },
            include: {
              upvotes: true,
              downvotes: true,
            },
          });
        }
        post = await db.post.update({
          where: {
            id: postId,
          },
          data: {
            upvotes: {
              create: [{ profileId: profile.id }],
            },
          },
          include: {
            upvotes: true,
            downvotes: true,
          },
        });
      } else {
        // Has been upvoted by this person before (we want to remove an upvote)
        post = await db.post.update({
          where: {
            id: postId,
          },
          data: {
            upvotes: {
              delete: [{ id: postProfileUpvote!.id }],
            },
          },
          include: {
            upvotes: true,
            downvotes: true,
          },
        });
      }
    } else if (type === "downvote") {
      if (!hasBeenDownvoted) {
        // Has not been downvoted by this person before (we want to add a downvote)
        if (hasBeenUpvoted) {
          post = await db.post.update({
            where: {
              id: postId,
            },
            data: {
              upvotes: {
                delete: [{ profileId: profile.id }],
              },
            },
            include: {
              upvotes: true,
              downvotes: true,
            },
          });
        }
        post = await db.post.update({
          where: {
            id: postId,
          },
          data: {
            downvotes: {
              create: [{ profileId: profile.id }],
            },
          },
          include: {
            upvotes: true,
            downvotes: true,
          },
        });
      } else {
        // Has been downvoted by this person before (we want to remove a downvote)
        post = await db.post.update({
          where: {
            id: postId,
          },
          data: {
            downvotes: {
              delete: [{ id: postProfileDownvote!.id }],
            },
          },
          include: {
            upvotes: true,
            downvotes: true,
          },
        });
      }
    }

    return res.status(200).json({ message: "Vote added" });
  } catch (error) {
    console.log("POST_VOTE_PATCH", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
