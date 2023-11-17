import { Community } from "@prisma/client";
import { ArrowDown, Home, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { HeaderCommunityOption } from "./header-community-option";
import { HeaderCommunitiesSearch } from "./header-communities-search";
import { RedditLogo } from "@/components/reddit-logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface ActivePlaceType {
  imageUrl: string | undefined;
  text: string | undefined;
}

export const HeaderCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>();
  const [allCommunities, setAllCommunities] = useState<Community[]>();
  const [activePlace, setActivePlace] = useState<ActivePlaceType>();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const params: any = useParams();

  useEffect(() => {
    if (params.communityId) {
      const activeCommunity = allCommunities?.filter((community: Community) => community.id == params.communityId)[0];

      setActivePlace({ imageUrl: activeCommunity?.imageUrl, text: activeCommunity?.uniqueName });
    } else {
      setActivePlace({ imageUrl: undefined, text: undefined });
    }
  }, [allCommunities, params.communityId]);

  const getCommunities = async () => {
    const res = await axios.get("/api/communities");
    setCommunities(res.data);
    setAllCommunities(res.data);
  };

  const handleOpenMenu = () => {
    setMenuIsOpen(true);

    getCommunities();
  };

  return (
    <div className="relative flex-grow max-w-[20rem]">
      <div
        onClick={handleOpenMenu}
        className={cn(
          "flex items-center flex-grow justify-between p-2 border-[0.5px] border-transparent hover:border-zinc-200 hover:dark:border-zinc-800 cursor-pointer",
          menuIsOpen && "border-zinc-200 dark:border-zinc-800 border-b-0"
        )}>
        <div className="flex items-center gap-x-2">
          {!activePlace?.imageUrl || !activePlace?.text ? (
            <>
              <Home className="text-black dark:text-white" />
              <p className="text-sm font-bold">Home</p>
            </>
          ) : (
            <>
              <img src={activePlace.imageUrl} alt="Active place" className="rounded-full h-6 w-6" />
              <p className="text-sm font-bold">{activePlace.text}</p>
            </>
          )}
        </div>
        <ArrowDown />
      </div>
      {menuIsOpen && <div className="fixed inset-0 z-30 h-full w-full" onClick={() => setMenuIsOpen(false)} />}
      {menuIsOpen && (
        <div className="w-[20rem] py-2 px-0 mr-5 sm:mr-0 space-y-3 bg-white dark:bg-[#1A1A1B] dark:text-white absolute border border-zinc-200 dark:border-zinc-800 border-t-0">
          <div>
            <div className="flex flex-col items-center mx-5">
              <HeaderCommunitiesSearch setCommunities={setCommunities} allCommunities={allCommunities} />
            </div>
          </div>
          <div>
            <p className="uppercase text-[10px] font-bold text-zinc-500 px-3 pb-2">Your communities</p>
            <HeaderCommunityOption setMenuIsOpen={setMenuIsOpen} type="modalOpener" modalType="createCommunity" Icon={Plus} text="Create Community" />
            <ScrollArea className="max-h-[20rem] overflow-scroll">
              {communities?.map((community) => (
                <HeaderCommunityOption
                  setMenuIsOpen={setMenuIsOpen}
                  type="communityLink"
                  communityId={community.id}
                  text={community.uniqueName}
                  imageUrl={community.imageUrl}
                  key={community.id}
                />
              ))}
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};
