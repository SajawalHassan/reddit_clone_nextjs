"use client";

import axios from "axios";
import qs from "query-string";

import { CommunityRule } from "@prisma/client";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/icon-button";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { RuleInput } from "./rule-input";
import { Separator } from "@/components/ui/seperator";
import { useCommunityInfo } from "@/hooks/use-community-info";

interface Props {
  rule: CommunityRule;
  i: number;
  hasPrivilages: boolean;
}

export const CommunityRuleItem = ({ rule: pRule, i, hasPrivilages }: Props) => {
  const [isEditingRule, setIsEditingRule] = useState(false);
  const [editingRule, setEditingRule] = useState(pRule.rule || "");
  const [rule, setRule] = useState(pRule.rule || "");
  const [isLoading, setIsLoading] = useState(false);

  const { community, setCommunity } = useCommunityInfo();

  const isLastRule = community?.rules && pRule.id === community?.rules[community?.rules.length - 1].id;

  const handleEditRule = async () => {
    try {
      setRule(editingRule);
      setIsLoading(true);

      await axios.patch("/api/communities/rules", { ruleId: pRule.id, newRule: editingRule, communityId: pRule.communityId });

      setIsEditingRule(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRule = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({ url: "/api/communities/rules", query: { ruleId: pRule.id, communityId: pRule.communityId } });
      await axios.delete(url);

      setRule("");
      setEditingRule("");
      setCommunity({ ...community!, rules: community!.rules.filter((rule) => rule.id !== pRule.id) });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className={cn("flex items-center justify-between group min-h-[1rem] px-4 relative group")}>
        {isEditingRule ? (
          <RuleInput
            value={editingRule}
            setValue={setEditingRule}
            cancelOnClick={() => setIsEditingRule(false)}
            saveOnClick={() => handleEditRule()}
            isLoading={isLoading}
          />
        ) : (
          <p className={cn("font-semibold text-sm whitespace-pre-wrap mt-0.5", isLoading && "text-zinc-400")}>
            {i + 1}. {rule}
          </p>
        )}
        {hasPrivilages && !isEditingRule && (
          <div className="absolute -top-3 left-0 hidden items-center group-hover:flex w-full justify-end pr-4">
            <IconButton
              Icon={Pencil}
              IconClassName="h-3 w-3"
              className={cn(
                "p-1",
                isLoading &&
                  "text-zinc-400 hover:text-zinc-400 dark:hover:text-zinc-400 hover:bg-transparent hover:dark:bg-transparent cursor-not-allowed"
              )}
              onClick={() => setIsEditingRule(true)}
            />
            <IconButton
              Icon={Trash}
              IconClassName="h-3 w-3"
              className={cn(
                "p-1",
                isLoading &&
                  "text-zinc-400 hover:text-zinc-400 dark:hover:text-zinc-400 hover:bg-transparent hover:dark:bg-transparent cursor-not-allowed"
              )}
              onClick={handleDeleteRule}
            />
          </div>
        )}
      </div>
      {!isLastRule && (
        <div className="px-4 flex justify-center">
          <Separator className="my-3.5" />
        </div>
      )}
    </div>
  );
};
