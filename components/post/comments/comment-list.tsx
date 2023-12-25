import { CommentWithMemberWithProfileWithVotesWithPost } from "@/types";
import { Comment } from "./comment";

interface Props {
  comments: CommentWithMemberWithProfileWithVotesWithPost[];
  getReplies: (parentId: string) => any;
  setComments: React.Dispatch<React.SetStateAction<CommentWithMemberWithProfileWithVotesWithPost[]>>;
  max?: number;
  showReplies?: boolean;
}

export const CommentList = ({ comments, getReplies, setComments, max, showReplies = true }: Props) => {
  return comments
    ?.slice(0, max)
    .map((comment) => <Comment comment={comment} getReplies={getReplies} setComments={setComments} showReplies={showReplies} key={comment.id} />);
};
