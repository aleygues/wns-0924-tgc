import { gql } from "@apollo/client";

export const queryCategory = gql`
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
`;
