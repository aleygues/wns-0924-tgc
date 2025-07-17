import { gql } from "@apollo/client";

export const mutationCreateMessage = gql`
  mutation createMessage($data: MessageCreateInput!) {
    createMessage(data: $data) {
      id
    }
  }
`;
