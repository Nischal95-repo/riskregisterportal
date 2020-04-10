export function loginAction(userName) {
  return { type: "LOGIN", userName };
}

export function logoutAction() {
  return { type: "LOGOUT" };
}

export function addPermission(permission) {
  return {
    type: "ADD_PERMISSION",
    permission: permission
  };
}
