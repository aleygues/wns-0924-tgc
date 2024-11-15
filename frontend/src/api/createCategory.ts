import { gql } from "@apollo/client";

export const mutationCreateCategory = gql`
  mutation createCategory($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      id
    }
  }
`;
