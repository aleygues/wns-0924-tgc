import { gql } from "@apollo/client";

export const queryWhoami = gql`
  query Whoami {
    whoami {
      id
      email
      role
    }
  }
`;
