import { gql } from "apollo-boost";
export const RISK_DETAILS = gql`
  query {
    getRiskDetailByUserId {
      total
      closed
      pending
      deviated
    }
  }
`;

export const RISK_DETAILS_FOR_CHARTS = gql`
  query {
    getRisksByCategories
    getRisksByProjects
    getRisksByCompanies
    getRisksByDepartments
  }
`;

export const RISK_PROFILE = gql`
  query($company: Int, $project: Int) {
    getRiskDetailsByCompanyAndProject(
      companyId: $company
      projectId: $project
    ) {
      distribution
      categories
    }
  }
`;
