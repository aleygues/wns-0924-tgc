import Cookies from "cookies";
import { verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";

export const authChecker: AuthChecker<{ req: any; res: any }> = (
  { root, args, context, info },
  roles
) => {
  // Read user from context
  // and check the user's permission against the `roles` argument
  // that comes from the '@Authorized' decorator, eg. ["ADMIN", "MODERATOR"]

  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token");

  if (!token) {
    console.log("Missing token in cookies");
    return false;
  }

  try {
    verify(token, process.env.JWT_SECRET_KEY);
    // token valid
    console.log("OK, access authorized");

    // get associated user
    // attach user to the context

    return true;
  } catch {
    // token invalid
    console.log("Invalid JWT");
    return false;
  }
};
