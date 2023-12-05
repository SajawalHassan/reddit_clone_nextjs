import { Comment, Community, Member, Post, PostProfileDownvotes, PostProfileUpvotes, Profile } from "@prisma/client";
import { Socket, Server as NetServer } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type CommunityWithMembers = Community & {
  members: Member[];
};

export type PostWithMemberWithProfileWithCommunityWithVotes = Post & {
  member: Member & {
    profile: Profile;
  };
  community: Community;
  upvotes: PostProfileUpvotes[];
  downvotes: PostProfileDownvotes[];
  comments: Comment[];
};

export type PostWithComments = Post & {
  comments: Comment[];
};

export type NextApiResponseSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
