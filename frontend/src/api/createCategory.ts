import { gql } from "../gql";

export const mutationCreateCategory = gql(/* GraphQL */ `
  mutation createCategory($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      id
    }
  }
`);
