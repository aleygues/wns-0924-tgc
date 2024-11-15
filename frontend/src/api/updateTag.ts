import { gql } from "@apollo/client";

export const mutationUpdateTag = gql`
  mutation updateTag($data: TagUpdateInput!, $id: ID!) {
    updateTag(data: $data, id: $id) {
      id
    }
  }
`;
