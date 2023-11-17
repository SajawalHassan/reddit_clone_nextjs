"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { HeaderCommunitiesSearch } from "./header-communities-search";
import { HeaderCommunityOption } from "./header-community-option";
import { Community } from "@prisma/client";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

interface Props {
  setCommunities: Dispatch<SetStateAction<Community[] | undefined>>;
  setMenuIsOpen?: Dispatch<SetStateAction<boolean>>;
  allCommunities: Community[] | undefined;
  communities: Community[] | undefined;
  type: "menu" | "sheet";
}

export const HeaderCommunitiesMenu = ({ setCommunities, allCommunities, communities, setMenuIsOpen, type }: Props) => {
  return (
    <div
      className={cn(
        "w-full py-2 px-0 mr-5 sm:mr-0 space-y-3 bg-white dark:bg-[#1A1A1B] dark:text-white border border-zinc-200 dark:border-zinc-800 border-t-0 z-30",
        type === "menu" ? "absolute top-9" : "mt-10 border-none"
      )}>
      <p className="md:hidden text-sm font-bold mx-5">Your communities</p>
      <div className="flex flex-col items-center mx-5">
        <HeaderCommunitiesSearch setCommunities={setCommunities} allCommunities={allCommunities} />
      </div>
      <div>
        {type === "menu" && <p className="uppercase text-[10px] font-bold text-zinc-500 px-3 pb-2">Your communities</p>}
        <HeaderCommunityOption
          setMenuIsOpen={type === "menu" ? setMenuIsOpen : undefined}
          type="modalOpener"
          modalType="createCommunity"
          Icon={Plus}
          text="Create Community"
        />
        <div className="max-h-[20rem] overflow-scroll">
          {communities?.map((community: Community) => (
            <HeaderCommunityOption
              setMenuIsOpen={type === "menu" ? setMenuIsOpen : undefined}
              type="communityLink"
              communityId={community.id}
              text={community.uniqueName}
              imageUrl={community.imageUrl}
              key={community.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
