import { gql } from "../gql";

export const queryAd = gql(/* GraphQL */ `
  query ad($id: ID!) {
    ad(id: $id) {
      id
      title
      description
      price
      location
      picture
      owner
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
`);
