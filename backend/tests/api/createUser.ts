export const mutationCreateUser = `#graphql
  mutation createUser($data: UserCreateInput!) {
    createUser(data: $data) {
      id
    }
  }
`;
