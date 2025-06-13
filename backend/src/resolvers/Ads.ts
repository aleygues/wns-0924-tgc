import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Info,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Ad, AdCreateInput, AdUpdateInput } from "../entities/Ad";
import { validate } from "class-validator";
import { merge } from "../utils/merge";
import { AuthContextType } from "../auth";
import { makeRelations } from "../utils/makeRelations";
import { GraphQLResolveInfo } from "graphql";
import axios from "axios";
import { Between, FindOneOptions, ILike } from "typeorm";
import { redis } from "../redis";
import crypto from "crypto";

@Resolver()
export class AdsResolver {
  @Query(() => [Ad])
  async ads(
    @Info() info: GraphQLResolveInfo,
    @Arg("price", () => Int, { nullable: true }) price?: number,
    @Arg("title", { nullable: true }) title?: string
  ): Promise<Ad[]> {
    const where: FindOneOptions<Ad>["where"] = {};

    if (price) {
      where.price = Between(price - 1000, price + 1000);
    }

    if (title) {
      where.title = ILike(`%${title}%`);
    }

    const key =
      "ads:" +
      crypto.createHash("SHA256").update(JSON.stringify(where)).digest("hex");

    const cache = await redis.get(key);

    if (cache) {
      console.log("Chache hit");
      return cache;
    } else {
      const ads = await Ad.find({
        relations: makeRelations(info, Ad),
        where,
      });
      await redis.set(key, ads, 60);
      console.log("Cache set");
      return ads;
    }
  }

  @Query(() => Number)
  async adsCount(): Promise<number> {
    const adsCount = await Ad.count({});
    return adsCount;
  }

  @Query(() => Ad, { nullable: true })
  async ad(
    @Arg("id", () => ID) id: number,
    @Info() info: GraphQLResolveInfo
  ): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id },
      relations: makeRelations(info, Ad),
    });
    if (ad) {
      return ad;
    } else {
      return null;
    }
  }

  @Authorized("user", "admin")
  @Mutation(() => Ad)
  async createAd(
    @Arg("data", () => AdCreateInput) data: AdCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<Ad> {
    const newAd = new Ad();
    Object.assign(newAd, data, { createdBy: context.user });

    const result = await axios.get(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
        newAd.location
      )}&type=municipality`
    );

    if (result.data.features.length === 0) {
      throw new Error(`Validation error: municipality not found in France`);
    }

    const errors = await validate(newAd);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newAd.save();

      // invalidate cache
      await redis.clearKeysStartingWith("ads");

      return newAd;
    }
  }

  @Authorized("user", "admin")
  @Mutation(() => Ad, { nullable: true })
  async updateAd(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => AdUpdateInput) data: AdUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Ad | null> {
    const whereCreatedBy =
      context.user.role === "admin"
        ? undefined
        : {
            id: context.user.id,
          };
    const ad = await Ad.findOne({
      where: { id, createdBy: whereCreatedBy },
      relations: { tags: true },
    });
    if (ad !== null) {
      merge(ad, data);

      const errors = await validate(ad);

      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await ad.save();
        // invalidate cache
        await redis.clearKeysStartingWith("ads");
        return ad;
      }
    } else {
      return null;
    }
  }

  @Authorized("user", "admin")
  @Mutation(() => Ad, { nullable: true })
  async deleteAd(
    @Arg("id", () => ID) id: number,
    @Ctx() context: AuthContextType
  ): Promise<Ad | null> {
    const whereCreatedBy =
      context.user.role === "admin"
        ? undefined
        : {
            id: context.user.id,
          };
    const ad = await Ad.findOneBy({ id, createdBy: whereCreatedBy });
    if (ad !== null) {
      await ad.remove();
      // invalidate cache
      await redis.clearKeysStartingWith("ads");
      Object.assign(ad, { id });
      return ad;
    } else {
      return null;
    }
  }
}
