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

// this middleware ensure that only admin and self user may see some personnal info
// note: root is the currently resolving user
export const IsUser: MiddlewareFn<AuthContextType> = async (
  { context, root },
  next
) => {
  if (context.user.role === "admin" || context.user.id === root.id) {
    return await next();
  } else {
    return null;
  }
};

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ unique: true })
  @Field({ nullable: true }) // this should be nullable because only admins + self user may see this, null otherwise
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
