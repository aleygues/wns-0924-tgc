import { Ad } from "../../src/entities/Ad";
import { User } from "../../src/entities/User";
import { mutationCreateAd } from "../api/createAd";
import { mutationCreateUser } from "../api/createUser";
import { mutationSignin } from "../api/signin";
import { queryWhoami } from "../api/whoiam";
import { assert, TestArgsType } from "../index.spec";

export function AdsResolverTest(testArgs: TestArgsType) {
  it("should refuse an ad with a dummy city", async () => {
    const response = await testArgs.server.executeOperation<{
      createAd: Ad;
    }>(
      {
        query: mutationCreateAd,
        variables: {
          data: {
            category: { id: testArgs.data.categoryId },
            tags: [],
            title: "Some ad in a random place",
            description: "",
            location: "Somecity",
            price: 100,
            picture: "https://google.com",
          },
        },
      },
      {
        contextValue: {
          user: testArgs.data.admin,
        },
      }
    );

    // check API response
    assert(response.body.kind === "single");
    console.log(response.body.singleResult.errors);
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.data?.createAd).toBeUndefined();
  });

  it("should create an ad if the city exists in France", async () => {
    const response = await testArgs.server.executeOperation<{
      createAd: Ad;
    }>(
      {
        query: mutationCreateAd,
        variables: {
          data: {
            category: { id: testArgs.data.categoryId },
            tags: [],
            title: "Some ad in a random place",
            description: "",
            location: "Villeurbanne",
            price: 100,
            picture: "https://google.com",
          },
        },
      },
      {
        contextValue: {
          user: testArgs.data.admin,
        },
      }
    );

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createAd?.id).toBeDefined();
    testArgs.data.adId = response.body.singleResult.data?.createAd?.id;
  });
}
