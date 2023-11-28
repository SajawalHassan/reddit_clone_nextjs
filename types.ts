import { Community, Member, Post, PostProfileDownvotes, PostProfileUpvotes, Profile } from "@prisma/client";
import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";

export type CommunityWithMembers = Community & {
  members: Member[];
};

export type PostWithMemberWithProfileWithCommunity = Post & {
  member: Member & {
    profile: Profile;
  };
  community: Community;
  upvotes: PostProfileUpvotes[];
  downVotes: PostProfileDownvotes[];
};

export type NextApiResponseSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
