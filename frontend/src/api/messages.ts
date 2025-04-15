import { gql } from "@apollo/client";

export const queryMessages = gql`
  query messages($adId: ID!) {
    messages(adId: $adId) {
      id
      content
      createdAt
      createdBy {
        id
        email
      }
    }
  }
`;
