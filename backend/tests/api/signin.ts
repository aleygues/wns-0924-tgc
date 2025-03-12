export const mutationSignin = `#graphql
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
    }
  }
`;
