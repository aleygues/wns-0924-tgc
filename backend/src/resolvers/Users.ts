import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { validate } from "class-validator";
import { User, UserCreateInput } from "../entities/User";
import { hash, verify } from "argon2";
import { sign } from "jsonwebtoken";
import Cookies from "cookies";
import { ContextType } from "../auth";

@Resolver()
export class UsersResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User> {
    // for user, we have to validate the data input (because of password & hashed password)
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

    const newUser = new User();

    try {
      const hashedPassword = await hash(data.password);
      Object.assign(newUser, data, {
        hashedPassword,
        password: undefined,
      });
      await newUser.save();

      // send email for validation

      return newUser;
    } catch (e) {
      console.error(e);
      throw new Error("unable to create user");
    }
  }

  @Mutation(() => User, { nullable: true })
  async signin(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() context: ContextType
  ): Promise<User> {
    // search user by email
    // compare passwords using argon2
    try {
      const user = await User.findOneBy({
        email,
      });

      if (user) {
        if (await verify(user.hashedPassword, password)) {
          // generate JWT
          const token = sign(
            {
              id: user.id,
            },
            process.env.JWT_SECRET_KEY
          );

          if (process.env.NODE_ENV !== "testing") {
            const cookies = new Cookies(context.req, context.res);

            cookies.set("token", token, {
              secure: false,
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 72,
            });
          }

          return user;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async signout(@Ctx() context: ContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", { maxAge: 0 });
    return true;
  }

  @Query(() => User, { nullable: true })
  async whoami(@Ctx() context: ContextType): Promise<User | null> {
    // user has already been added to context by the global middleware (see index.ts)
    return context.user;
  }
}
