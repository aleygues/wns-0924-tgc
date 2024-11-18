import { gql } from "../gql";

export const mutationCreateAd = gql(/* GraphQL */ `
  mutation createAd($data: AdCreateInput!) {
    createAd(data: $data) {
      id
    }
  }
`);
