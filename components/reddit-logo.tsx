"use client";

import RedditLogoSvg from "@/svgs/reddit-logo.svg";
import RedditLogoText from "@/svgs/reddit-logo-text.svg";
import RedditLogoTextDark from "@/svgs/reddit-logo-text-dark.svg";
import Image from "next/image";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
  className?: string;
  onClick?: () => void;
}

export const RedditLogo = ({ className, onClick }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  return (
    <div className={cn("flex items-center gap-x-2 w-max", className)} onClick={onClick}>
      <Image src={RedditLogoSvg} alt="Reddit Logo" className="h-[30px] w-[30px]" />
      {resolvedTheme === "dark" && <Image src={RedditLogoTextDark} alt="Reddit Logo Text" className="h-[60px] w-[60px]" />}
      {resolvedTheme === "light" && <Image src={RedditLogoText} alt="Reddit Logo Text" className="h-[60px] w-[60px]" />}
    </div>
  );
};
