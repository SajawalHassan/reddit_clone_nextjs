"use client";

import { useRouter } from "next/navigation";
import { HeaderCommunities } from "./header-communities";
import { RedditLogo } from "@/components/reddit-logo";
import { HeaderSearch } from "./header-search";
import { HeaderMobileToggle } from "@/components/header/header-mobile-toggle";
import { IconButton } from "@/components/icon-button";
import { Search } from "lucide-react";
import { HeaderProfile } from "./header-profile";

export const Header = () => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-[#1A1A1B] px-3 md:px-5 lg:px-10 flex items-center gap-x-2 md:gap-x-4 flex-initial fixed top-0 left-0 z-50 w-full h-[3rem]">
      <HeaderMobileToggle />
      <RedditLogo className="cursor-pointer" />
      <HeaderCommunities />
      <HeaderSearch className="hidden md:flex" />
      <div className="flex items-center justify-end flex-grow md:flex-none w-max">
        <IconButton onClick={() => router.push("/search")} Icon={Search} className="md:hidden" />
        <HeaderProfile />
      </div>
    </div>
  );
};
