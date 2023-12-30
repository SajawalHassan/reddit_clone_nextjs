"use client";

import RedditLogoSvg from "@/svgs/reddit-logo.svg";
import RedditLogoText from "@/svgs/reddit-logo-text.svg";
import RedditLogoTextDark from "@/svgs/reddit-logo-text-dark.svg";
import Image from "next/image";
import Link from "next/link";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useCommunityInfo } from "@/hooks/use-community-info";

interface Props {
  className?: string;
}

export const RedditLogo = ({ className }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const { resolvedTheme } = useTheme();
  const { setCommunity } = useCommunityInfo();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  return (
    <Link href={"/main"} className={cn("flex items-center gap-x-2 w-max", className)} onClick={() => setCommunity(null)}>
      <Image src={RedditLogoSvg} alt="Reddit Logo" className="h-[30px] w-[30px]" />
      {resolvedTheme === "dark" && <Image src={RedditLogoTextDark} alt="Reddit Logo Text" className="h-[60px] w-[60px]" />}
      {resolvedTheme === "light" && <Image src={RedditLogoText} alt="Reddit Logo Text" className="h-[60px] w-[60px]" />}
    </Link>
  );
};
