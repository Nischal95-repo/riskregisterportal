function loginReducer(
  prevState = { isLoggedIn: false, userName: null, permission: {} },
  action
) {
  let newState;
  console.log("ASDDSADS");
  switch (action.type) {
    case "LOGIN":
      newState = { ...prevState, isLoggedIn: true, userName: action.userName };
      break;
    case "LOGOUT":
      newState = { ...prevState, isLoggedIn: false, userName: null };
      break;
    case "ADD_PERMISSION":
      newState = { ...prevState, permission: action.permission };
      break;
    default:
      newState = prevState;
      break;
  }

  return newState;
}

export default loginReducer;

/*
STORE: { isLoggedIn: false, userName: null }

ACTIONS:
  {type:"LOGIN",userName:"Sreekanth"}
  {type:"LOGOUT"}
*/
