import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/Users";
import { CategoriesResolver } from "./resolvers/Categories";
import { AdsResolver } from "./resolvers/Ads";
import { TagsResolver } from "./resolvers/Tags";
import { authChecker } from "./auth";

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [UsersResolver, CategoriesResolver, AdsResolver, TagsResolver],
    authChecker,
  });

  return schema;
}
