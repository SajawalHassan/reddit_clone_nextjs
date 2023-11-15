"use client";

import { LucideIcon } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { cn } from "@/lib/utils";

interface Props {
  tooltipContent: string;
  Icon: LucideIcon;
  text: string;
  isSelected: boolean;
  onChange: () => void;
  value: string;
  isLoading: boolean;
}

export const CommunityTypeButton = ({ tooltipContent, Icon, text, isSelected, onChange, value, isLoading }: Props) => {
  return (
    <ActionTooltip delayDuration={700} content={tooltipContent}>
      <button
        className={cn("community-type-button", isSelected && "border-2 border-zinc-300 dark:border-zinc-600")}
        onClick={onChange}
        value={value}
        type="button"
        disabled={isLoading}>
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        <p className="font-semibold">{text}</p>
      </button>
    </ActionTooltip>
  );
};
