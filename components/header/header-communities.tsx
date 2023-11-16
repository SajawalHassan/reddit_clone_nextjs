import { Community } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowDown, Home, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { HeaderCommunityOption } from "./header-community-option";
import { HeaderCommunitiesSearch } from "./header-communities-search";
import { RedditLogo } from "@/components/reddit-logo";
import { ScrollArea } from "@/components/ui/scroll-area";

export const HeaderCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>();
  const [allCommunities, setAllCommunities] = useState<Community[]>();

  useEffect(() => {
    const getCommunities = async () => {
      const res = await axios.get("/api/communities");
      setCommunities(res.data);
      setAllCommunities(res.data);
    };

    getCommunities();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex-grow">
        <div className="flex items-center justify-between max-w-[20rem] p-2 border border-transparent hover:border-zinc-200 cursor-pointer">
          <div className="flex items-center gap-x-2">
            <Home className="text-black" />
            <p className="text-sm font-bold">Home</p>
          </div>
          <ArrowDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[20rem] py-2 px-0 mr-5 sm:mr-0 space-y-3">
        <div>
          <RedditLogo className="pl-5" />

          <div className="flex flex-col items-center mx-5">
            <HeaderCommunitiesSearch setCommunities={setCommunities} allCommunities={allCommunities} />
          </div>
        </div>
        <div>
          <p className="uppercase text-[10px] font-bold text-zinc-500 px-3 pb-2">Your communities</p>
          <HeaderCommunityOption type="modalOpener" modalType="createCommunity" Icon={Plus} text="Create Community" />
          <ScrollArea className="max-h-[20rem] overflow-scroll">
            {communities?.map((community) => (
              <HeaderCommunityOption type="communityLink" communityId={community.id} text={community.uniqueName} imageUrl={community.imageUrl} />
            ))}
          </ScrollArea>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
