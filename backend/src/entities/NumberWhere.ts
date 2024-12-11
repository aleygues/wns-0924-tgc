import { Field, InputType } from "type-graphql";

@InputType()
export class NumberWhereInput {
  @Field({ nullable: true })
  min: number;

  @Field({ nullable: true })
  max: number;
}
