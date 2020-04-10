import { gql } from "apollo-boost";

export const getUserRolesQuery = gql`
  query($userId: Int!) {
    userRoles(userId: $userId)
  }
`;

export const addUserRole = gql`
  mutation($userId: Int, $roleId: String) {
    addUserRoles(data: { userId: $userId, roleId: $roleId }) {
      userRoles {
        userId
        roleId
      }
    }
  }
`;

export const removeUserRole = gql`
  mutation($id: String!) {
    removeUserRoles(id: $id) {
      message
    }
  }
`;

export const roles = gql`
  query($status: Int, $entityType: Int) {
    roles(status: $status, entityType: $entityType) {
      Id
      roleName
      description
      entityType
      status
    }
  }
`;

export const addRoleQuery = gql`
  mutation($roleName: String, $description: String, $entityType: Int) {
    addRole(data: { roleName: $roleName, description: $description, entityType: $entityType }) {
      roles {
        Id
      }
    }
  }
`;

export const updateRole = gql`
  mutation($userId: Int, $roleId: Int) {
    addUserRoles(data: { userId: $userId, roleId: $roleId }) {
      userRoles {
        userId
        roleId
      }
    }
  }
`;

export const findRoleById = gql`
  query($id: String!) {
    findRoleById(id: $id) {
      Id
      roleName
      description
      entityType
      status
      statusDetail {
        name
      }
    }
  }
`;

export const updateRoleQuery = gql`
  mutation($id: String!, $roleName: String, $description: String, $status: Int, $entityType: Int) {
    updateRole(
      id: $id
      data: { roleName: $roleName, description: $description, status: $status, entityType: $entityType }
    ) {
      message
    }
  }
`;

export const getListofModulesQuery = gql`
  query {
    getListofModules {
      Id
      description
      moduleName
    }
  }
`;

export const getListofFeaturesQuery = gql`
  query($moduleId: Int) {
    getListofFeatures(moduleId: $moduleId) {
      Id
      moduleId
      description
      enableView
      enableEdit
      enableCreate
      enableDelete
    }
  }
`;

export const createPrivilege = gql`
  mutation(
    $FeatureId: Int!
    $roleId: String!
    $viewP: Boolean
    $editP: Boolean
    $createP: Boolean
    $deleteP: Boolean
    $userType: Int!
  ) {
    createFunction(
      data: {
        FeatureId: $FeatureId
        roleId: $roleId
        viewP: $viewP
        editP: $editP
        createP: $createP
        deleteP: $deleteP
        userType: $userType
      }
    ) {
      function {
        Id
      }
    }
  }
`;

export const getListofPrivilegeQuery = gql`
  query($roleId: String!, $offset: Int, $pageNo: Int) {
    getListofFunctions(roleId: $roleId, NoOfRows: $offset, offset: $pageNo)
  }
`;

export const deletePrivilegeQuery = gql`
  mutation($id: String!) {
    deleteFunction(id: $id) {
      message
    }
  }
`;

export const updatePrivilegeQuery = gql`
  mutation($id: String!, $viewP: Boolean, $editP: Boolean, $createP: Boolean, $deleteP: Boolean) {
    updateFunction(id: $id, data: { viewP: $viewP, editP: $editP, createP: $createP, deleteP: $deleteP }) {
      message
    }
  }
`;

export const getDefaultPermissionFeatureByIdQuery = gql`
  query($id: Int) {
    getFeaturesById(id: $id) {
      Id
      moduleId
      description
      enableEdit
      enableView
      enableCreate
      enableDelete
    }
  }
`;
