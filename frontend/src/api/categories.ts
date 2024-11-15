import { gql } from "@apollo/client";

export const queryCategories = gql`
  query categories {
    categories {
      id
      name
    }
  }
`;
