import "reflect-metadata";
import { datasource } from "./datasource";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { CategoriesResolver } from "./resolvers/Categories";
import { AdsResolver } from "./resolvers/Ads";
import { TagsResolver } from "./resolvers/Tags";
import { UsersResolver } from "./resolvers/Users";
import { authChecker, ContextType, getUserFromContext } from "./auth";
import { getSchema } from "./schema";

async function initialize() {
  await datasource.initialize();
  console.log("Datasource is connected");

  const schema = await getSchema();

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
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
  });
  console.log(`GraphQL server ready at ${url}`);
}

initialize();
