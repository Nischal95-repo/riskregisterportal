import { withRouter } from "react-router-dom";

export function redirectTo(destination, res) {
  console.log(destination);
  if (res) {
    res.writeHead(302, { Location: destination });
    res.end();
  } else {
    // this.props.history.push(destination);
  }
}

// export function checklogin(ctx) {
//   const isLoggedIn = ctx.store.getState().auth.isLoggedIn;

//   if (!isLoggedIn && ctx.asPath != "/") {
//     console.log("User is not logged in. So redirecting you to Login page...");
//     redirectTo("/", ctx.res);
//   }
// }
