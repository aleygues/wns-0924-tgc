import { gql } from "@apollo/client";

export const mutationDeleteCategory = gql`
  mutation deleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`;
