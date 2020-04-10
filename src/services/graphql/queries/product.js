import { gql } from "apollo-boost";

export const getListofStatusQuery = gql`
  query($statusFor: String) {
    getListofStatus(statusFor: $statusFor) {
      Id
      statusFor
      statusId
      name
    }
  }
`;
