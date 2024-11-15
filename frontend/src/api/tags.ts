import { gql } from "@apollo/client";

export const queryTags = gql`
  query tags {
    tags {
      id
      name
    }
  }
`;
