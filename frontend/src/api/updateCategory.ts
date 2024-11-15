import { gql } from "@apollo/client";

export const mutationUpdateCategory = gql`
  mutation updateCategory($data: CategoryUpdateInput!, $id: ID!) {
    updateCategory(data: $data, id: $id) {
      id
    }
  }
`;
