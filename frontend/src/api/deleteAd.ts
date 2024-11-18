import { gql } from "@apollo/client";

export const mutationDeleteAd = gql`
  mutation deleteAd($id: ID!) {
    deleteAd(id: $id) {
      id
    }
  }
`;
