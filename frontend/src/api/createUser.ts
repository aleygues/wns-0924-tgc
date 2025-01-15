import { gql } from "@apollo/client";

export const mutationCreateUser = gql`
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`;
