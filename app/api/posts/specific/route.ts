import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) return new NextResponse("Post id not found", { status: 404 });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log("POST_SPECIFIC_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
