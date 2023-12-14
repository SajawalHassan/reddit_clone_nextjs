import { PostClient } from "@/components/post/post-client";
import { PostRenderer } from "@/components/post/post-renderer";

export default function PostIdPage({ params: { postId, communityId } }: { params: { postId: string; communityId: string } }) {
  return (
    <div>
      <PostClient postId={postId} />
      <PostRenderer postId={postId} communityId={communityId} />
    </div>
  );
}
