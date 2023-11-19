"use client";

import { Community } from "@prisma/client";
import { ArrowDownCircle, CircleDashed, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { CommunitiesSelectionSearch } from "@/components/communities-selection-menu/communities-search";
import { CommunitySelectionOption } from "@/components/communities-selection-menu/community-option";
import axios from "axios";
import { cn } from "@/lib/utils";

export const CommunitySelecter = () => {
  const [activeCommunity, setActiveCommunity] = useState<Community>();
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>();
  const [allCommunities, setAllCommunities] = useState<Community[]>();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const getCommunities = async () => {
    const res = await axios.get("/api/communities");
    setFilteredCommunities(res.data);
    setAllCommunities(res.data);
  };

  useEffect(() => {
    getCommunities();
  }, []);

  const handleOpenMenu = () => {
    setMenuIsOpen(true);

    getCommunities();
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center justify-between flex-grow bg-white w-full p-2 max-w-[20rem] cursor-pointer",
          menuIsOpen ? "rounded-none" : "rounded-md"
        )}
        onClick={handleOpenMenu}>
        {activeCommunity ? (
          <div className="flex items-center gap-x-2">
            <img src={activeCommunity?.imageUrl} alt={activeCommunity?.name} className="h-7 w-7 rounded-full" />
            <p className="font-semibold text-gray-700">{activeCommunity?.uniqueName}</p>
          </div>
        ) : (
          <div className="flex items-center gap-x-2 text-gray-500">
            <CircleDashed className="h-6 w-6" />
            <p className="font-semibold">Choose a community</p>
          </div>
        )}
        <ArrowDownCircle className="h-5 w-5 text-gray-500" />
      </div>

      {menuIsOpen && <div className="z-20 fixed inset-0 h-full w-full" onClick={() => setMenuIsOpen(false)} />}
      {menuIsOpen && (
        <div className="absolute w-full py-2 space-y-3 bg-white dark:bg-[#1A1A1B] dark:text-white border-zinc-200 dark:border-zinc-800 z-30">
          <div className="flex flex-col items-center mx-5">
            <CommunitiesSelectionSearch setCommunities={setFilteredCommunities} allCommunities={allCommunities} />
          </div>
          <div>
            <p className="uppercase text-[10px] font-bold text-zinc-500 px-3 pb-2">Your communities</p>
            <CommunitySelectionOption
              setMenuIsOpen={setMenuIsOpen}
              type="modalOpener"
              modalType="createCommunity"
              Icon={Plus}
              text="Create Community"
            />
            <div className="max-h-[20rem] overflow-scroll">
              {filteredCommunities?.map((community: Community) => (
                <CommunitySelectionOption
                  setMenuIsOpen={setMenuIsOpen}
                  type="communityLink"
                  communityId={community.id}
                  text={community.uniqueName}
                  imageUrl={community.imageUrl}
                  customOnClick={() => setActiveCommunity(community)}
                  key={community.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
