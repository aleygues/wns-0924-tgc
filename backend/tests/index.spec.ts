import { ApolloServer, BaseContext } from "@apollo/server";
import { getSchema } from "../src/schema";
import { mutationCreateUser } from "./api/createUser";
import { datasource } from "../src/datasource";
import { User } from "../src/entities/User";
import { DataSource } from "typeorm";

const testArgs: {
  server: ApolloServer<BaseContext>;
  datasource: DataSource;
  data: any;
} = {
  server: null,
  datasource: null,
  data: {},
};

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

afterAll(async () => {
  await datasource.destroy();
});

describe("users resolver", () => {
  it("should create an user", async () => {
    const response = await testArgs.server.executeOperation<{
      createUser: User;
    }>({
      query: mutationCreateUser,
      variables: {
        data: {
          email: "test1@aleygues.fr",
          password: "SuperSecret!2025",
        },
      },
    });

    expect(response.body.kind === "single");
    if (response.body.kind === "single") {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.createUser?.id).toBeDefined();

      const userFromDb = await User.findOneBy({
        id: response.body.singleResult.data?.createUser?.id,
      });
      expect(userFromDb).toBeDefined();
      expect(userFromDb.email).toBe("test1@aleygues.fr");
      expect(userFromDb.hashedPassword).not.toBe("SuperSecret!2025");
      testArgs.data.userId = response.body.singleResult.data?.createUser?.id;
      testArgs.data.userEmail = userFromDb.email;
    }
  });

  // test signin resolver
  /*
      testArgs.data.userEmail = userFromDb.email;
  */

  // test whoami resolver

  // test signout
});
