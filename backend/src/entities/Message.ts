import {
  AfterInsert,
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ad } from "./Ad";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { User } from "./User";
import { sendMessage } from "../socket";

@Entity()
@ObjectType()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column()
  @Field()
  content!: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  createdBy: User;

  @AfterInsert()
  sendMessage() {
    console.log("Should send a message");
    sendMessage("message", this);
  }
}

@InputType()
export class MessageCreateInput {
  @Field()
  content!: string;
}
