import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ad } from "./Ad";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Length } from "class-validator";

// like { createdAt user }
@ObjectType()
class CategoryLike {
  @Field()
  createdAt: Date;

  @Field()
  user: string;
}

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Length(10, 100, { message: "Name must be between 10 and 100 chars" })
  @Field()
  name!: string;

  @OneToMany(() => Ad, (ad) => ad.category)
  @Field(() => [Ad])
  ads!: Ad[];

  @Field(() => [CategoryLike])
  likes() {
    console.log("Computed");
    return [
      {
        createdAt: new Date(),
        user: "Aurélien",
      },
    ];
  }
}

@InputType()
export class CategoryCreateInput {
  @Field()
  name!: string;
}

@InputType()
export class CategoryUpdateInput {
  @Field({ nullable: true })
  name!: string;
}
