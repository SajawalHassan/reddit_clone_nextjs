import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const postsIdArray = JSON.parse(searchParams.get("postsIdArray") || "[]");

    const posts = await db.post.findMany({
      where: {
        id: {
          in: postsIdArray,
        },
      },
      include: {
        comments: true,
        community: true,
      },
    });

    const orderedPosts = postsIdArray.map((id: string) => posts.find((post) => post.id === id));

    return NextResponse.json(orderedPosts);
  } catch (error) {
    console.log("POSTS_ARRAY_GET", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
