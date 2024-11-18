import { gql } from "../gql";

export const mutationUpdateAd = gql(/* GraphQL */ `
  mutation updateAd($data: AdUpdateInput!, $id: ID!) {
    updateAd(data: $data, id: $id) {
      id
    }
  }
`);
