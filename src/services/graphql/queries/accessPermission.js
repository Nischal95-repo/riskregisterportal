import { gql } from "apollo-boost";

export const getAccessPermisionQuery = gql`
  query($moduleId: Int) {
    getFunctionByModuleId(moduleId: $moduleId)
  }
`;

export const GET_PERMISSION = gql`
  query {
    getPermission
  }
`;
