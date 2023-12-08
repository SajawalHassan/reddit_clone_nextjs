"use client";

import { useEffect, useState } from "react";
import { CreateCommunityModal } from "@/components/modals/create-community-modal";

export const ModalsProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  return (
    <>
      <CreateCommunityModal />
    </>
  );
};
