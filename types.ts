import { Community, Member, Post, Profile } from "@prisma/client";

export type CommunityWithMembers = Community & {
  members: Member[];
};

export type PostWithMemberWithProfileWithCommunity = Post & {
  member: Member & {
    profile: Profile;
  };
  community: Community;
};
