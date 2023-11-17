import { Community, Member } from "@prisma/client";

export type CommunityWithMembers = Community & {
  members: Member[];
};
