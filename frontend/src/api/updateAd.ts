import { gql } from "@apollo/client";

export const mutationUpdateAd = gql`
  mutation updateAd($data: AdUpdateInput!, $id: ID!) {
    updateAd(data: $data, id: $id) {
      id
    }
  }
`;
