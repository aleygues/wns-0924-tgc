import { createClient } from "redis";

const client = createClient({
  url: "redis://redis:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err)).connect();

export const redis = {
  set: async (key: string, value: any) => {
    await client.set(key, JSON.stringify(value));
  },
  get: async (key: string): Promise<any | null> => {
    const cache = await client.get(key);
    if (cache) {
      return JSON.parse(cache);
    } else {
      return null;
    }
  },
};

/* client.destroy(); */
