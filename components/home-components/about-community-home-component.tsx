"use client";

import axios from "axios";
import qs from "query-string";
import TextareaAutosize from "react-textarea-autosize";

import { MemberRole } from "@prisma/client";
import { format } from "date-fns";
import { Cake, Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/seperator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IconButton } from "@/components/icon-button";
import { cn } from "@/lib/utils";
import { AboutCommunitySkeleton } from "@/components/skeletons/about-community-skeleton";
import { useModal } from "@/hooks/use-modal-store";
import { useCommunityInfo } from "@/hooks/use-community-info";

const DATE_FORMAT = "MMM d, yyyy";
const MAX_DESCRIPTION_LEN = 500;

export const AboutCommunitiyHomeComponent = ({ communityId, showMoreInfo = false }: { communityId: string; showMoreInfo?: boolean }) => {
  const [description, setDescription] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wantsToEditDescription, setWantsToEditDescription] = useState(false);
  const [isSubmittingDescription, setIsSubmittingDescription] = useState(false);

  const { community, currentMember, setCommunity, setCurrentMember } = useCommunityInfo();
  const { openModal } = useModal();

  const router = useRouter();
  const isAdmin = currentMember?.role === MemberRole.ADMIN;
  const isModerator = currentMember?.role === MemberRole.MODERATOR;

  useEffect(() => {
    const getCommunity = async () => {
      if (community !== null && community.id === communityId) {
        return setDescription(community.description || "");
      }

      setCommunity(null);
      setIsLoading(true);

      try {
        const url = qs.stringifyUrl({ url: "/api/communities/specific", query: { communityId } });

        const response = await axios.get(url);
        setCommunity(response.data.community);
        setCurrentMember(response.data.currentMember[0]);
        setDescription(response.data.community.description || "");
        setEditingDescription(response.data.community.description || "");
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getCommunity();
  }, []);

  useEffect(() => {
    if (community && document.title !== community.name) {
      document.title = community.name;
    }
  }, [community]);

  useEffect(() => {
    if (community && community.id === communityId) {
      setDescription(community.description || "");
      setEditingDescription(community.description || "");
    } else {
      setCommunity(null);
    }
  }, [community]);

  const submitDescription = async () => {
    setIsSubmittingDescription(true);

    try {
      setDescription(editingDescription);
      setWantsToEditDescription(false);

      await axios.patch("/api/communities", { communityId, data: { description: editingDescription } });

      setCommunity({ ...community!, description: editingDescription });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingDescription(false);
    }
  };

  const createPost = () => {
    if (!currentMember)
      return openModal("joinCommunity", { joinCommunityText: `In order to create a post in r/${community?.uniqueName} you must be a member.` });
    router.push(`/main/create/post?plain=true&preselected=${communityId}`);
  };

  if (isLoading) return <AboutCommunitySkeleton />;

  return (
    <div className="home-component p-0 w-[20rem]">
      {showMoreInfo && community?.bannerUrl ? (
        <div className="overflow-hidden max-h-[2.5rem]">
          <img src={community.bannerUrl} alt={community?.uniqueName} className="w-full h-full" />
        </div>
      ) : (
        <div className="py-3 px-2 bg-blue-500 dark:bg-transparent">
          <p className="font-bold text-sm text-white dark:text-zinc-500">About community</p>
        </div>
      )}
      <div className="px-3 pb-5 pt-2">
        <div className="space-y-3">
          {showMoreInfo && (
            <div className="flex items-center gap-x-2">
              <img src={community?.imageUrl} alt={community?.uniqueName} className="h-[3.5rem] w-[3.5rem] rounded-full" />
              <p className="font-medium text-sm">r/{community?.uniqueName}</p>
            </div>
          )}
          {isAdmin || isModerator ? (
            description && !wantsToEditDescription ? (
              <div className={cn(editingDescription.length < 45 ? "flex items-center gap-x-2" : "")}>
                <p className="text-sm">{description}</p>
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
                className="w-full px-2 py-1.5 text-blue-500 dark:text-white font-bold text-xs cursor-pointer bg-gray-50 dark:bg-zinc-800 border border-input rounded-sm hover:border-blue-500 hover:dark:border-white transition">
                Add description
              </p>
            )
          ) : description && !wantsToEditDescription ? (
            <p className="text-sm">{description}</p>
          ) : (
            <p className="text-sm">Welcome to r/{community?.uniqueName}</p>
          )}
          <div className={cn("flex items-center gap-x-2", editingDescription.length < 45 ? "mt-4" : "mt-1")}>
            <Cake className="text-gray-500" />
            <p className="text-sm text-gray-500">Created on {format(new Date(community?.createdAt || 0), DATE_FORMAT)}</p>
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
        <Button variant="primary" className="w-full" onClick={createPost}>
          Create Post
        </Button>
      </div>
    </div>
  );
};
