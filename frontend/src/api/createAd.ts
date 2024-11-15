import { gql } from "@apollo/client";

export const mutationCreateAd = gql`
  mutation createAd($data: AdCreateInput!) {
    createAd(data: $data) {
      id
    }
  }
`;
