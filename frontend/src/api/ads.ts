import { gql } from "../gql";

export const queryAds = gql(/* GraphQL */ `
  query ads {
    ads {
      id
      title
      picture
      title
      price
      description
      owner
      location
      tags {
        id
        name
      }
    }
  }
`);
