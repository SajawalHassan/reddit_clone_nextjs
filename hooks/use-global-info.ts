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
  headerActivePlace: headerActivePlaceType;
}

export const useGlobalInfo = create<useGlobalInfoStore>()(
  persist(
    (set) => ({
      headerActivePlace: { text: "", imageUrl: "", icon: "" },
      setHeaderActivePlace: (newHeaderActivePlace) => set({ headerActivePlace: newHeaderActivePlace }),
    }),
    { name: "globalInfo" }
  )
);
