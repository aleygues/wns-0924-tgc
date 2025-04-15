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
      category {
        id
        name
      }
      tags {
        id
        name
      }
      createdAt
      createdBy {
        id
        email
      }
    }
  }
`);
