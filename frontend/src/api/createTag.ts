import { gql } from "@apollo/client";

export const mutationCreateTag = gql`
  mutation createTag($data: TagCreateInput!) {
    createTag(data: $data) {
      id
    }
  }
`;
