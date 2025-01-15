import { gql } from "@apollo/client";

export const mutationSignin = gql`
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
    }
  }
`;
