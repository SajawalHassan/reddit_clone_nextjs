"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  children: React.ReactNode;
  content: string;
  side?: "bottom" | "left" | "right" | "top";
  align?: "center" | "end" | "start";
  delayDuration?: Number;
}

export const ActionTooltip = ({ children, content, side, align, delayDuration }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration ? (delayDuration as number) : 50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="font-semibold text-sm capitalize max-w-[200px] text-center">{content.toLowerCase()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
