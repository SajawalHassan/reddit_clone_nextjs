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
}

export const useGlobalInfo = create<useGlobalInfoStore>()(
  persist(
    (set) => ({
      headerActivePlace: { text: "", imageUrl: "", icon: "" },
      setHeaderActivePlace: (newHeaderActivePlace) => set({ headerActivePlace: newHeaderActivePlace }),
      refetchCommunityHero: false,
      setRefetchCommunityHero: (val: boolean) => set({ refetchCommunityHero: val }),
    }),
    { name: "globalInfo" }
  )
);
