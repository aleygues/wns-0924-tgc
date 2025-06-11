import "reflect-metadata";
import { datasource } from "./datasource";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ContextType, getUserFromContext } from "./auth";
import { getSchema } from "./schema";
import "./redis";

async function initialize() {
  await datasource.initialize();
  console.log("Datasource is connected");

  const schema = await getSchema();

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
    context: async ({ req, res }) => {
      const queryRunner = datasource.createQueryRunner();
      const manager = datasource.createEntityManager(queryRunner);
      const context: ContextType = {
        req,
        res,
        user: undefined,
        db: manager,
      };
      queryRunner.data = { context };
      const user = await getUserFromContext(context);
      context.user = user; // will be a user or null
      return context;
    },
  });
  console.log(`GraphQL server ready at ${url}`);
}

initialize();
