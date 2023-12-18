import { Member, Profile } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type headerActivePlaceType = {
  text: string;
  imageUrl?: string;
  icon?: string;
};

interface useGlobalInfoStore {
  setHeaderActivePlace: (newHeaderActivePlace: headerActivePlaceType) => void;
  setProfile: (profile: Profile | null) => void;
  headerActivePlace: headerActivePlaceType;
  profile: Profile | null;
}

export const useGlobalInfo = create<useGlobalInfoStore>()(
  persist(
    (set) => ({
      headerActivePlace: { text: "", imageUrl: "", icon: "" },
      setHeaderActivePlace: (newHeaderActivePlace) => set({ headerActivePlace: newHeaderActivePlace }),
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    { name: "globalInfo" }
  )
);
