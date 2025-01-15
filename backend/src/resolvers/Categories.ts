import { Arg, ID, Info, Mutation, Query, Resolver } from "type-graphql";
import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "../entities/Category";
import { validate } from "class-validator";
import { GraphQLResolveInfo } from "graphql";
import { makeRelations } from "../utils/makeRelations";
import { In } from "typeorm";

function hasRelation(info: GraphQLResolveInfo, relationName: string) {
  const selections = info.fieldNodes[0].selectionSet.selections;
  for (const selection of selections) {
    if (selection.kind === "Field" && selection.name.value === relationName) {
      return true;
    }
  }
  return false;
}

@Resolver()
export class CategoriesResolver {
  @Query(() => [Category])
  async categories(@Info() info: GraphQLResolveInfo): Promise<Category[]> {
    const categories = await Category.find({
      relations: makeRelations(info, Category),
    });
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
  async createCategory(
    @Arg("data", () => CategoryCreateInput) data: CategoryCreateInput
  ): Promise<Category> {
    const newCategory = new Category();
    Object.assign(newCategory, data);

    // shoud add some logic here
    // to attach createdBy prop

    const errors = await validate(newCategory);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newCategory.save();
      return newCategory;
    }
  }

  @Mutation(() => Category, { nullable: true })
  async updateCategory(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => CategoryUpdateInput) data: CategoryUpdateInput
  ): Promise<Category | null> {
    const category = await Category.findOneBy({ id });
    if (category !== null) {
      Object.assign(category, data);

      const errors = await validate(category);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await category.save();
        return category;
      }
    } else {
      return null;
    }
  }

  @Mutation(() => Category, { nullable: true })
  async deleteCategory(
    @Arg("id", () => ID) id: number
  ): Promise<Category | null> {
    const category = await Category.findOneBy({ id });
    if (category !== null) {
      await category.remove();
      return category;
    } else {
      return null;
    }
  }

  @Mutation(() => [Category])
  async deleteCategories(
    @Arg("ids", () => [ID]) ids: number[]
  ): Promise<Category[]> {
    const categories = await Category.findBy({ id: In(ids) });
    await Category.delete({
      id: In(ids),
    });
    return categories;
  }
}
