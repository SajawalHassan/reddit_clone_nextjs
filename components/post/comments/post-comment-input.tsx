import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CommentWithMemberWithProfileWithVotesWithPost, PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import axios from "axios";
import { FormEvent, useState } from "react";

interface Props {
  setComments: React.Dispatch<React.SetStateAction<CommentWithMemberWithProfileWithVotesWithPost[]>>;
  post: PostWithMemberWithProfileWithCommunityWithVotes;
  parentCommentId?: string;
  type: "comment" | "reply";
  className?: string;
  closeInput?: () => void;
}

export const PostCommentInput = ({ setComments, post, type, parentCommentId, className, closeInput }: Props) => {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!post) return;

    try {
      setIsLoading(true);

      if (type === "comment") {
        var res = await axios.post("/api/posts/comments", { content: comment, postId: post.id, memberId: post.memberId });
      } else {
        var res = await axios.post("/api/posts/replies", { content: comment, postId: post.id, memberId: post.memberId, parentId: parentCommentId });
      }

      setComments((comments) => [...comments, res.data]);
      setComment("");
      closeInput && closeInput();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleOnSubmit} className={cn("flex items-center gap-x-1 w-full", className)}>
      <Input
        placeholder={type === "comment" ? "Enter a new comment" : "Enter a reply"}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isLoading}
        autoFocus={true}
      />
      <Button variant="primary" className="rounded-sm h-10 py-0" type="submit" disabled={isLoading}>
        {type === "comment" ? "Comment" : "Reply"}
      </Button>
      {type === "reply" && (
        <Button variant="secondary" className="rounded-sm h-10 py-0" type="submit" disabled={isLoading} onClick={closeInput!}>
          Cancel
        </Button>
      )}
    </form>
  );
};
