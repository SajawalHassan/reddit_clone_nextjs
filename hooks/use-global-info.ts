import { Member } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type headerActivePlaceType = {
  text: string;
  imageUrl?: string;
  icon?: string;
};

interface useGlobalInfoStore {
  headerActivePlace: headerActivePlaceType;
  setHeaderActivePlace: (newHeaderActivePlace: headerActivePlaceType) => void;
  refetchCommunityHero: boolean;
  setRefetchCommunityHero: (val: boolean) => void;
  currentMember: Member | null;
  setCurrentMember: (member: Member | null) => void;
}

export const useGlobalInfo = create<useGlobalInfoStore>()(
  persist(
    (set) => ({
      headerActivePlace: { text: "", imageUrl: "", icon: "" },
      setHeaderActivePlace: (newHeaderActivePlace) => set({ headerActivePlace: newHeaderActivePlace }),
      refetchCommunityHero: false,
      setRefetchCommunityHero: (val: boolean) => set({ refetchCommunityHero: val }),
      currentMember: null,
      setCurrentMember: (member: Member | null) => set({ currentMember: member }),
    }),
    { name: "globalInfo" }
  )
);
