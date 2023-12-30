import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommentWithMemberWithProfileWithVotesWithPost, PostWithMemberWithProfileWithCommunityWithVotes } from "@/types";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { IconButton } from "@/components/icon-button";
import { Image, Loader2, Trash, Tv } from "lucide-react";
import { uploadFile } from "@/components/file-uploader";
import { useModal } from "@/hooks/use-modal-store";
import { useCommunityInfo } from "@/hooks/use-community-info";

interface Props {
  setComments: React.Dispatch<React.SetStateAction<CommentWithMemberWithProfileWithVotesWithPost[]>>;
  post: PostWithMemberWithProfileWithCommunityWithVotes;
  parentCommentId?: string;
  type: "comment" | "reply" | "custom";
  className?: string;
  closeInput?: () => void;
  onSubmit?: (e: FormEvent, newComment: string, newImage: string) => void;
  prePropulatedContent?: string;
  prePropulatedImageUrl?: string;
  disabled?: boolean;
  setEditedComment?: React.Dispatch<React.SetStateAction<string>>;
  memberId?: string;
}

export const PostCommentInput = ({
  setComments,
  post,
  type,
  parentCommentId,
  className,
  closeInput,
  onSubmit,
  disabled,
  setEditedComment,
  prePropulatedContent = "",
  prePropulatedImageUrl = "",
  memberId,
}: Props) => {
  const [comment, setComment] = useState(prePropulatedContent);
  const [image, setImage] = useState(prePropulatedImageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingImage, setIsSubmittingImage] = useState(false);

  const imageUploadRef = useRef<any>(null);
  const gifUploadRef = useRef<any>(null);

  const { openModal } = useModal();
  const { currentMember } = useCommunityInfo();

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEditedComment && setEditedComment(comment);

    if (onSubmit) return onSubmit(e, comment, image);
    if (!currentMember)
      return openModal("joinCommunity", {
        joinCommunityText: `In order to comment on this post you must be a member of r/${post.community.uniqueName}.`,
      });

    try {
      setIsLoading(true);

      if (type === "comment") {
        var res = await axios.post("/api/posts/comments", {
          content: comment,
          postId: post.id,
          memberId: memberId || currentMember.id,
          imageUrl: image,
        });
      } else {
        var res = await axios.post("/api/posts/comments", {
          content: comment,
          imageUrl: image,
          postId: post.id,
          memberId: memberId || currentMember.id,
          parentId: parentCommentId,
        });
      }

      setComments((comments) => [res.data, ...comments]);
      setComment("");
      setImage("");
      closeInput && closeInput();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFileJSX = (e: ChangeEvent) => {
    setComment("");

    const file = (e.target as HTMLInputElement).files![0];
    if (!file) return;

    uploadFile(file, setIsSubmittingImage, (url) => {
      setImage(url);
      setIsSubmittingImage(false);
    });
  };

  return (
    <form onSubmit={handleOnSubmit} className={cn("flex items-center gap-x-1 w-full", className)}>
      <div className="bg-white dark:bg-[#1A1A1B] border dark:border-[#3c3c3d] rounded-sm pt-2 w-full focus-within:border-black">
        {isSubmittingImage && (
          <div className="flex items-center justify-center h-[5rem]">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {image ? (
          <div className="mx-4">
            <IconButton Icon={Trash} content="Remove image" className="mb-1" onClick={() => setImage("")} />
            <img src={image} alt="upload" />
          </div>
        ) : (
          !isSubmittingImage && (
            <TextareaAutosize
              className="bg-transparent w-full resize-none outline-none px-2 pt-0.5 disabled:text-gray-500"
              placeholder={!image ? "What are your thoughts?" : ""}
              minRows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              autoFocus={true}
              disabled={isLoading || disabled}
            />
          )
        )}
        <div className="flex items-center justify-between bg-[#F6F7F8] dark:bg-[#272729] p-2">
          <div className="flex items-center gap-x-1.5">
            <IconButton
              Icon={Tv}
              className="p-1 dark:hover:bg-zinc-700 group"
              IconClassName="h-5 w-5 dark:group-hover:text-zinc-400 dark:text-zinc-500"
              content="Gif"
              onClick={() => gifUploadRef?.current?.click()}
            />
            <IconButton
              Icon={Image}
              className="p-1 dark:hover:bg-zinc-700 group"
              IconClassName="h-5 w-5 dark:group-hover:text-zinc-400 dark:text-zinc-500"
              content="Image"
              onClick={() => imageUploadRef?.current?.click()}
            />
          </div>
          <div className="flex items-center gap-x-2">
            {type === "reply" && (
              <Button variant="secondary" className="h-7" disabled={isLoading || disabled} type="button" onClick={closeInput!}>
                Cancel
              </Button>
            )}
            {type === "custom" && (
              <Button variant="secondary" className="h-7" disabled={isLoading || disabled} type="button" onClick={closeInput!}>
                Cancel
              </Button>
            )}
            <Button variant="primary" className="disabled:bg-zinc-700 h-7" disabled={(comment.length === 0 && !image) || isLoading || disabled}>
              Comment
            </Button>
          </div>
        </div>
      </div>
      <input type="file" ref={imageUploadRef} onChange={(e) => uploadFileJSX(e)} className="hidden" accept="image/*" />
      <input type="file" ref={gifUploadRef} onChange={(e) => uploadFileJSX(e)} className="hidden" accept=".gif,.webp" />
    </form>
  );
};
