"use client";

import { useRouter } from "next/navigation";
import { HeaderCommunities } from "./header-communities";
import { RedditLogo } from "@/components/reddit-logo";
import { HeaderSearch } from "./header-search";
import { MobileToggle } from "../mobile-toggle";
import { HeaderIconButton } from "./header-icon-button";
import { Search } from "lucide-react";

export const Header = () => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-[#1A1A1B] px-3 md:px-10 flex items-center gap-x-2 md:gap-x-4">
      <MobileToggle />
      <RedditLogo onClick={() => router.push("/")} className="cursor-pointer" />
      <HeaderCommunities />
      <HeaderSearch className="hidden md:flex" />
      <div className="flex items-center flex-grow justify-end">
        <HeaderIconButton onClick={() => router.push("/search")} Icon={Search} className="md:hidden" />
      </div>
    </div>
  );
};
