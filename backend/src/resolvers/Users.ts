import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { validate } from "class-validator";
import { User, UserCreateInput } from "../entities/User";
import { hash, verify } from "argon2";
import { sign, verify as jwtVerify, decode } from "jsonwebtoken";
import Cookies from "cookies";

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
    @Ctx() context: { req: any; res: any }
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

          /* try {
            const payload = jwtVerify(token, process.env.JWT_SECRET_KEY);
            console.log("OK", payload);
          } catch {
            console.log("KO");
          } */

          const cookies = new Cookies(context.req, context.res);

          cookies.set("token", token, {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 72,
          });

          return user;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      throw new Error("unable to sign in");
    }
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async whoami(@Ctx() context: { req: any; res: any; user: User }) {
    const cookies = new Cookies(context.req, context.res);
    const token = cookies.get("token");
    const payload = decode(token) as unknown as { id: number };
    const user = await User.findOneBy({
      id: payload.id,
    });
    return user;
  }
}
