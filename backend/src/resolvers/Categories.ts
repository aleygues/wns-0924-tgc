import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Category } from "../entities/Category";

@Resolver()
export class CategoriesResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    const categories = await Category.find();
    return categories;
  }

  @Query(() => Category, { nullable: true })
  async category(@Arg("id", () => ID) id: number): Promise<Category | null> {
    const category = await Category.findOne({
      where: { id },
      relations: {
        ads: {
          tags: true,
        },
      },
    });
    if (category) {
      return category;
    } else {
      return null;
    }
  }

  @Mutation(() => Category)
  async createCategory(@Arg("name") name: string): Promise<Category> {
    const newCategory = new Category();
    newCategory.name = name;
    await newCategory.save();
    return newCategory;
  }
}
