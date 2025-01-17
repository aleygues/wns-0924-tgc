import { IsEmail, IsUrl, Length, Max, Min } from "class-validator";
import {
  AfterInsert,
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { Tag } from "./Tag";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { IdInput } from "./Id";
import { User } from "./User";

@Entity()
@ObjectType()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @ManyToOne(
    () => {
      return Category;
    },
    (category) => category.ads
    /* { eager: true } */
  )
  @Field(() => Category)
  category!: Category;

  @ManyToMany(() => Tag, (tag) => tag.ads)
  @JoinTable()
  @Field(() => [Tag])
  tags!: Tag[];

  @Column()
  @Length(10, 100, { message: "Title must be between 10 and 100 chars" })
  @Field()
  title!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description!: string;

  @Column()
  @Field()
  location!: string;

  @Column()
  @Min(0, { message: "Price must be positive" })
  @Max(1000000, { message: "Price must be lower than 1000000 cents" })
  @Field(() => Int)
  price!: number;

  @Column()
  @IsUrl()
  @Field()
  picture!: string;

  @BeforeInsert()
  private setCreatedAt() {
    this.createdAt = new Date();
  }

  @AfterInsert()
  private sendNotification() {
    // sendNotfication()
  }

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  createdBy: User;
}

@InputType()
export class AdCreateInput {
  @Field(() => IdInput)
  category!: IdInput;

  @Field(() => [IdInput])
  tags!: IdInput[];

  @Length(10, 100, { message: "Title must be between 10 and 100 chars" })
  @Field()
  title!: string;

  @Field({ nullable: true })
  description!: string;

  @Field()
  location!: string;

  @Min(0, { message: "Price must be positive" })
  @Max(1000000, { message: "Price must be lower than 1000000 cents" })
  @Field(() => Int)
  price!: number;

  @IsUrl()
  @Field()
  picture!: string;
}

@InputType()
export class AdUpdateInput {
  @Field(() => IdInput, { nullable: true })
  category!: IdInput;

  @Field(() => [IdInput], { nullable: true })
  tags!: IdInput[];

  @Field({ nullable: true })
  title!: string;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  location!: string;

  @Field(() => Int, { nullable: true })
  price!: number;

  @Field({ nullable: true })
  picture!: string;
}
