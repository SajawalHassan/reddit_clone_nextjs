import { Community } from "@prisma/client";
import { ArrowDownCircle, Home } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { HeaderCommunitiesMenu } from "./header-communities-menu";

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

  const getCommunities = async () => {
    const res = await axios.get("/api/communities");
    setCommunities(res.data);
    setAllCommunities(res.data);
  };

  useEffect(() => {
    if (params.communityId) {
      const activeCommunity = allCommunities?.filter((community: Community) => community.id == params.communityId)[0];

      setActivePlace({ imageUrl: activeCommunity?.imageUrl, text: activeCommunity?.uniqueName });
    } else {
      setActivePlace({ imageUrl: undefined, text: undefined });
    }
  }, [allCommunities, params.communityId]);

  useEffect(() => {
    getCommunities();
  }, []);

  const handleOpenMenu = () => {
    setMenuIsOpen(true);

    getCommunities();
  };

  return (
    <div className="relative lg:flex-grow max-w-[20rem] w-max hidden md:flex md:flex-col">
      <div
        onClick={handleOpenMenu}
        className={cn(
          "flex items-center flex-grow gap-x-4 lg:gap-x-0 lg:justify-between p-2 border-[0.5px] border-transparent hover:border-zinc-200 hover:dark:border-zinc-800 cursor-pointer",
          menuIsOpen && "border-zinc-200 dark:border-zinc-800 border-b-0"
        )}>
        <div className="flex items-center gap-x-2">
          {!activePlace?.imageUrl || !activePlace?.text ? (
            <>
              <Home className="text-black dark:text-white" />
              <p className="hidden lg:flex text-sm font-bold">Home</p>
            </>
          ) : (
            <>
              <img src={activePlace.imageUrl} alt="Active place" className="rounded-full h-6 w-6" />
              <p className="hidden lg:flex text-sm font-bold">{activePlace.text}</p>
            </>
          )}
        </div>
        <ArrowDownCircle className="h-5 w-5" />
      </div>
      {menuIsOpen && <div className="fixed inset-0 z-20 h-full w-full" onClick={() => setMenuIsOpen(false)} />}
      {menuIsOpen && (
        <HeaderCommunitiesMenu
          allCommunities={allCommunities}
          communities={communities}
          setCommunities={setCommunities}
          setMenuIsOpen={setMenuIsOpen}
          type="menu"
        />
      )}
    </div>
  );
};
