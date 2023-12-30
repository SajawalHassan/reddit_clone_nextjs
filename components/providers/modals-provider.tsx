"use client";

import { useEffect, useState } from "react";
import { CreateCommunityModal } from "@/components/modals/create-community-modal";
import { EditCommunityModal } from "@/components/modals/edit-community-modal";
import { DeleteCommunityModal } from "@/components/modals/delete-community-modal";
import { JoinCommunityModal } from "@/components/modals/join-community-modal";

export const ModalsProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  return (
    <>
      <CreateCommunityModal />
      <EditCommunityModal />
      <DeleteCommunityModal />
      <JoinCommunityModal />
    </>
  );
};
