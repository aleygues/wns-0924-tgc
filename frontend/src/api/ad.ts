import { gql } from "@apollo/client";

export const queryAd = gql`
  query ad($id: ID!) {
    ad(id: $id) {
      id
      title
      price
      description
      category {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;
