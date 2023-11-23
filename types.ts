import { Community, Member, Post } from "@prisma/client";

export type CommunityWithMembers = Community & {
  members: Member[];
};

export type PostWithMemberWithCommunity = Post & {
  member: Member;
  community: Community;
};
