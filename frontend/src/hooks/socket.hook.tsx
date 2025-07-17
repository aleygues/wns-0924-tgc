import { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<null | {
  socket: Socket;
}>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socket = useMemo(() => {
    return io("", {
      path: `/api/socket.io`,
      hostname: "",
    });
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);

  if (ctx === null) {
    throw new Error(
      "context not set, did you forget to put the SocketProvider in the components tree?"
    );
  }

  return ctx;
}
