import { ModalTypes, useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  text: string;
  type: "modalOpener" | "communityLink";
  modalType?: ModalTypes;
  Icon?: LucideIcon;
  communityId?: string;
  imageUrl?: string;
}

export const HeaderCommunityOption = ({ Icon, text, type, modalType, communityId, imageUrl }: Props) => {
  const { openModal } = useModal();

  const router = useRouter();

  const handleOnClick = () => {
    if (type === "modalOpener") {
      return openModal(modalType as ModalTypes);
    }

    router.push(`communities/${communityId}`);
  };

  return (
    <div
      className={cn(
        "flex items-center px-2 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer",
        type === "modalOpener" ? "gap-x-1" : "gap-x-1.5"
      )}
      onClick={handleOnClick}>
      {Icon && <Icon className="h-6 w-6" />}
      {imageUrl && <img loading="lazy" src={imageUrl} alt="Community" className="h-6 w-6 rounded-full" />}
      <p className={cn("text-zinc-800 dark:text-gray-200", type === "modalOpener" ? "text-[15px]" : "text-[14px] leading-[18px]")}>
        {type === "modalOpener" ? text : `r/${text}`}
      </p>
    </div>
  );
};
