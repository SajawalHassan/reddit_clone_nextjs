import { Profile } from "@prisma/client";
import { create } from "zustand";

interface profileStore {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

export const useProfile = create<profileStore>((set) => ({
  profile: null,
  setProfile: (profile: Profile | null) => {
    console.log("Profile: ", profile);
    set({ profile });
  },
}));
