"use client";

import axios from "axios";
import qs from "query-string";
import TextareaAutosize from "react-textarea-autosize";

import { Member, MemberRole } from "@prisma/client";
import { format } from "date-fns";
import { Cake, Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/seperator";
import { CommunityWithMembers } from "@/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IconButton } from "@/components/icon-button";
import { cn } from "@/lib/utils";
import { AboutCommunitySkeleton } from "@/components/skeletons/about-community-skeleton";

const DATE_FORMAT = "MMM d, yyyy";
const MAX_DESCRIPTION_LEN = 500;

export const AboutCommunitiyHomeComponent = ({ communityId }: { communityId: string }) => {
  const [community, setCommunity] = useState<CommunityWithMembers>();
  const [currentMember, setCurrentMember] = useState<Member>();
  const [description, setDescription] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [wantsToEditDescription, setWantsToEditDescription] = useState(false);
  const [isSubmittingDescription, setIsSubmittingDescription] = useState(false);

  const router = useRouter();
  const isAdmin = currentMember?.role === MemberRole.ADMIN;
  const isModerator = currentMember?.role === MemberRole.MODERATOR;

  useEffect(() => {
    const getCommunity = async () => {
      setIsLoading(true);

      try {
        const url = qs.stringifyUrl({ url: "/api/communities/specific", query: { communityId } });

        const response = await axios.get(url);
        setCommunity(response.data.community);
        setCurrentMember(response.data.currentMember[0]);
        setDescription(response.data.community.description);
        setEditingDescription(response.data.community.description || "");
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getCommunity();
  }, []);

  const submitDescription = async () => {
    setIsSubmittingDescription(true);

    try {
      setDescription(editingDescription);
      setWantsToEditDescription(false);
      await axios.patch("/api/communities", { communityId, data: { description: editingDescription } });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingDescription(false);
    }
  };

  if (isLoading) return <AboutCommunitySkeleton />;

  return (
    <div className="home-component p-0 w-[20rem]">
      <div className="py-3 px-2 bg-blue-500 dark:bg-transparent">
        <p className="font-bold text-sm text-white dark:text-zinc-500">About community</p>
      </div>
      <div className="px-3 pb-5 pt-2">
        <div>
          {isAdmin || isModerator ? (
            description && !wantsToEditDescription ? (
              <div className={cn(editingDescription.length < 45 ? "flex items-center gap-x-2" : "")}>
                <p className="text-sm flex items-center">{description}</p>
                <div className="flex items-center gap-x-2 whitespace-nowrap">
                  <IconButton
                    Icon={Pencil}
                    IconClassName={cn("h-5 w-5", isSubmittingDescription && "text-gray-400")}
                    className={cn(isSubmittingDescription && "hover:bg-transparent cursor-not-allowed")}
                    onClick={() => setWantsToEditDescription(true)}
                  />
                  {isSubmittingDescription && <Loader2 className="animate-spin h-6 w-6" />}
                </div>
              </div>
            ) : wantsToEditDescription ? (
              <div className="bg-gray-50 dark:bg-[#272729] border border-blue-500 dark:border-white rounded-sm p-2">
                <TextareaAutosize
                  className="bg-transparent w-full resize-none outline-none"
                  value={editingDescription || ""}
                  onChange={(e) => {
                    if (e.target.value.length > MAX_DESCRIPTION_LEN) return;
                    setEditingDescription(e.target.value);
                  }}
                  autoFocus={true}
                />
                <div className="flex items-center justify-between cursor-default">
                  <p className="text-[11px] text-gray-400">{MAX_DESCRIPTION_LEN - editingDescription?.length} characters remaining</p>
                  <div className="flex items-center gap-x-2">
                    <p
                      onClick={() => {
                        setEditingDescription(description);
                        setWantsToEditDescription(false);
                      }}
                      className="text-xs font-bold cursor-pointer text-red-500">
                      Cancel
                    </p>
                    <p className="text-xs font-bold cursor-pointer text-blue-500" onClick={submitDescription}>
                      Save
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p
                onClick={() => setWantsToEditDescription(true)}
                className="w-full px-2 py-1.5 text-blue-500 font-bold text-xs cursor-pointer bg-gray-50 border border-input rounded-sm hover:border-blue-500 transition">
                Add description
              </p>
            )
          ) : description && !wantsToEditDescription ? (
            <p className="text-sm">{description}</p>
          ) : (
            <p className="text-sm">Welcome to r/{community?.uniqueName}</p>
          )}
          <div className="flex items-center gap-x-2 mt-4">
            <Cake className="text-gray-500" />
            <p className="text-sm text-gray-500">Created on {format(new Date(community?.createdAt!), DATE_FORMAT)}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center gap-x-16">
          <div>
            <p className="text-lg font-bold">{community?.members.length}</p>
            <p className="text-gray-500 text-xs">Members</p>
          </div>
        </div>
        <Separator className="my-4" />
        <Button variant="primary" className="w-full" onClick={() => router.push(`/main/create/post?plain=true&preselected=${community?.id}`)}>
          Create Post
        </Button>
      </div>
    </div>
  );
};
