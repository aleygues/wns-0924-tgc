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
import { Message, MessageCreateInput } from "../entities/Message";
import { validate } from "class-validator";
import { AuthContextType } from "../auth";
import { GraphQLResolveInfo } from "graphql";
import { makeRelations } from "../utils/makeRelations";

@Resolver()
export class MessagesResolver {
  @Query(() => [Message])
  async messages(@Info() info: GraphQLResolveInfo): Promise<Message[]> {
    const messages = await Message.find({
      relations: makeRelations(info, Message),
    });
    return messages;
  }

  @Authorized("user")
  @Mutation(() => Message)
  async createMessage(
    @Arg("data", () => MessageCreateInput) data: MessageCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<Message> {
    const newMessage = new Message();
    Object.assign(newMessage, data, { createdBy: context.user });

    const errors = await validate(newMessage);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newMessage.save();
      return newMessage;
    }
  }

  @Authorized("admin")
  @Mutation(() => Message, { nullable: true })
  async deleteMessage(
    @Arg("id", () => ID) id: number,
    @Ctx() context: AuthContextType
  ): Promise<Message | null> {
    const message = await Message.findOneBy({
      id,
      createdBy: { id: context.user.id },
    });
    if (message !== null) {
      await message.remove();
      return message;
    } else {
      return null;
    }
  }
}
