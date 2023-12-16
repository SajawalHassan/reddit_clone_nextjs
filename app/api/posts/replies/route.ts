import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const values = await req.json();
    const { content, postId, memberId, parentId } = values;

    if (!postId) return new NextResponse("No post id", { status: 400 });
    if (!memberId) return new NextResponse("No member id", { status: 400 });
    if (!content) return new NextResponse("No content", { status: 400 });
    if (!parentId) return new NextResponse("No content", { status: 400 });

    const reply = await db.comment.create({
      data: {
        postId,
        memberId,
        content,
        parentId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
        upvotes: true,
        downvotes: true,
      },
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.log("POSTS_COMMENTS_POST", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
