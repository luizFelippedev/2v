import { Socket as SocketIOClientSocket } from "socket.io-client";

declare module "socket.io-client" {
  interface Socket extends SocketIOClientSocket {
    userId?: string;
    userRole?: string;
    isAuthenticated?: boolean;
  }
}
