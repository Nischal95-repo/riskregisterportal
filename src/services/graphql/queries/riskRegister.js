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
