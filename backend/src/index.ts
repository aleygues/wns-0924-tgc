import "reflect-metadata";
import { datasource } from "./datasource";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { CategoriesResolver } from "./resolvers/Categories";
import { AdsResolver } from "./resolvers/Ads";
import { TagsResolver } from "./resolvers/Tags";
import { UsersResolver } from "./resolvers/Users";
import { AddUserToContext, authChecker } from "./auth";

async function initialize() {
  await datasource.initialize();
  console.log("Datasource is connected");

  const schema = await buildSchema({
    resolvers: [UsersResolver, CategoriesResolver, AdsResolver, TagsResolver],
    authChecker,
    globalMiddlewares: [AddUserToContext],
  });

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
    context: async ({ req, res }) => {
      // get token cookies?
      // you should use the cookies Cookies.get
      // Look at authchecker
      return {
        req,
        res,
      };
    },
  });
  console.log(`GraphQL server ready at ${url}`);
}

initialize();
