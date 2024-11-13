import "reflect-metadata";
import { datasource } from "./datasource";
import { buildSchema } from "type-graphql";
import { PicturesResolver } from "./resolvers/Pictures";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { CategoriesResolver } from "./resolvers/Categories";

async function initialize() {
  await datasource.initialize();
  console.log("Datasource is connected");

  const schema = await buildSchema({ resolvers: [CategoriesResolver] });

  const server = new ApolloServer({ schema });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
  });
  console.log(`GraphQL server ready at ${url}`);
}

initialize();
