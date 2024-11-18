import { gql } from "../gql";

export const mutationCreateTag = gql(/* GraphQL */ `
  mutation createTag($data: TagCreateInput!) {
    createTag(data: $data) {
      id
    }
  }
`);
