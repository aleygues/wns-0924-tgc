export const mutationCreateAd = `#graphql
  mutation createAd($data: AdCreateInput!) {
    createAd(data: $data) {
      id
    }
  }
`;
