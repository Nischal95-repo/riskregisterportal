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
