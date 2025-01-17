import Cookies from "cookies";
import { verify } from "jsonwebtoken";
import { AuthChecker, MiddlewareFn } from "type-graphql";
import { User } from "./entities/User";

export type ContextType = { req: any; res: any; user: User | null | undefined };
export type AuthContextType = ContextType & { user: User };

export async function getUserFromContext(
  context: ContextType
): Promise<User | null> {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token");

  if (!token) {
    console.log("Missing token in cookies");
    return null;
  }

  try {
    const payload = verify(token, process.env.JWT_SECRET_KEY) as unknown as {
      id: number;
    };

    // token valid
    console.log("OK, access authorized");

    // get associated user
    const user = await User.findOneBy({
      id: payload.id,
    });

    return user;
  } catch {
    // token invalid
    console.log("Invalid JWT");
    return null;
  }
}

export const authChecker: AuthChecker<ContextType> = async (
  { root, args, context, info },
  roles
) => {
  console.log("Auth Checker");
  // @Authorized(["admin", "user"]) → roles = ["admin", "user"]
  // @Authorized() → roles = []
  // if the roles are omitted, should be consider as an admin autorization → least privileges security concern
  if (roles.length === 0) {
    roles = ["admin"];
  }

  // user has already been put in context (if found) by the global middleware (see index.ts)
  const user = context.user;
  if (user && roles.includes(user.role)) {
    return true;
  } else {
    return false;
  }
};
