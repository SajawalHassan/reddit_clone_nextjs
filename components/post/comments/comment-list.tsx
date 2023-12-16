import { CommentWithMemberWithProfileWithVotesWithPost } from "@/types";
import { Comment } from "./comment";

export const CommentList = ({
  comments,
  getReplies,
  setComments,
}: {
  comments: CommentWithMemberWithProfileWithVotesWithPost[];
  getReplies: (parentId: string) => any;
  setComments: React.Dispatch<React.SetStateAction<CommentWithMemberWithProfileWithVotesWithPost[]>>;
}) => {
  return comments.map((comment) => <Comment comment={comment} getReplies={getReplies} setComments={setComments} key={comment.id} />);
};
