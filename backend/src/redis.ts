import { createClient } from "redis";

const client = createClient({
  url: "redis://redis:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err)).connect();

export const redis = {
  set: async (key: string, value: any, expInSeconds?: number) => {
    await client.set(key, JSON.stringify(value), { EX: expInSeconds });
  },
  get: async (key: string): Promise<any | null> => {
    const cache = await client.get(key);
    if (cache) {
      return JSON.parse(cache);
    } else {
      return null;
    }
  },
  clear: async function (key: string) {
    await client?.del([key]);
  },
  clearKeysStartingWith: async function (key: string) {
    const keys = await client?.keys(`${key}:*`);
    if (!!keys?.length) {
      await client?.del(keys);
    }
  },
};

/* client.destroy(); */
