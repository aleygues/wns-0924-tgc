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
import { Tag, TagCreateInput, TagUpdateInput } from "../entities/Tag";
import { validate } from "class-validator";
import { AuthContextType } from "../auth";
import { GraphQLResolveInfo } from "graphql";
import { makeRelations } from "../utils/makeRelations";

@Resolver()
export class TagsResolver {
  @Query(() => [Tag])
  async tags(@Info() info: GraphQLResolveInfo): Promise<Tag[]> {
    const tags = await Tag.find({
      relations: makeRelations(info, Tag),
    });
    return tags;
  }

  @Query(() => Tag, { nullable: true })
  async tag(
    @Arg("id", () => ID) id: number,
    @Info() info: GraphQLResolveInfo
  ): Promise<Tag | null> {
    const tag = await Tag.findOne({
      where: { id },
      relations: makeRelations(info, Tag),
    });
    if (tag) {
      return tag;
    } else {
      return null;
    }
  }

  @Authorized("admin")
  @Mutation(() => Tag)
  async createTag(
    @Arg("data", () => TagCreateInput) data: TagCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<Tag> {
    const newTag = new Tag();
    Object.assign(newTag, data, { createdBy: context.user });

    const errors = await validate(newTag);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newTag.save();
      return newTag;
    }
  }

  @Authorized("admin")
  @Mutation(() => Tag, { nullable: true })
  async updateTag(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => TagUpdateInput) data: TagUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Tag | null> {
    const tag = await Tag.findOneBy({ id, createdBy: { id: context.user.id } });
    if (tag !== null) {
      Object.assign(tag, data);

      const errors = await validate(tag);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await tag.save();
        return tag;
      }
    } else {
      return null;
    }
  }

  @Authorized("admin")
  @Mutation(() => Tag, { nullable: true })
  async deleteTag(
    @Arg("id", () => ID) id: number,
    @Ctx() context: AuthContextType
  ): Promise<Tag | null> {
    const tag = await Tag.findOneBy({ id, createdBy: { id: context.user.id } });
    if (tag !== null) {
      await tag.remove();
      return tag;
    } else {
      return null;
    }
  }
}
