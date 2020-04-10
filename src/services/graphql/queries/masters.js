import { gql } from "apollo-boost";
export const getListofMasterQuery = gql`
  query($offset: Int, $pageNo: Int, $descriptionName: String) {
    getListofMaster(
      NoOfRows: $offset
      offset: $pageNo
      descriptionName: $descriptionName
    ) {
      Id
      description
      allowmastersEntry
      allowforStatus
    }
  }
`;
export const getListofStatusQuery = gql`
  query($statusFor: String) {
    getListofStatus(statusFor: $statusFor) {
      Id
      statusId
      name
    }
  }
`;
//------------------------------------------

export const getTicketCategoriesQuery = gql`
  query(
    $offset: Int
    $pageNo: Int
    $categoryCode: String
    $desc: String
    $status: Int
  ) {
    ticketCategories(
      NoOfRows: $offset
      offset: $pageNo
      categoryCode: $categoryCode
      desc: $desc
      status: $status
    ) {
      Id
      description
      status
    }
  }
`;

export const createTicketCategoriesQuery = gql`
  mutation CreateTicketCategories(
    $categoryCode: String!
    $description: String!
  ) {
    createTicketCategories(
      data: { categoryCode: $categoryCode, description: $description }
    ) {
      ticketCategories {
        Id
        description
        status
      }
    }
  }
`;
export const UpdateTicketCategoriesQuery = gql`
  mutation UpdateTicketCategories(
    $Id: String!
    $description: String!
    $status: Int!
  ) {
    updateTicketCategories(
      id: $Id
      data: { description: $description, status: $status }
    ) {
      message
    }
  }
`;
// export const getTicketCategoryQuery = gql`
//   query($Id: String) {
//     getTicketCategoryById(id: $Id) {
//       Id
//       description
//       status
//       createdBy
//       createdOn
//       statusDetail {
//         Id
//         name
//       }
//       createdDetail {
//         Id
//         loginId
//       }
//     }
//   }
// `;
export const getTicketCategoryQuery = gql`
  query($Id: String) {
    getTicketCategoryById(id: $Id)
  }
`;
// --------------------------------------------------
export const getTicketSubCategoryQuery = gql`
  query($offset: Int, $pageNo: Int, $categoryId: String!, $status: Int) {
    ticketSubCategory(
      NoOfRows: $offset
      offset: $pageNo
      categoryId: $categoryId
      status: $status
    ) {
      Id
      description
      status
      estimatedResolutionDays
      status
    }
  }
`;

export const createTicketSubCategoryQuery = gql`
  mutation CreateTicketSubCategory(
    $subCategoryCode: String!
    $description: String!
    $estimatedResolutionDays: Int!
    $categoryId: String!
  ) {
    createTicketSubCategory(
      data: {
        subCategoryCode: $subCategoryCode
        description: $description
        estimatedResolutionDays: $estimatedResolutionDays
        categoryId: $categoryId
      }
    ) {
      ticketSubCategory {
        Id
        description
        status
      }
    }
  }
`;

export const updateTicketSubCategoryQuery = gql`
  mutation UpdateTicketSubCategory(
    $Id: String!
    $description: String!
    $status: Int!
    $estimatedResolutionDays: Int!
  ) {
    updateTicketSubCategory(
      id: $Id
      data: {
        description: $description
        status: $status
        estimatedResolutionDays: $estimatedResolutionDays
      }
    ) {
      message
    }
  }
`;
export const deleteTicketSubCategoryQuery = gql`
  mutation($id: String!) {
    deleteTicketSubCategory(id: $id) {
      message
    }
  }
`;
//------------------
export const getListofGenericMasterQuery = gql`
  query(
    $offset: Int
    $pageNo: Int
    $masterFor: Int!
    $descriptionName: String
  ) {
    getListofGenericMaster(
      NoOfRows: $offset
      offset: $pageNo
      masterFor: $masterFor
      descriptionName: $descriptionName
    ) {
      Id
      masterFor
      description
      status
      statusDetail {
        name
      }
    }
  }
`;
export const fetchGenericMasterQuery = gql`
  query(
    $offset: Int
    $pageNo: Int
    $masterFor: Int!
    $descriptionName: String
    $status: Int
  ) {
    getListofGenericMaster(
      NoOfRows: $offset
      offset: $pageNo
      masterFor: $masterFor
      descriptionName: $descriptionName
      status: $status
    ) {
      Id
      masterFor
      description
      status
    }
  }
`;

export const createGenericMastersQuery = gql`
  mutation CreateGenericMasters($masterFor: Int!, $description: String!) {
    createGenericMasters(
      data: { masterFor: $masterFor, description: $description }
    ) {
      genericMaster {
        Id
        description
      }
    }
  }
`;

export const getMasterByIdQuery = gql`
  query($id: Int) {
    getMasterById(id: $id) {
      Id
      description
      allowmastersEntry
      allowforStatus
    }
  }
`;

export const getGenericMasterByIdQuery = gql`
  query($id: Int) {
    getGenericMasterById(id: $id) {
      Id
      description
      masterFor
      status
      createdBy
      createdOn
      lastModifiedOn
      lastModifiedBy
      masterForDetail {
        Id
        description
      }
      statusDetail {
        Id
        name
      }
      lastModifiedDetail {
        Id
        loginId
      }
      createdDetail {
        Id
        loginId
      }
    }
  }
`;
export const fetchGenericMasterByIdQuery = gql`
  query($id: Int) {
    fetchGenericMasterById(id: $id)
  }
`;

export const UpdateGenericMastersQuery = gql`
  mutation UpdateGenericMasters(
    $Id: Int!
    $description: String!
    $status: Int!
  ) {
    updateGenericMasters(
      id: $Id
      data: { description: $description, status: $status }
    ) {
      message
    }
  }
`;

export const deleteGenericMastersQuery = gql`
  mutation DeleteGenericMasters($Id: Int!) {
    deleteGenericMasters(id: $Id) {
      message
    }
  }
`;
// ---------------------------------------
export const getEscalationPlanQuery = gql`
  query($offset: Int, $pageNo: Int, $desc: String) {
    escalationPlan(NoOfRows: $offset, offset: $pageNo, desc: $desc) {
      Id
      description
      status
    }
  }
`;
export const createEscalationPlanQuery = gql`
  mutation createEscalationPlan(
    $description: String!
    $lvl1EscalationHrs: Int!
    $lvl2EscalationHrs: Int!
    $lvl3EscalationHrs: Int!
    $lvl4EscalationHrs: Int!
  ) {
    createEscalationPlan(
      data: {
        description: $description
        lvl1EscalationHrs: $lvl1EscalationHrs
        lvl2EscalationHrs: $lvl2EscalationHrs
        lvl3EscalationHrs: $lvl3EscalationHrs
        lvl4EscalationHrs: $lvl4EscalationHrs
      }
    ) {
      escalationPlan {
        Id
        description
      }
    }
  }
`;

// export const getEscalationPlanByIdQuery = gql`
//   query($id: Int) {
//     getEscalationPlanById(id: $id) {
//       Id
//       description
//       status
//       lvl1EscalationHrs
//       lvl2EscalationHrs
//       lvl3EscalationHrs
//       lvl4EscalationHrs
//     }
//   }
// `;

export const getEscalationPlanByIdQuery = gql`
  query($id: Int) {
    fetchEscalationPlanById(id: $id)
  }
`;
export const UpdateEscalationPlanQuery = gql`
  mutation UpdateEscalationPlan(
    $Id: Int!
    $description: String!
    $lvl1EscalationHrs: Int!
    $lvl2EscalationHrs: Int!
    $lvl3EscalationHrs: Int!
    $lvl4EscalationHrs: Int!
    $status: Int!
  ) {
    updateEscalationPlan(
      id: $Id
      data: {
        description: $description
        lvl1EscalationHrs: $lvl1EscalationHrs
        lvl2EscalationHrs: $lvl2EscalationHrs
        lvl3EscalationHrs: $lvl3EscalationHrs
        lvl4EscalationHrs: $lvl4EscalationHrs
        status: $status
      }
    ) {
      message
    }
  }
`;
//---------------------------
// export const getEscalationPlanDetailQuery = gql`
//   query($offset: Int, $pageNo: Int, $planId: Int!) {
//     escalationPlanDetail(NoOfRows: $offset, offset: $pageNo, planId: $planId) {
//       Id
//       level
//       userId
//     }
//   }
// `;

export const getEscalationPlanDetailQuery = gql`
  query($offset: Int, $pageNo: Int, $planId: Int!) {
    fetchListOfEscalationPlanDetail(
      NoOfRows: $offset
      offset: $pageNo
      planId: $planId
    )
  }
`;

export const createEscalationPlanDetailQuery = gql`
  mutation createEscalationPlanDetail(
    $planId: Int!
    $level: Int!
    $userId: Int!
  ) {
    createEscalationPlanDetail(
      data: { planId: $planId, level: $level, userId: $userId }
    ) {
      escalationPlanDetail {
        Id
      }
    }
  }
`;
export const deleteEscalationPlanDetailQuery = gql`
  mutation($id: String!) {
    deleteEscalationPlanDetail(id: $id) {
      message
    }
  }
`;
export const QUESTION_CATEGORY = gql`
  query {
    getListofGenericMaster(masterFor: 12, status: 1) {
      Id
      description
    }
  }
`;
