import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Info,
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

@Resolver()
export class AdsResolver {
  @Query(() => [Ad])
  async ads(@Info() info: GraphQLResolveInfo): Promise<Ad[]> {
    const ads = await Ad.find({
      relations: makeRelations(info, Ad),
    });
    return ads;
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

    const errors = await validate(newAd);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newAd.save();
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
        console.log(ad);
        await ad.save();
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
      Object.assign(ad, { id });
      return ad;
    } else {
      return null;
    }
  }
}
