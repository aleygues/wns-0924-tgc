import "reflect-metadata";
import { datasource } from "./datasource";
import { ApolloServer } from "@apollo/server";
import { ContextType, getUserFromContext } from "./auth";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { getSchema } from "./schema";
import { Server } from "socket.io";
import { init } from "./socket";

async function start() {
  await datasource.initialize();

  const schema = await getSchema();

  const app = express();
  const httpServer = http.createServer(app);

  init(httpServer);

  const server = new ApolloServer<ContextType>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    "/",
    /* cors<cors.CorsRequest>({
      origin: "http://localhost:3000",
      credentials: true,
    }), */
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    express.json({ limit: "50mb" }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const context: ContextType = {
          req,
          res,
          user: undefined,
        };
        const user = await getUserFromContext(context);
        context.user = user; // will be a user or null
        return context;
      },
    })
  );

  // app.post('/files', ...)

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 5000 }, resolve)
  );
  console.log(`🚀 Server super ready at http://localhost:5000/`);
}

start();
