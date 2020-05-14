import React from "react";

import { connect } from "react-redux";
import { logoutAction } from "../../../services/redux/actions/loginActions";
import { withApollo } from "react-apollo";
import { VERIFY_TOKEN, Logout } from "../../../services/graphql/queries/auth";

import { TOKEN_VERIFICATION_CHECK } from "../../../constants/app-constants";
import { withRouter } from "react-router-dom";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.verifyToken = this.verifyToken.bind(this);
  }
  componentDidMount() {
    this.verifyToken();
    this.checkLoginTimer = setInterval(() => {
      this.verifyToken();
    }, TOKEN_VERIFICATION_CHECK);
  }
  logout = () => {
    // this.props.client
    //   .mutate({
    //     mutation: Logout,
    //     variables: { logoutBy: 2 },
    //     fetchPolicy: "no-cache",
    //   })
    //   .then((result) => {
    //     console.log("result", result.data.logout.message);
    //     localStorage.clear();
    //   })
    //   .catch((error) => {
    //     console.log("~~~error: ", error);
    //   });
    this.props.dispatch(logoutAction());
    this.props.history.push("/");
  };
  verifyToken() {
    const token = localStorage.getItem("token");
    this.props.client
      .mutate({
        mutation: VERIFY_TOKEN,
        variables: {
          token: token,
        },
        fetchPolicy: "no-cache",
      })
      .then((result) => {})
      .catch(({ graphQLErrors, networkError }) => {
        debugger;

        if (Object.keys(graphQLErrors).length > 0) {
          graphQLErrors.map(({ message, extensions }) => {
            console.log("FOO : ", message);

            if (!message.toUpperCase().includes("ECONNREFUSED")) {
              // this.props.dispatch(logoutAction());
              // this.props.history.push("/");
              this.logout();
            }

            if (message.toUpperCase().includes("STATUS CODE 401")) {
              let error = extensions.exception.result.errors[0];

              console.error("Foo : ", error);

              if (error.toUpperCase().includes("TOKEN")) {
                // this.props.dispatch(logoutAction());
                // this.props.history.push("/");
                this.logout();
              }

              if (error.toUpperCase().includes("INACTIVITY")) {
                this.props.dispatch(logoutAction());
                this.props.history.push("/");
              }

              if (error.toUpperCase().includes("EXPIRED")) {
                // this.props.dispatch(logoutAction());
                // this.props.history.push("/");
                this.logout();
              }

              if (error.toUpperCase().includes("SESSION")) {
                // this.props.dispatch(logoutAction());
                // this.props.history.push("/");
                this.logout();
              }
              this.logout();
            }
          });
        } else {
          if (
            networkError.message
              .toUpperCase()
              .includes("RESPONSE NOT SUCCESSFUL: RECEIVED STATUS CODE 401")
          ) {
            console.log("errors", networkError);
            // this.props.history.push("/");
            this.logout();
          }
        }
      });
  }

  componentWillUnmount() {
    clearInterval(this.checkLoginTimer);
  }

  render() {
    return (
      <>
        <script src="https://apis.google.com/js/platform.js" async defer />
      </>
    );
  }
}

export default connect()(withRouter(withApollo(Footer)));
