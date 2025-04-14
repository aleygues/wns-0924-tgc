import { Server } from "socket.io";

let io: Server = null;

export function init(httpServer: any) {
  io = new Server(httpServer, {
    path: "/api/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.emit("welcome", "Bienvenue !");
  });
}

export function sendMessage(key: string, data: any) {
  io.emit(key, data);
}
