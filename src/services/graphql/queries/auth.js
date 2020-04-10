import { gql } from "apollo-boost";

export const VERIFY_TOKEN = gql`
  mutation verifyToken($token: String!) {
    verifyToken(token: $token) {
      message
    }
  }
`;

export const GOOGLE_AUTHENTICATION = gql`
  mutation googleAuthentication(
    $token: String
    $userAgent: String
    $ipAddress: String
    $portalType: String
  ) {
    googleAuthentication(
      token: $token
      userAgent: $userAgent
      ipAddress: $ipAddress
      portalType: $portalType
    ) {
      token
    }
  }
`;

export const ACTIVATION_TOKEN = gql`
  mutation verifyActivationToken($token: String!, $portal: String!) {
    verifyActivationToken(token: $token, portal: $portal) {
      message
      userType
    }
  }
`;

export const RESEND_OTP = gql`
  mutation resendOTP($token: String!) {
    resendOTP(token: $token) {
      message
    }
  }
`;

export const ACTIVATION_USER = gql`
  mutation verifyUser(
    $token: String!
    $password: String!
    $otp: String!
    $eventType: Int!
  ) {
    verifyUser(
      password: $password
      token: $token
      otp: $otp
      eventType: $eventType
    ) {
      message
    }
  }
`;

export const Logout = gql`
  mutation logout($logoutBy: Int!) {
    logout(logoutBy: $logoutBy) {
      message
    }
  }
`;

export const AUTHENTICATE_USER = gql`
  mutation authenticateUser(
    $emailId: String!
    $password: String!
    $ipAddress: String
    $userAgent: String
  ) {
    authenticateUser(
      emailId: $emailId
      password: $password
      ipAddress: $ipAddress
      userAgent: $userAgent
    ) {
      token
      name
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation resetPassword($emailAddress: String!, $portalType: Int) {
    resetPassword(emailAddress: $emailAddress, portalType: $portalType) {
      message
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $token: String!
    $password: String!
    $oldPassword: String
  ) {
    changePassword(
      password: $password
      token: $token
      oldPassword: $oldPassword
    ) {
      message
    }
  }
`;
