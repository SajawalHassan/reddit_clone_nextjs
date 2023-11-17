"use client";

import { useRouter } from "next/navigation";
import { HeaderCommunities } from "./header-communities";
import { RedditLogo } from "@/components/reddit-logo";
import { HeaderSearch } from "./header-search";

export const Header = () => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-[#1A1A1B] px-10 flex items-center gap-x-4">
      <RedditLogo onClick={() => router.push("/")} className="cursor-pointer" />
      <HeaderCommunities />
      <HeaderSearch />
    </div>
  );
};
