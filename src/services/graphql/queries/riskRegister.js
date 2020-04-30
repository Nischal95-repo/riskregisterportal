import { gql } from "apollo-boost";

export const RISK_REGISTER = gql`
  query(
    $riskId: [Int]
    $companyId: [Int]
    $projectId: [Int]
    $riskCategory: [Int]
    $status: Int
    $deviated: Boolean
    $responsible: [Int]
    $noOfRows: Int
    $pageNumber: Int
  ) {
    getListOfRisk(
      id: $riskId
      company: $companyId
      project: $projectId
      riskCategory: $riskCategory
      status: $status
      deviated: $deviated
      responsible: $responsible
      noOfRows: $noOfRows
      pageNumber: $pageNumber
    ) {
      id
      name
      severity
      status
      categoryId {
        description
      }
      companyId {
        description
      }
      projectId {
        description
      }

      mitigationplanSet {
        id
        name
        responsible {
          loginId
        }
        departmentId {
          Id
          description
        }
        createdBy {
          loginId
        }
        status {
          name
          Id
          statusId
        }
        completionDate
        forecastDate
      }
    }
  }
`;

export const CREATE_RISK_REGISTER = gql`
  mutation(
    $name: String!
    $company: Int!
    $riskCategory: Int!
    $impact: Int!
    $project: Int!
    $description: String!
    $probability: Int!
    $upsidePotential: String
    $currentControls: String
    $severity: Int!
  ) {
    createRisk(
      data: {
        name: $name
        companyId: $company
        categoryId: $riskCategory
        impact: $impact
        projectId: $project
        description: $description
        probability: $probability
        upsidePotential: $upsidePotential
        currentControls: $currentControls
        severity: $severity
      }
    ) {
      risk {
        id
      }
    }
  }
`;

export const RISK_DETAIL = gql`
  query($id: Int) {
    getRiskById(id: $id) {
      id
      name
      severity
      status

      categoryId {
        Id
        description
      }
      companyId {
        Id
        description
      }
      projectId {
        Id
        description
      }
      description
      upsidePotential
      currentControls
      residualSeverity
      residualProbability
      residualImpact
      createdBy {
        loginId
      }
      createdOn
      lastModifiedBy {
        loginId
      }
      canEdit {
        canEdit
      }
      riskregisterattachmentSet {
        url
        id
      }
      lastModifiedOn
      impact
      probability

      mitigationplanSet {
        id
        name
        responsible {
          loginId
        }

        createdBy {
          loginId
        }
        status {
          name
          Id
          statusId
        }
        completionDate
        forecastDate
        departmentId {
          Id
          description
        }
        canEdit {
          canEdit
          canEditMitigationActivity
          canApprove
        }
      }
    }
  }
`;

export const UPDATE_RISK_REGISTER = gql`
  mutation(
    $name: String!
    $company: Int!
    $riskCategory: Int!
    $impact: Int!
    $project: Int!
    $description: String!
    $probability: Int!
    $upsidePotential: String
    $currentControls: String
    $id: Int!
    $status: Int!
    $severity: Int!
    $residualImpact: Int
    $residualProbability: Int
    $residualSeverity: Int
  ) {
    updateRisk(
      data: {
        name: $name
        companyId: $company
        categoryId: $riskCategory
        impact: $impact
        projectId: $project
        description: $description
        probability: $probability
        upsidePotential: $upsidePotential
        currentControls: $currentControls
        id: $id
        status: $status
        severity: $severity
        residualImpact: $residualImpact
        residualSeverity: $residualSeverity
        residualProbability: $residualProbability
      }
    ) {
      message
    }
  }
`;

export const GET_LIST_OF_MITIGATIONS = gql`
  query($id: Int) {
    getListOfMitigationPlansById(riskId: $id) {
      id
      name
      completionDate
      responsible {
        loginId
      }
      departmentId {
        description
      }
      forecastDate
      status {
        name
        Id
        statusId
      }
      departmentId {
        Id
        description
      }
      canEdit {
        canEdit
        canEditMitigationActivity
        canApprove
      }
    }
  }
`;

export const CREATE_MITIGATION = gql`
  mutation(
    $name: String!
    $department: Int!
    $responsible: Int!
    $completionDate: Date!
    $riskId: Int!
  ) {
    createMitigation(
      data: {
        name: $name
        responsible: $responsible
        department: $department
        riskId: $riskId
        completionDate: $completionDate
      }
    ) {
      mitigation {
        id
      }
    }
  }
`;

// mutation($description:String!riskId:Int!responsible:Int!completionDate:Date!){
//   createMitigation(data:{
//     name:$description
//     responsible:$responsible
//     department:$department
//     riskId:$riskId
//   }){
//     id
//   }
// }

export const GET_LIST_OF_EMPLOYEES = gql`
  query($riskId: Int) {
    getListOfEmployeesForRisk(riskId: $riskId) {
      id
      userId {
        loginId
      }
      riskId {
        name
      }
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation($userId: [Int]!, $riskId: Int!) {
    addRiskEmployee(data: { userId: $userId, riskId: $riskId }) {
      message
    }
  }
`;

export const REMOVE_EMPLOYEE = gql`
  mutation($id: String!) {
    removeRiskEmployee(id: $id) {
      message
    }
  }
`;

export const CREATE_MITIGATION_ACTIVITY = gql`
  mutation(
    $name: String!
    $mitigationPlanId: Int!
    $status: Int
    $forecastDate: Date
    $department: Int
    $responsible: Int
  ) {
    addMitigationActivities(
      data: {
        remarks: $name
        mitigationPlanId: $mitigationPlanId
        status: $status
        forecastDate: $forecastDate
        responsible: $responsible
        department: $department
      }
    ) {
      activity {
        id
      }
    }
  }
`;

export const GET_LIST_OF_ACTIVITIES = gql`
  query($mitigationPlanId: Int!) {
    getListOfMitigationActivities(mitigationPlanId: $mitigationPlanId) {
      id
      remarks

      createdByDetail {
        name
      }
      createdOn
      status {
        name
      }
    }
  }
`;

export const GET_MITIGATION_PLAN_BY_ID = gql`
  query($id: Int!) {
    getMitigationPlanById(id: $id) {
      id
      name
      departmentId {
        description
      }
      status {
        name
      }
      responsible {
        loginId
      }
      completionDate
      forecastDate
      lastModifiedBy {
        loginId
      }
      lastModifiedOn
      createdBy {
        loginId
      }
      canEdit {
        canEdit
        canEditMitigationActivity
        canApprove
      }
      createdOn
    }
  }
`;

export const CREATE_RISK_ATTACHMENT = gql`
  mutation($riskId: Int, $data: [CreateRiskAttachmentInputType]!) {
    createRiskAttachment(riskId: $riskId, data: $data) {
      message
    }
  }
`;

export const DELETE_RISK_ATTACHMENT = gql`
  mutation($attachmentId: String!) {
    deleteRiskAttachment(attachmentId: $attachmentId) {
      message
    }
  }
`;

export const DOWNLOAD_RISK_ATTACHMENT = gql`
  mutation($attachmentId: String!, $versionNo: Int!) {
    downloadAttachment(attachmentId: $attachmentId, versionNo: $versionNo) {
      fileData
      fileName
    }
  }
`;

export const CREATE_MITIGATION_ATTACHMENT = gql`
  mutation(
    $mitigationPlanId: Int!
    $data: [CreateMitigationAttachmentInputType]!
  ) {
    createMitigationAttachment(
      mitigationPlanId: $mitigationPlanId

      data: $data
    ) {
      message
    }
  }
`;

export const DELETE_MITIGATION_ATTACHMENT = gql`
  mutation($attachmentId: String!) {
    deleteMitigationAttachment(attachmentId: $attachmentId) {
      message
    }
  }
`;

export const DOWNLOAD_MITIGATION_ATTACHMENT = gql`
  mutation($attachmentId: String!, $versionNo: Int!) {
    downloadAttachment(attachmentId: $attachmentId, versionNo: $versionNo) {
      fileData
      fileName
    }
  }
`;

export const RISK_ATTACHMENTS = gql`
  query($riskId: Int) {
    getListOfAttachmentsByRiskId(riskId: $riskId) {
      url
      id
    }
  }
`;

export const MITIGATION_ATTACHMENTS = gql`
  query($mitigationPlanId: Int) {
    getListOfAttachmentsByMitigationPlanId(
      mitigationPlanId: $mitigationPlanId
    ) {
      url
      id
    }
  }
`;
