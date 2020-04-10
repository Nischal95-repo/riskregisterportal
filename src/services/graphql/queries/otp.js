import { gql } from "apollo-boost";
export const sendOTP = gql`
  mutation sendOTP($mobileNumber: String!) {
    sendOTP(mobileNumber: $mobileNumber) {
      message
    }
  }
`;
