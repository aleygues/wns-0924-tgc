import { gql } from "@apollo/client";

export const queryAds = gql`
  query ads {
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
`;
