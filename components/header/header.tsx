"use client";

import { useRouter } from "next/navigation";
import { HeaderCommunities } from "./header-communities";
import { RedditLogo } from "../reddit-logo";

export const Header = () => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-[#1A1A1B] px-10 flex items-center gap-x-4">
      <RedditLogo onClick={() => router.push("/")} className="cursor-pointer" />
      <HeaderCommunities />
    </div>
  );
};
