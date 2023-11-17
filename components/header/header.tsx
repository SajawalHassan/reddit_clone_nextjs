"use client";

import { useRouter } from "next/navigation";
import { HeaderCommunities } from "./header-communities";
import { RedditLogo } from "@/components/reddit-logo";
import { HeaderSearch } from "./header-search";
import { MobileToggle } from "@/components/mobile-toggle";
import { HeaderIconButton } from "./header-icon-button";
import { Search } from "lucide-react";
import { HeaderProfile } from "./header-profile";

export const Header = () => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-[#1A1A1B] px-3 md:px-5 lg:px-10 flex items-center gap-x-2 md:gap-x-4">
      <MobileToggle />
      <RedditLogo onClick={() => router.push("/")} className="cursor-pointer" />
      <HeaderCommunities />
      <HeaderSearch className="hidden md:flex" />
      <div className="flex items-center justify-end flex-grow md:flex-none w-max">
        <HeaderIconButton onClick={() => router.push("/search")} Icon={Search} className="md:hidden" />
        <HeaderProfile />
      </div>
    </div>
  );
};
