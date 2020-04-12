//https://www.apollographql.com/docs/react/essentials/mutations.html
import { gql } from "apollo-boost";

export const getUserListQuery = gql`
  query(
    $offset: Int
    $pageNo: Int
    $employeeId: String
    $name: String
    $emailId: String
    $status: Int
  ) {
    getListOfOrgUsers(
      NoOfRows: $offset
      offset: $pageNo
      employeeId: $employeeId
      name: $name
      emailId: $emailId
      status: $status
    ) {
      Id
      name
      employeeId
      emailId
      mobileNumber

      reportingManagerId
      reportingManager {
        Id
        name
        emailId
      }
      lockedDetail {
        Id
        locked
        entityType
      }
    }
  }
`;

export const getUserByIdQuery = gql`
  query($id: Int!) {
    findOrgUserById(id: $id) {
      Id
      name
      employeeId
      emailId
      mobileNumber

      userId
      status
      lastModifiedOn
      createdOn

      createdBy
      createdByDetail {
        Id
        loginId
      }
      lastModifiedBy
      modifiedByDetail {
        Id
        loginId
      }
      department
      departmentDetail {
        Id
        description
      }
      reportingManagerId
      reportingManager {
        Id
        name
        emailId
      }
      lockedDetail {
        Id
        locked
        entityType
      }
    }
  }
`;
// designation
// designationDetail {
//   Id
//   description
// }
// dateOfJoining

export const createUser = gql`
  mutation(
    $name: String!
    $emailId: String!
    $mobileNumber: String!
    $department: [Int]!
    $reportingManagerId: Int
    $entityType: Int!
  ) {
    createOrgUser(
      data: {
        name: $name
        emailId: $emailId
        mobileNumber: $mobileNumber
        department: $department
        reportingManagerId: $reportingManagerId
        entityType: $entityType
      }
    ) {
      orgUser {
        Id
        name
      }
    }
  }
`;

export const updateUser = gql`
  mutation(
    $id: Int!
    $name: String!
    $emailId: String!
    $mobileNumber: String!
    $status: Int
    $department: [Int]!
    $reportingManagerId: Int
  ) {
    updateOrgUser(
      id: $id
      data: {
        name: $name
        emailId: $emailId
        mobileNumber: $mobileNumber
        status: $status
        department: $department
        reportingManagerId: $reportingManagerId
      }
    ) {
      message
    }
  }
`;

export const getListofGenericMasterQuery = gql`
  query($masterFor: Int) {
    getListofGenericMaster(masterFor: $masterFor, status: 1) {
      Id
      description
    }
  }
`;

export const getListofReportingManagersQuery = gql`
  query {
    getListOfReportingManagers(userId: 1) {
      Id
      name
    }
  }
`;

export const getListofUserRolesQuery = gql`
  query($userId: Int) {
    userRoles(userId: $userId)
  }
`;

export const addUserRolesQuery = gql`
  mutation($userId: Int, $roleId: String) {
    addUserRoles(data: { userId: $userId, roleId: $roleId }) {
      userRoles {
        Id
      }
    }
  }
`;

export const removeUserRoleQuery = gql`
  mutation($id: String!) {
    removeUserRoles(id: $id) {
      message
    }
  }
`;

export const getListofRolesQuery = gql`
  query($entityType: Int) {
    roles(status: 2, entityType: $entityType) {
      Id
      roleName
    }
  }
`;

export const unlockUser = gql`
  mutation($id: Int!) {
    unlockUser(id: $id) {
      message
    }
  }
`;
export const ADD_EMPLOYEE_TEST = gql`
  mutation($userId: [Int]!, $testId: Int!) {
    addEmployeeTest(data: { userId: $userId, testId: $testId }) {
      employees {
        testId
      }
    }
  }
`;

export const EMPLOYEE_TEST_LIST = gql`
  query($testId: Int) {
    getListOfEmployeesforTest(testId: $testId) {
      Id
      userDetail {
        Id
        name
        userId
        emailId
      }
    }
  }
`;

export const REMOVE_EMPLOYEEE_FROM_TEST = gql`
  mutation($id: String!) {
    removeEmployeeTest(id: $id) {
      message
    }
  }
`;

export const ALL_EMPLOYEE_LIST = gql`
  query(
    $offset: Int
    $pageNo: Int
    $employeeId: String
    $name: String
    $emailId: String
    $status: Int
  ) {
    getListOfAyanaEmployees(
      NoOfRows: $offset
      offset: $pageNo
      employeeId: $employeeId
      name: $name
      emailId: $emailId
      status: $status
    ) {
      Id
      name
      employeeId
      userId
      emailId
      mobileNumber
      department
      reportingManagerId
      reportingManager {
        Id
        name
        emailId
      }
    }
  }
`;

// designationDetail {
//   description
// }
