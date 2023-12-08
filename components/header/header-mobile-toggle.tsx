"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HeaderCommunitiesMenu } from "./header-communities-menu";
import { useEffect, useState } from "react";
import axios from "axios";
import { Community } from "@prisma/client";

export const HeaderMobileToggle = () => {
  const [communities, setCommunities] = useState<Community[]>();
  const [allCommunities, setAllCommunities] = useState<Community[]>();

  useEffect(() => {
    const getCommunities = async () => {
      const res = await axios.get("/api/communities");
      setCommunities(res.data);
      setAllCommunities(res.data);
    };
    setTimeout(() => getCommunities(), 1000);
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild className="p-1.5 cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 transition md:hidden">
        <Menu className="h-10 w-10" />
      </SheetTrigger>
      <SheetContent className="p-0 dark:bg-[#1A1A1B]" side="left">
        <HeaderCommunitiesMenu communities={communities} allCommunities={allCommunities} type="sheet" setCommunities={setCommunities} />
      </SheetContent>
    </Sheet>
  );
};
