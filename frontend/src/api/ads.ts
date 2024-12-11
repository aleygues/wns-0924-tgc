import { gql } from "../gql";

export const queryAds = gql(/* GraphQL */ `
  query ads($offset: Int, $limit: Int, $withCount: Boolean = false) {
    ads(offset: $offset, limit: $limit) {
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
    adsCount @include(if: $withCount)
  }
`);
