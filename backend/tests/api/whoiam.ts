export const queryWhoami = `#graphql
  query Whoami {
    whoami {
      id
      email
      role
    }
  }
`;
