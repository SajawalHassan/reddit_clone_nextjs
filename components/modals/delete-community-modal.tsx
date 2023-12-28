"use client";

import axios from "axios";

import { useModal } from "@/hooks/use-modal-store";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import qs from "query-string";
import { Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useGlobalInfo } from "@/hooks/use-global-info";
import { redirectToSignIn } from "@clerk/nextjs";

export const DeleteCommunityModal = () => {
  const { isOpen, type, closeModal, data } = useModal();
  const { community } = data;
  const { profile, setProfile } = useGlobalInfo();

  const [isLoading, setIsLoading] = useState(false);

  const modalIsOpen = isOpen && type === "deleteCommunity";
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      if (profile !== null) return;

      try {
        const res = await axios.get("/api/profile");
        setProfile(res.data);
      } catch (error: any) {
        if (error.response.status === 401) redirectToSignIn();
        else console.log(error);
      }
    };

    getProfile();
  }, []);

  const deleteModal = async () => {
    if (!profile) return;

    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: "/api/communities",
        query: { communityId: community?.id, currentMemberId: community!.members.filter((member) => member.profileId === profile.id)[0].id },
      });
      await axios.delete(url);

      router.push("/main");
      handleModalClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    closeModal();
  };

  return (
    <Dialog open={modalIsOpen} onOpenChange={handleModalClose}>
      <DialogContent className="dark:bg-[#161718]">
        <DialogHeader>
          <p className="font-semibold text-lg text-center">Delete r/{community?.uniqueName}?</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">This action is permanent and irreversable!</p>
        </DialogHeader>
        <div className="flex items-center gap-x-2 justify-end">
          <Button onClick={deleteModal} variant="destructive" disabled={isLoading}>
            Delete Community
          </Button>
          <Button variant="secondary" onClick={handleModalClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
