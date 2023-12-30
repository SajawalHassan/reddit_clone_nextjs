"use client";

import axios from "axios";
import qs from "query-string";

import { CommunityRule, MemberRole } from "@prisma/client";
import { LandPlot, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CommunityRuleItem } from "./community-rule-item";
import { RuleInput } from "./rule-input";
import { useCommunityInfo } from "@/hooks/use-community-info";

export const CommunityRules = ({ communityId }: { communityId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [wantsToAddRule, setWantsToAddRule] = useState(false);
  const [isSubmittingRule, setIsSubmittingRule] = useState(false);
  const [newRule, setNewRule] = useState("");
  const [rules, setRules] = useState<CommunityRule[]>([]);

  const { currentMember, setCurrentMember, community, setCommunity } = useCommunityInfo();

  const isAdmin = currentMember?.role === MemberRole.ADMIN;
  const isModerator = currentMember?.role === MemberRole.MODERATOR;
  const hasPrivilages = isAdmin || isModerator;

  useEffect(() => {
    if (community && community.id === communityId) {
      setRules(community.rules);
    } else {
      setCommunity(null);
    }
  }, [community]);

  useEffect(() => {
    const getCommunity = async () => {
      if (community !== null && community.id === communityId) return;

      setCommunity(null);
      setIsLoading(true);

      try {
        const url = qs.stringifyUrl({ url: "/api/communities/specific", query: { communityId } });

        const response = await axios.get(url);
        setCommunity(response.data.community);
        setRules(response.data.community.rules || []);
        setCurrentMember(response.data.currentMember[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getCommunity();
  }, []);

  const handleAddRule = async () => {
    try {
      if (newRule === "") return setWantsToAddRule(false);

      setNewRule("");
      setWantsToAddRule(false);
      setIsSubmittingRule(true);

      const response = await axios.post("/api/communities/rules", { communityId, newRule });
      const rule: CommunityRule = response.data;

      setRules((rules) => [...rules, rule]);
      setCommunity({ ...community!, rules: [...rules, rule] });
    } catch (error) {
      console.log((error as any).response.data);
    } finally {
      setIsSubmittingRule(false);
    }
  };

  if (isLoading) return;

  return (
    <div className="home-component p-0 w-[20rem]">
      <div className="py-3 px-2 bg-blue-500 dark:bg-transparent flex items-center justify-between">
        <p className="font-bold text-sm text-white dark:text-zinc-500">r/{community?.uniqueName} rules</p>
      </div>
      <div>
        {rules.length !== 0 ? (
          <div className="py-4">
            <div className="mt-1">
              {rules.map((rule, i) => (
                <CommunityRuleItem i={i} rule={rule} key={rule.id} hasPrivilages={hasPrivilages} />
              ))}
            </div>
            {wantsToAddRule ? (
              <div className="px-4">
                <RuleInput
                  cancelOnClick={() => setWantsToAddRule(false)}
                  saveOnClick={() => handleAddRule()}
                  value={newRule}
                  setValue={setNewRule}
                  className="mt-2"
                />
              </div>
            ) : (
              hasPrivilages &&
              rules.length < 15 &&
              (isSubmittingRule ? (
                <div className="flex justify-center items-center mt-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="mx-4">
                  <Button
                    variant="primary"
                    className="w-full py-0.5 mt-2"
                    onClick={() => {
                      setNewRule("");
                      setWantsToAddRule(true);
                    }}>
                    Add a rule
                  </Button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-3 py-5">
            {wantsToAddRule ? (
              <RuleInput cancelOnClick={() => setWantsToAddRule(false)} saveOnClick={() => handleAddRule()} value={newRule} setValue={setNewRule} />
            ) : (
              <div className="w-full flex flex-col items-center space-y-2.5">
                {isSubmittingRule ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <div className="space-y-2 px-4">
                    <div className="space-y-1 flex flex-col items-center w-full">
                      <LandPlot className="h-10 w-10 text-zinc-600" />
                      <p className="text-[11px] text-gray-500 max-w-[70%] text-center">This community has no rules, you're free to do anything!</p>
                    </div>
                    {hasPrivilages && (
                      <Button variant="primary" className="w-full py-0.5" onClick={() => setWantsToAddRule(true)}>
                        Add a rule
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
