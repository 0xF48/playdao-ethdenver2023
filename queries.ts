import { gql } from "@apollo/client";



export const QUESTS_QUERY = gql`
  query quests($first: int) {
    quests(first:$first) {
      items {
        h3_hex
        attach
      }
    }
  }
`;