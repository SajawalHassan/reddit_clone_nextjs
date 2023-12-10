"use client";

import { CommunityWithMembers } from "@/types";
import { Member, MemberRole } from "@prisma/client";
import axios from "axios";
import qs from "query-string";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IconButton } from "../icon-button";
import { UploadClient } from "@uploadcare/upload-client";
import { Camera, X } from "lucide-react";
import { ActionLoading } from "@/components/action-loading";
import { useModal } from "@/hooks/use-modal-store";
import { useGlobalInfo } from "@/hooks/use-global-info";

const client = new UploadClient({ publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY as string });

export const CommunityHero = ({ communityId }: { communityId: string }) => {
  const [community, setCommunity] = useState<CommunityWithMembers>();
  const [currentMember, setCurrentMember] = useState<Member>();
  const [banner, setBanner] = useState("");
  const [image, setImage] = useState("");
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(false);
  const [isJoiningOrLeavingCommunity, setIsJoiningOrLeavingCommunity] = useState(false);

  const bannerUploadRef = useRef<any>(null);
  const imageUploadRef = useRef<any>(null);
  const isAdmin = currentMember?.role === MemberRole.ADMIN;

  const { openModal } = useModal();
  const { refetchCommunityHero, setRefetchCommunityHero } = useGlobalInfo();

  const getCommunity = async () => {
    try {
      const url = qs.stringifyUrl({ url: "/api/communities/specific", query: { communityId } });

      const response = await axios.get(url);
      setCommunity(response.data.community);
      setCurrentMember(response.data.currentMember[0]);
      setBanner(response.data.community.bannerUrl || "");
      setImage(response.data.community.imageUrl || "");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCommunity();
  }, []);

  useEffect(() => {
    if (refetchCommunityHero) {
      getCommunity();
      setRefetchCommunityHero(false);
    }
  }, [refetchCommunityHero]);

  useEffect(() => {
    setHasJoinedCommunity(currentMember ? true : false);
  }, [currentMember]);

  const uploadFile = async (e: ChangeEvent, type: "banner" | "image") => {
    const file = (e.target as HTMLInputElement).files![0];
    if (!file) return;

    try {
      setIsSubmittingFile(true);

      const uploadCareFile = await client.uploadFile(file);

      if (type === "banner") setBanner(uploadCareFile.cdnUrl as string);
      else setImage(uploadCareFile.cdnUrl as string);

      if (type === "banner") await axios.patch("/api/communities", { communityId, data: { bannerUrl: uploadCareFile.cdnUrl } });
      else await axios.patch("/api/communities", { communityId, data: { imageUrl: uploadCareFile.cdnUrl } });

      setRefetchCommunityHero(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingFile(false);
    }
  };

  const removeFile = async (type: "banner" | "image") => {
    try {
      setIsSubmittingFile(true);

      if (type === "banner") setBanner("");
      else setImage("");

      if (type === "banner") await axios.patch("/api/communities", { communityId, data: { bannerUrl: "" } });
      else await axios.patch("/api/communities", { communityId, data: { imageUrl: "" } });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingFile(false);
    }
  };

  const LeaveCommunity = async () => {
    try {
      setIsJoiningOrLeavingCommunity(true);

      await axios.patch("/api/communities/leave", { memberId: currentMember?.id, communityId });

      setHasJoinedCommunity(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsJoiningOrLeavingCommunity(false);
    }
  };

  const joinCommunity = async () => {
    try {
      setIsJoiningOrLeavingCommunity(true);

      const response = await axios.patch("/api/communities/join", { communityId });
      const { currentMember: member } = response.data;
      setCurrentMember(member);

      setHasJoinedCommunity(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsJoiningOrLeavingCommunity(false);
    }
  };

  return (
    <div>
      <div>
        {banner ? (
          <div className="min-h-[5rem] max-h-[192px] overflow-hidden w-full relative">
            <img src={banner} className="w-full" />
            {isAdmin && (
              <IconButton
                Icon={X}
                className="absolute inset-0 m-auto w-max h-max bg-red-300 hover:bg-red-400"
                IconClassName="text-white"
                onClick={() => removeFile("banner")}
              />
            )}
          </div>
        ) : (
          <div className="w-full h-[5rem] bg-[#2D97E5] relative">
            {isAdmin && (
              <IconButton
                Icon={Camera}
                className="absolute inset-0 m-auto w-max h-max hover:bg-zinc-300/50"
                IconClassName="text-white"
                onClick={() => bannerUploadRef?.current?.click()}
              />
            )}
          </div>
        )}
        <div className="bg-white flex justify-center h-[5rem]">
          {community && (
            <div className="lg:max-w-[984px] w-full pl-2 sm:pl-10 lg:pl-0 relative flex gap-x-2 mt-1.5">
              <div className="relative -top-5">
                <img src={image} alt={community.uniqueName} className="h-[5rem] w-[5rem] rounded-full border-4 border-white" />
                {isAdmin && (
                  <IconButton
                    Icon={Camera}
                    className="absolute inset-0 m-auto w-max h-max hover:bg-zinc-300/50"
                    IconClassName="text-white"
                    onClick={() => imageUploadRef?.current?.click()}
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-x-2 h-max">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{community.name}</p>
                  {!isAdmin ? (
                    hasJoinedCommunity ? (
                      <div
                        className="px-7 py-1 rounded-full border border-black hover:bg-gray-100 group cursor-pointer"
                        onClick={() => LeaveCommunity()}>
                        <p className="group-hover:hidden">Joined</p>
                        <p className="hidden group-hover:block">Leave</p>
                      </div>
                    ) : (
                      <div className="px-7 py-1 rounded-full bg-black text-white hover:bg-zinc-800 cursor-pointer" onClick={() => joinCommunity()}>
                        <p className="font-bold">Join</p>
                      </div>
                    )
                  ) : (
                    <button
                      className="px-5 py-1 text-sm rounded-full border border-black hover:bg-gray-100 cursor-pointer"
                      onClick={() => openModal("editCommunity", { community })}>
                      Edit community
                    </button>
                  )}
                </div>
                <p className="font-semibold text-sm text-[#818181] mt-1">r/{community.uniqueName}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isSubmittingFile && <ActionLoading isLoading={isSubmittingFile} />}
      {isJoiningOrLeavingCommunity && <ActionLoading isLoading={isJoiningOrLeavingCommunity} />}
      <input type="file" ref={bannerUploadRef} onChange={(e: ChangeEvent) => uploadFile(e, "banner")} className="hidden" accept="image/*" />
      <input type="file" ref={imageUploadRef} onChange={(e: ChangeEvent) => uploadFile(e, "image")} className="hidden" accept="image/*" />
    </div>
  );
};
