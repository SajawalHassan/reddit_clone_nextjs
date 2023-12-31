import { useCommunityInfo } from "@/hooks/use-community-info";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { ModalTypes, useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Props {
  text: string;
  type: "modalOpener" | "communityLink";
  modalType?: ModalTypes;
  Icon?: LucideIcon;
  communityId?: string;
  imageUrl?: string;
  setMenuIsOpen?: Dispatch<SetStateAction<boolean>>;
  customOnClick?: () => void;
}

export const CommunitySelectionOption = ({ Icon, text, type, modalType, communityId, imageUrl, setMenuIsOpen, customOnClick }: Props) => {
  const { openModal } = useModal();
  const { setHeaderActivePlace } = useGlobalInfo();
  const { setCommunity } = useCommunityInfo();
  const queryClient = useQueryClient();

  const router = useRouter();

  const handleOnClick = () => {
    if (type === "modalOpener") {
      openModal(modalType as ModalTypes, {});
      setMenuIsOpen && setMenuIsOpen(false);
      return;
    }

    queryClient.setQueryData([`feed:community:${communityId}`], []);
    setHeaderActivePlace({ text, imageUrl });

    router.push(`/main/communities/${communityId}`);
    setCommunity(null);
    setMenuIsOpen && setMenuIsOpen(false);
  };

  const handleCustomOnClick = () => {
    customOnClick!();
    setMenuIsOpen!(false);
  };

  useEffect(() => {
    if (communityId) router.prefetch(`/main/communities/${communityId}`);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer",
        type === "modalOpener" ? "gap-x-1" : "gap-x-1.5",
        !setMenuIsOpen ? "pl-5 pr-2" : "px-2"
      )}
      onClick={customOnClick ? handleCustomOnClick : handleOnClick}>
      {Icon && <Icon className="h-6 w-6" />}
      {imageUrl && <img loading="lazy" src={imageUrl} alt="Community" className="h-6 w-6 rounded-full" />}
      <p className={cn("text-zinc-800 dark:text-gray-200", type === "modalOpener" ? "text-[15px]" : "text-[14px] leading-[18px]")}>
        {type === "modalOpener" ? text : `r/${text}`}
      </p>
    </div>
  );
};
