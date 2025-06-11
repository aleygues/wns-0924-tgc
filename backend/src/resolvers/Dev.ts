import { Arg, Int, Mutation, Resolver } from "type-graphql";
import { Ad } from "../entities/Ad";
import { Category } from "../entities/Category";

@Resolver()
export class DevResolver {
  @Mutation(() => Boolean)
  async devCreateAds(@Arg("count", () => Int) count: number) {
    /*     if(process.env.NODE_ENV !== "dev") {
      throw new Error('only for dev');
    } */

    const categories = await Category.find();
    const category = categories[0];

    if (!category) {
      throw new Error("you should create a category first");
    }

    for (let i = 0; i < count; i++) {
      const ad = new Ad();
      ad.title = `Ad #${i + 1}`;
      ad.location = "Somewhere";
      ad.description = "This is a super fake ad";
      ad.price = i * 100;
      ad.picture =
        "https://cdn.pixabay.com/photo/2021/07/10/10/48/e-bike-6401173_1280.jpg";
      ad.category = category;
      await ad.save();
    }

    return true;
  }
}
