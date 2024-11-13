import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Picture {
  @Field(() => ID)
  id: number;

  @Field()
  url: string;

  @Field(() => Int, { nullable: true })
  index: number;
}
