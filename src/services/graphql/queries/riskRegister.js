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

        createdBy {
          loginId
        }
        status {
          name
          Id
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
      createdBy {
        loginId
      }
      createdOn
      lastModifiedBy {
        loginId
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
        }
        completionDate
        forecastDate
        departmentId {
          Id
          description
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
    $id: Int!
    $status: Int!
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
        id: $id
        status: $status
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
      }
      departmentId {
        Id
        description
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
