import { User } from "../../src/entities/User";
import { mutationCreateUser } from "../api/createUser";
import { mutationSignin } from "../api/signin";
import { queryWhoami } from "../api/whoiam";
import { assert, TestArgsType } from "../index.spec";

export function UsersResolverTest(testArgs: TestArgsType) {
  it("should not create an user with a disposable email", async () => {
    const response = await testArgs.server.executeOperation<{
      createUser: User;
    }>({
      query: mutationCreateUser,
      variables: {
        data: {
          email: "test@yopmail.com",
          password: "SuperSecret!2025",
        },
      },
    });

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.data).toBeNull();
  });

  it("should create an admin user", async () => {
    const response = await testArgs.server.executeOperation<{
      createUser: User;
    }>({
      query: mutationCreateUser,
      variables: {
        data: {
          email: "admin@aleygues.fr",
          password: "SuperSecret!2025",
        },
      },
    });

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createUser?.id).toBeDefined();

    // check user in database
    const userFromDb = await User.findOneBy({
      id: response.body.singleResult.data?.createUser?.id,
    });
    userFromDb.role = "admin";
    await userFromDb.save();
    testArgs.data.admin = userFromDb;
  });

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

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createUser?.id).toBeDefined();

    // check user in database
    const userFromDb = await User.findOneBy({
      id: response.body.singleResult.data?.createUser?.id,
    });
    expect(userFromDb).toBeDefined();
    expect(userFromDb.email).toBe("test1@aleygues.fr");
    expect(userFromDb.hashedPassword).not.toBe("SuperSecret!2025");
    testArgs.data.userId = response.body.singleResult.data?.createUser?.id;
    testArgs.data.userEmail = userFromDb.email;
    testArgs.data.user = userFromDb;
  });

  // test whoami resolver (without token)
  it("should not find my profile", async () => {
    const response = await testArgs.server.executeOperation<{
      whoami: User;
    }>({
      query: queryWhoami,
    });

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.whoami).toBeNull();
  });

  // test signin resolver
  it("should sign me in", async () => {
    const response = await testArgs.server.executeOperation<{
      signin: User;
    }>({
      query: mutationSignin,
      variables: {
        email: "test1@aleygues.fr",
        password: "SuperSecret!2025",
      },
    });

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.signin?.id).toBeDefined();
    expect(response.body.singleResult.data?.signin?.id).toBe(
      testArgs.data.userId
    );
  });

  // test whoami resolver
  it("should find my profile", async () => {
    const response = await testArgs.server.executeOperation<{
      whoami: User;
    }>(
      {
        query: queryWhoami,
      },
      {
        contextValue: {
          user: testArgs.data.user,
        },
      }
    );

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.whoami?.id).toBeDefined();
    expect(response.body.singleResult.data?.whoami?.id).toBe(
      testArgs.data.userId
    );
  });
}
