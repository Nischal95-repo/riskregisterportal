import { gql } from "apollo-boost";

export const getUserProfileQuery = gql`
  query {
    getUserProfile {
      Id
      name
      mobileNumber
      emailId
    }
  }
`;

export const updateUserProfileQuery = gql`
  mutation($name: String, $mobileNo: String, $eventType: Int, $OTP: String) {
    updateUserProfile(
      data: { name: $name, mobileNumber: $mobileNo }
      eventType: $eventType
      OTP: $OTP
    ) {
      message
    }
  }
`;
