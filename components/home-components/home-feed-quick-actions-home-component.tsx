"use client";

import { Separator } from "@/components/ui/seperator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

export const HomeFeedQuickActionsHomeComponent = () => {
  const { openModal } = useModal();

  const router = useRouter();
  return (
    <div className="home-component p-0 w-[20rem] pb-5">
      <div className="relative">
        <img src="https://www.redditstatic.com/desktop2x/img/id-cards/home-banner@2x.png" alt="Reddit home banner" />
        <div className="flex">
          <img src="https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png" alt="Snoo Home" className="absolute left-5 top-3 h-20" />
          <p className="font-semibold ml-[5rem] mt-4">Home</p>
        </div>
      </div>
      <div className="px-4 mt-7 space-y-4">
        <p className="text-[14px]">Your personal Reddit frontpage. Come here to check in with your favorite communities.</p>
        <Separator />
        <div className="flex flex-col space-y-3">
          <Button onClick={() => router.push("/main/create/post?plain=true")} variant="primary">
            Create Post
          </Button>
          <Button onClick={() => openModal("createCommunity", {})} variant="secondary">
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};
