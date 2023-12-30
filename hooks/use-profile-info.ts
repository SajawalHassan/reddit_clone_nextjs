import { Member, Profile } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type headerActivePlaceType = {
  text: string;
  imageUrl?: string;
  icon?: string;
};

interface useProfileInfoStore {
  setProfile: (profile: Profile | null) => void;
  setViewingProfile: (profile: Profile | null) => void;
  profile: Profile | null;
  viewingProfile: Profile | null;
}

export const useProfileInfo = create<useProfileInfoStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  viewingProfile: null,
  setViewingProfile: (viewingProfile) => set({ viewingProfile }),
}));
