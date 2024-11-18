import { gql } from "../gql";

export const mutationDeleteAd = gql(/* GraphQL */ `
  mutation deleteAd($id: ID!) {
    deleteAd(id: $id) {
      id
    }
  }
`);
