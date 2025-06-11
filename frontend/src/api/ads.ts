import { gql } from "../gql";

export const queryAds = gql(/* GraphQL */ `
  query ads($withCount: Boolean = false, $title: String) {
    ads(title: $title) {
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
