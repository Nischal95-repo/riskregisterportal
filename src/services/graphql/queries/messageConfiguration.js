import { gql } from "apollo-boost";

export const getListofMessageMaster = gql`
  query($noOfRows: Int, $offset: Int) {
    getListofMessageMaster(NoOfRows: $noOfRows, offset: $offset) {
      description
      Id
    }
  }
`;

export const updateMessageConfiguration = gql`
  mutation updateMessageConfiguration(
    $priority: Int
    $subject: String
    $msgTemplate: String
    $id: String!
  ) {
    updateMessageConfiguration(
      data: {
        priority: $priority
        subject: $subject
        msgTemplate: $msgTemplate
      }
      id: $id
    ) {
      message
    }
  }
`;

export const getMessageMasterById = gql`
  query($id: Int) {
    getMessageMasterById(id: $id) {
      Id
      description
      bySMS
      byEMAIL
      byAPP
    }
  }
`;

export const getMessage = gql`
  query($messageId: Int!, $deliveryMode: String!) {
    getMessage(messageId: $messageId, deliveryMode: $deliveryMode) {
      Id
      priority
      subject
      msgTemplate
    }
  }
`;
