import { Community } from "@prisma/client";
import { ArrowDownCircle, Home, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { HeaderCommunitiesMenu } from "./header-communities-menu";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { usePathname } from "next/navigation";

const icon_map = {
  Home: <Home />,
  Plus: <Plus />,
};

export const HeaderCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>();
  const [allCommunities, setAllCommunities] = useState<Community[]>();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { headerActivePlace } = useGlobalInfo();

  const pathname = usePathname();

  const isOnUser = pathname.includes("users");
  const isOnCommunity = pathname.includes("communities");

  const getCommunities = async () => {
    const res = await axios.get("/api/communities");
    setCommunities(res.data);
    setAllCommunities(res.data);
  };

  useEffect(() => {
    setIsMounted(true);

    getCommunities();
  }, []);

  const handleOpenMenu = () => {
    setMenuIsOpen(true);

    getCommunities();
  };

  if (!isMounted) return;

  return (
    <div className="relative lg:flex-grow max-w-[20rem] w-max hidden md:flex md:flex-col">
      <div
        onClick={handleOpenMenu}
        className={cn(
          "flex items-center flex-grow gap-x-4 lg:gap-x-0 lg:justify-between p-2 border-[0.5px] border-transparent hover:border-zinc-200 hover:dark:border-zinc-800 cursor-pointer",
          menuIsOpen && "border-zinc-200 dark:border-zinc-800 border-b-0"
        )}>
        <div className="flex items-center gap-x-2">
          {headerActivePlace.icon ? (
            icon_map[headerActivePlace.icon as keyof typeof icon_map]
          ) : (
            <img src={headerActivePlace.imageUrl} alt="" className="rounded-full h-6 w-6" />
          )}
          <p className="hidden lg:flex text-sm font-bold">
            {isOnCommunity ? "r/" : isOnUser && "u/"}
            {headerActivePlace.text}
          </p>
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
