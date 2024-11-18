import { gql } from "../gql";

export const mutationUpdateCategory = gql(/* GraphQL */ `
  mutation updateCategory($data: CategoryUpdateInput!, $id: ID!) {
    updateCategory(data: $data, id: $id) {
      id
    }
  }
`);
