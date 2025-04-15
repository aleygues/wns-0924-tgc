import { gql } from "../gql";

export const queryCategory = gql(/* GraphQL */ `
  query category($id: ID!) {
    category(id: $id) {
      id
      name
      ads {
        id
        title
        picture
        title
        price
        description
        location
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
  }
`);
