import { gql } from "apollo-boost";

export const GET_LIST_OF_ACTIVE_USERS = gql`
  query getListOfActiveUsers(
    $emailId: String
    $offset: Int
    $noOfRows: Int
    $portalType: Int
  ) {
    getListOfActiveUsers(
      emailId: $emailId
      offset: $offset
      NoOfRows: $noOfRows
      portalType: $portalType
    )
  }
`;

export const GET_LIST_OF_SESSION_HISTORY = gql`
  query getListOfSessionHistory(
    $emailId: String
    $offset: Int
    $noOfRows: Int
    $date: Date
    $portalType: Int
  ) {
    getListOfSessionHistory(
      emailId: $emailId
      offset: $offset
      NoOfRows: $noOfRows
      date: $date
      portalType: $portalType
    )
  }
`;
