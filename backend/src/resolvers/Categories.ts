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
import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "../entities/Category";
import { validate } from "class-validator";
import { GraphQLResolveInfo } from "graphql";
import { makeRelations } from "../utils/makeRelations";
import { In } from "typeorm";
import { AuthContextType, ContextType } from "../auth";

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
        createdBy: true,
      },
    });
    if (category) {
      return category;
    } else {
      return null;
    }
  }

  @Authorized()
  @Mutation(() => Category)
  async createCategory(
    @Arg("data", () => CategoryCreateInput) data: CategoryCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<Category> {
    const newCategory = new Category();
    const user = context.user;
    Object.assign(newCategory, data, { createdBy: user });

    const errors = await validate(newCategory);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newCategory.save();
      return newCategory;
    }
  }

  @Authorized()
  @Mutation(() => Category, { nullable: true })
  async updateCategory(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => CategoryUpdateInput) data: CategoryUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Category | null> {
    const category = await Category.findOneBy({
      id,
      createdBy: { id: context.user.id },
    });
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

  @Authorized()
  @Mutation(() => Category, { nullable: true })
  async deleteCategory(
    @Arg("id", () => ID) id: number,
    @Ctx() context: AuthContextType
  ): Promise<Category | null> {
    const category = await Category.findOneBy({
      id,
      createdBy: { id: context.user.id },
    });
    if (category !== null) {
      await category.remove();
      category.id = id;
      return category;
    } else {
      return null;
    }
  }

  @Authorized()
  @Mutation(() => [Category])
  async deleteCategories(
    @Arg("ids", () => [ID]) ids: number[],
    @Ctx() context: AuthContextType
  ): Promise<Category[]> {
    const categories = await Category.findBy({
      id: In(ids),
      createdBy: { id: context.user.id },
    });
    await Category.delete({
      id: In(ids),
    });
    return categories;
  }
}
