import { IsEmail, IsStrongPassword } from "class-validator";
import {
  Field,
  ID,
  InputType,
  MiddlewareFn,
  ObjectType,
  UseMiddleware,
} from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AuthContextType } from "../auth";

export const IsUser: MiddlewareFn<AuthContextType> = async (
  { info, context, root },
  next
) => {
  console.log(root, context.user);
  // root.id === context.user.id → accept to read email
  // cannot read email
  await next();
};

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ unique: true })
  @Field()
  @UseMiddleware(IsUser)
  email: string;

  @Column()
  hashedPassword: string;

  @Column({ enum: ["user", "admin"], default: "user" })
  @Field()
  role: string; // "user" | "admin"

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  // may be needed if user can create other users
  /* @ManyToOne(() => User)
  @Field(() => User)
  createdBy: User; */
}

@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsStrongPassword()
  password!: string;
}
