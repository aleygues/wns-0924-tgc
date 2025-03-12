export const mutationCreateCategory = `#graphql
  mutation createCategory($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      id
    }
  }
`;
