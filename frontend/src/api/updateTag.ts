import { gql } from "../gql";

export const mutationUpdateTag = gql(/* GraphQL */ `
  mutation updateTag($data: TagUpdateInput!, $id: ID!) {
    updateTag(data: $data, id: $id) {
      id
    }
  }
`);
