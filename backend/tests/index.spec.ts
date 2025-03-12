import { ApolloServer, BaseContext } from "@apollo/server";
import { getSchema } from "../src/schema";
import { datasource } from "../src/datasource";
import { DataSource } from "typeorm";
import { UsersResolverTest } from "./resolvers/UsersResolver";
import { CategoriesResolverTest } from "./resolvers/CategoriesResolver";

export type TestArgsType = {
  server: ApolloServer<BaseContext>;
  datasource: DataSource;
  data: any;
};

const testArgs: TestArgsType = {
  server: null,
  datasource: null,
  data: {},
};

export function assert(expr: unknown, msg?: string): asserts expr {
  if (!expr) throw new Error(msg);
}

beforeAll(async () => {
  await datasource.initialize();
  try {
    const entities = datasource.entityMetadatas;
    const tableNames = entities
      .map((entity) => `"${entity.tableName}"`)
      .join(", ");
    await datasource.query(`TRUNCATE ${tableNames} CASCADE;`);
  } catch (error) {
    throw new Error(`ERROR: Cleaning test database: ${error}`);
  }

  const schema = await getSchema();

  const testServer = new ApolloServer({
    schema,
  });

  testArgs.datasource = datasource;
  testArgs.server = testServer;
});

describe("users resolver", () => {
  UsersResolverTest(testArgs);
});

describe("categories resolver", () => {
  CategoriesResolverTest(testArgs);
});

afterAll(async () => {
  await datasource.destroy();
});
