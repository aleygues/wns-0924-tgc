import { Field, ID, InputType } from "type-graphql";

@InputType()
export class IdInput {
  @Field(() => ID)
  id!: number;
}
