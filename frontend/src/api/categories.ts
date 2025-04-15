import { gql } from "../gql";

export const queryCategories = gql(/* GraphQL */ `
  query categories {
    categories {
      id
      name
      createdAt
      createdBy {
        id
        email
      }
    }
  }
`);
