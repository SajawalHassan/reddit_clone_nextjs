import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);

    const postId = searchParams.get("postId");
    if (!postId) return new NextResponse("Post id missing", { status: 400 });

    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
        upvotes: true,
        downvotes: true,
        post: true,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.log("POSTS_COMMENTS_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const values = await req.json();
    const { content, postId, memberId } = values;

    if (!postId) return new NextResponse("No post id", { status: 400 });
    if (!memberId) return new NextResponse("No member id", { status: 400 });
    if (!content) return new NextResponse("No content", { status: 400 });

    const comment = await db.comment.create({
      data: {
        postId,
        memberId,
        content,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
        upvotes: true,
        downvotes: true,
        post: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.log("POSTS_COMMENTS_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
