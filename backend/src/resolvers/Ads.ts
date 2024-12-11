import { Arg, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import {
  Ad,
  AdCreateInput,
  AdsWhereInput,
  AdUpdateInput,
} from "../entities/Ad";
import { validate } from "class-validator";
import { merge } from "../utils/merge";
import {
  And,
  FindManyOptions,
  FindOptionsWhere,
  In,
  LessThan,
  Like,
  MoreThan,
} from "typeorm";

@Resolver()
export class AdsResolver {
  @Query(() => [Ad])
  async ads(
    @Arg("limit", () => Int, { nullable: true }) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number,
    @Arg("where", () => AdsWhereInput, { nullable: true }) where: AdsWhereInput
   // @Arg("orderBy")
  ): Promise<Ad[]> {
    const filter: any = {};

    if (where.category) {
      filter.category = {
        id: where.category.id,
      };
    }

    if (where.tags) {
      filter.tags = {
        id: In(where.tags.map((entry) => entry.id)),
      };
    }

    if (where.price) {
      if (where.price.max && where.price.min) {
        filter.price = And(
          MoreThan(where.price.min),
          LessThan(where.price.max)
        );
      } else if (where.price.max) {
        filter.price = LessThan(where.price.max);
      } else if (where.price.min) {
        filter.price = MoreThan(where.price.min);
      }
    }

    if(where.title) {
      filter.title = Like(`%${where.title}%`)
    }

    const ads = await Ad.find({
      relations: {
        category: true,
        tags: true,
      },
      where: filter,
      take: limit,
      skip: offset,
      order: {
        category.title
      }
    });
    return ads;
  }

  @Query(() => Number)
  async adsCount(): Promise<number> {
    const adsCount = await Ad.count({});
    return adsCount;
  }

  @Query(() => Ad, { nullable: true })
  async ad(@Arg("id", () => ID) id: number): Promise<Ad | null> {
    const ad = await Ad.findOne({
      where: { id },
      relations: {
        category: true,
        tags: true,
      },
    });
    if (ad) {
      return ad;
    } else {
      return null;
    }
  }

  @Mutation(() => Ad)
  async createAd(
    @Arg("data", () => AdCreateInput) data: AdCreateInput
  ): Promise<Ad> {
    const newAd = new Ad();
    Object.assign(newAd, data);

    const errors = await validate(newAd);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newAd.save();
      return newAd;
    }
  }

  @Mutation(() => Ad, { nullable: true })
  async updateAd(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => AdUpdateInput) data: AdUpdateInput
  ): Promise<Ad | null> {
    const ad = await Ad.findOne({ where: { id }, relations: { tags: true } });
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

  @Mutation(() => Ad, { nullable: true })
  async deleteAd(@Arg("id", () => ID) id: number): Promise<Ad | null> {
    const ad = await Ad.findOneBy({ id });
    if (ad !== null) {
      await ad.remove();
      Object.assign(ad, { id });
      return ad;
    } else {
      return null;
    }
  }
}
