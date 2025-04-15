import { gql } from "@apollo/client";

export const mutationDeleteTag = gql`
  mutation deleteTag($id: ID!) {
    deleteTag(id: $id) {
      id
    }
  }
`;
