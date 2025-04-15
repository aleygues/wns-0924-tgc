import { gql } from "../gql";

export const queryAds = gql(/* GraphQL */ `
  query ads($offset: Int, $limit: Int, $withCount: Boolean = false) {
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
    adsCount @include(if: $withCount)
  }
`);
