import { Server } from "socket.io";

let io: Server = null;

export function init(httpServer: any) {
  io = new Server(httpServer, {
    path: "/api/socket.io",
  });

  io.engine.use((req, res, next) => {
    const isHandshake = req._query.sid === undefined;

    if (!isHandshake) {
      return next();
    }

    const cookie = req.headers["cookie"];

    console.log("Cookie =>", cookie);

    if (!cookie) {
      return next(new Error("no cookie"));
    }

    next();

    /* if (!header.startsWith("bearer ")) {
      return next(new Error("invalid token"));
    }
  
    const token = header.substring(7);
  
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return next(new Error("invalid token"));
      }
      req.user = decoded.data;
      next();
    }); */
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
