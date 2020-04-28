// import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import React from "react";
import InputComponent from "../../components/form-component/InputComponent";
import ButtonComponent from "../../components/form-component/ButtonComponent";
import { connect } from "react-redux";
import {
  loginAction,
  addPermission,
} from "../../services/redux/actions/loginActions";

import { AUTHENTICATE_USER } from "../../services/graphql/queries/auth";
import { SET_TIMEOUT_VALUE } from "../../utils/app-constants";
import { withApollo } from "react-apollo";
import DisplayErrors from "../Common/DisplayErrors";
import { withRouter } from "react-router-dom";

import logo from "../../static/images/logo.jpg";
// import { SET_TIMEOUT_VALUE } from "../src/constants/app-constants";
// import DisplayErrors from "../src/components/Common/DisplayErrors";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authDetail: {
        emailId: "",
        password: "",
      },
      errors: [],
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: (message) => <div className="invalid-feedback">{message}</div>,
    });
  }
  handleInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState((prevState) => {
      return {
        authDetail: {
          ...prevState.authDetail,
          [name]: value,
        },
      };
    });
  };

  handleKeyInput = (e) => {
    if (e.which == 13 || e.keyCode == 13) {
      e.preventDefault();
      this.authUser();
      return false;
    }
    return true;
  };

  authUser() {
    if (this.validator.allValid()) {
      const { authDetail } = this.state;
      this.setState({ errors: [] });
      this.props.client
        .mutate({
          mutation: AUTHENTICATE_USER,
          variables: {
            emailId: authDetail.emailId,
            password: authDetail.password,
            userAgent: navigator.userAgent,
            ipAddress: "",
          },
          fetchPolicy: "no-cache",
        })
        .then((result) => {
          console.log("result~~~", result.data.authenticateUser.token);
          localStorage.setItem("token", result.data.authenticateUser.token);
          localStorage.setItem("userType", 5);
          this.props.dispatch(loginAction(result.data.authenticateUser.name));
          this.props.dispatch(addPermission({}));
          this.props.history.push("/home");
          // this.props.history.push("/users-view");
        })
        .catch((error) => {
          error.graphQLErrors.map(({ message }, i) => {
            this.setState({
              errors: [message],
            });
          });
          setTimeout(() => {
            this.setState({ errors: [] });
          }, SET_TIMEOUT_VALUE);
        });
    } else {
      this.validator.showMessages();
    }
  }
  componentDidMount() {
    console.log(this.props);

    localStorage.setItem(
      "token",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdXRoIjoiYXV0aEBhcG9sbG9nYXRld2F5IiwiZW1haWwiOiJkZXZAcmVkaW50ZWdyby5jb20iLCJ1c2VySWQiOjF9.cZkue-J1BWJZUQzBTzC5_PgUv_-OMLsD8-a26N8RsII"
    );
    localStorage.setItem("userType", 5);
  }
  render() {
    const { authDetail, errors } = this.state;
    return (
      <div className="desktop">
        <section className="login-page">
          <div className="login-section" style={{ minHeight: "400px" }}>
            <div className="brand text-center">
              <img src={logo} width="194px/" />
            </div>
            <div className="login-main">
              <h2 className="h2 text-center mb-3">Login </h2>
              <div
                className="row"
                style={{
                  display: errors.length === 0 ? "none" : "block",
                }}
              >
                <div className="col">
                  <div className="alert " role="alert">
                    <div className="row">
                      <DisplayErrors errors={errors} />
                    </div>
                  </div>
                </div>
              </div>

              <InputComponent
                autoFocus
                required
                type="text"
                title="Email"
                name="emailId"
                className="login-input"
                value={authDetail.emailId}
                placeholder="Email"
                handleChange={this.handleInput}
                handleKeyUpChange={this.handleKeyInput}
                validator={this.validator}
                validation="required|email"
              ></InputComponent>

              <InputComponent
                required
                type="password"
                title="Password"
                name="password"
                className="login-input"
                value={authDetail.password}
                placeholder="Password"
                handleChange={this.handleInput}
                handleKeyUpChange={this.handleKeyInput}
                validator={this.validator}
                validation="required"
              ></InputComponent>

              <div className="text-right">
                <a
                  href="/forgot-password"
                  style={{ fontSize: "12px", color: "#0087d5" }}
                >
                  <ul>Forgot password ?</ul>
                </a>
              </div>
              <div className="text-center mt-3 mb-3">
                <ButtonComponent
                  type="submit"
                  className="btn-danger "
                  title="Submit"
                  onClick={() => {
                    this.authUser();
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect()(withRouter(withApollo(Login)));
