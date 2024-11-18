import { gql } from "../gql";

export const queryTags = gql(/* GraphQL */ `
  query tags {
    tags {
      id
      name
    }
  }
`);
