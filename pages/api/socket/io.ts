import { NextApiResponseSocket } from "@/types";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

const ioHandler = (req: NextApiRequest, res: NextApiResponseSocket) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, { path, addTrailingSlash: false });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
