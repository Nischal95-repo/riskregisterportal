import { connect } from "react-redux";

import { withApollo } from "react-apollo";
import {
  ACTIVATION_TOKEN,
  ACTIVATION_USER,
  RESEND_OTP
} from "../services/graphql/queries/auth";
import { withRouter } from "react-router-dom";
import { SET_TIMEOUT_VALUE, PASSWORD_REGEX } from "../constants/app-constants";
import DisplayErrors from "../screens/Common/DisplayErrors";
import { errorMessage } from "../miscellaneous/error-messages";
import React from "react";
import logo from "../static/images/logo.jpg";
import queryString from "query-string";
class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activateView: true,
      componentMounted: false,
      loading: true,
      noteView: false,

      errors: [],
      submitButton: true,

      entityType: 2,
      mobileOTP: "",
      mobileOTPValid: true,
      mobileOTPMessage: "",

      password: "",
      passwordValid: true,
      passwordMessage: "",

      cPassword: "",
      cPasswordValid: true,
      cPasswordMessage: "",
      otpMessage: ""
    };

    this.validateToken = this.validateToken.bind(this);
    this.activateUserView = this.activateUserView.bind(this);
    this.errorView = this.errorView.bind(this);
    this.validateData = this.validateData.bind(this);
    this.verifyUser = this.verifyUser.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.resendOTP = this.resendOTP.bind(this);
  }

  validateToken() {
    const token = queryString.parse(this.props.location.search).id;
    // localStorage.setItem("token", token);

    this.props.client
      .mutate({
        mutation: ACTIVATION_TOKEN,
        variables: {
          token: token,
          portal: "ADMIN"
        },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        let entityType = result.data.verifyActivationToken.userType;
        console.log("entityType", entityType);
        if (this.state.componentMounted) {
          this.setState({
            activateView: true,
            loading: false,
            entityType: parseInt(entityType)
          });
        }
      })
      .catch(error => {
        if (this.state.componentMounted) {
          this.setState({
            activateView: false,
            errors: [errorMessage(error)],
            submitButton: true,
            loading: false
          });
        }
      });
  }

  componentDidMount() {
    this.setState({ componentMounted: true, loading: true });
    localStorage.setItem(
      "token",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdXRoIjoiYXV0aEBhcG9sbG9nYXRld2F5IiwiZW1haWwiOiJkZXZAcmVkaW50ZWdyby5jb20iLCJ1c2VySWQiOjF9.cZkue-J1BWJZUQzBTzC5_PgUv_-OMLsD8-a26N8RsII"
    );
    this.validateToken();
  }

  verifyUser(password, otp) {
    const token = queryString.parse(this.props.location.search).id;
    this.props.client
      .mutate({
        mutation: ACTIVATION_USER,
        variables: {
          token: token,
          password: password,
          otp: otp,
          eventType: 1001
        },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        // localStorage.setItem("token", token);
        // this.props.history.push("/");
        let userType = localStorage.getItem("userType");
        console.log("!!!!!!!!!!!!!!", userType);
        if (this.state.entityType != 1) {
          if (userType == "3") {
            this.props.history.push("/compliance-bi");
          } else this.props.history.push("/");
        } else {
          this.props.history.push("/doc-workflow");
        }
        //  else if (userType == "3") {
        //   this.props.history.push("/compliance-BI-Admin");
        // }
      })
      .catch(error => {
        if (this.state.componentMounted) {
          this.setState({
            errors: [errorMessage(error)],
            submitButton: true,
            loading: false
          });
        }
        setTimeout(() => {
          if (this.state.componentMounted) {
            this.setState({
              errors: [],
              submitButton: true,
              loading: false
            });
          }
        }, SET_TIMEOUT_VALUE);
      });
  }

  resendOTP() {
    const token = queryString.parse(this.props.location.search).id;
    this.props.client
      .mutate({
        mutation: RESEND_OTP,
        variables: { token: token },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        this.setState({
          otpMessage: "OTP has been sent to registered email",
          errors: []
        });
        setTimeout(() => {
          this.setState({
            otpMessage: ""
          });
        }, SET_TIMEOUT_VALUE);
      })
      .catch(error => {
        if (this.state.componentMounted) {
          this.setState({
            errors: [errorMessage(error)],
            submitButton: true,
            loading: false
          });
        }
        setTimeout(() => {
          if (this.state.componentMounted) {
            this.setState({
              errors: [],
              submitButton: true,
              loading: false
            });
          }
        }, SET_TIMEOUT_VALUE);
      });
  }

  validateData(password, cPassword, OTP) {
    const { entityType } = this.state;
    let valid = true;
    let validationError = {
      passwordValid: true,
      passwordMessage: "",
      cPasswordValid: true,
      cPasswordMessage: "",
      mobileOTPValid: true,
      mobileOTPMessage: ""
    };

    if (OTP === "") {
      validationError.mobileOTPValid = false;
      validationError.mobileOTPMessage =
        "Please enter the OTP sent to your registered email.";
      valid = false;
    }

    if (password === "") {
      validationError.passwordValid = false;
      validationError.passwordMessage = "Enter Password";
      valid = false;
    }

    if (cPassword === "") {
      validationError.cPasswordValid = false;
      validationError.cPasswordMessage = "Enter Password";
      valid = false;
    }

    // console.log("Password : " + password);
    // console.log("Confirm Password : " + cPassword);

    if (password != "") {
      if (password != cPassword) {
        validationError.passwordValid = false;
        validationError.cPasswordValid = false;
        validationError.passwordMessage = "Passwords dont match";
        validationError.cPasswordMessage = "Passwords dont match";
        valid = false;
      }

      if (!PASSWORD_REGEX.test(password)) {
        validationError.passwordValid = false;
        validationError.passwordMessage =
          "Password must contain minimum 8 characters, 1 lowercase, 1 uppercase , 1 numeric and 1 special character";
        valid = false;
      }
    }

    if (this.state.componentMounted) {
      this.setState(validationError);
    }
    return valid;
  }

  validatePassword() {
    const { password } = this.state;
    let validationError = {
      passwordValid: true,
      passwordMessage: ""
    };

    // console.log("Password : " + password);

    if (!PASSWORD_REGEX.test(password)) {
      validationError.passwordValid = false;
      validationError.passwordMessage =
        "Password must contain minimum 8 characters, 1 lowercase, 1 uppercase , 1 numeric and 1 special character";
    }

    if (password === "") {
      validationError.passwordValid = true;
      validationError.passwordMessage = "";
    }

    if (this.state.componentMounted) {
      this.setState(validationError);
    }
  }

  componentWillUnmount() {
    this.setState({ componentMounted: false });
  }

  activateUserView() {
    const { mobileOTP, password, cPassword, errors, entityType } = this.state;
    return (
      <div>
        <div
          className="row"
          style={{
            display: errors.length === 0 ? "none" : "block"
          }}
        >
          <div>
            {/* Alert Section start */}
            <div className="alert alert-success" role="alert">
              <div className="row">
                <DisplayErrors errors={errors} />
              </div>
            </div>
          </div>
        </div>
        <div className="alert alert-success" role="alert">
          <div className="row">
            <span style={{ fontSize: "12px", color: "red" }}>
              {this.state.otpMessage}
            </span>
          </div>
        </div>
        <div className="row" id="row1">
          <div className="col-md-12">
            <div className="form-group">
              <label> OTP</label>
              <input
                type="text"
                autoComplete="off"
                className={
                  this.state.mobileOTPValid
                    ? "form-control"
                    : "form-control is-invalid"
                }
                placeholder="Enter OTP"
                value={mobileOTP}
                onChange={e => {
                  this.setState({
                    mobileOTP: e.target.value
                  });
                }}
              />
              <div className="invalid-feedback">
                {this.state.mobileOTPMessage}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                autoComplete="off"
                className={
                  this.state.passwordValid
                    ? "form-control"
                    : "form-control is-invalid"
                }
                placeholder="Enter Password"
                value={password}
                onChange={e => {
                  this.setState(
                    {
                      password: e.target.value
                    },
                    () => {
                      this.validatePassword();
                    }
                  );
                }}
              />
              <div className="invalid-feedback">
                {this.state.passwordMessage}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label> Confirm Password</label>
              <input
                type="password"
                autoComplete="off"
                className={
                  this.state.cPasswordValid
                    ? "form-control"
                    : "form-control is-invalid"
                }
                placeholder="Confirm password"
                value={cPassword}
                onChange={e => {
                  this.setState({
                    cPassword: e.target.value
                  });
                }}
              />
              <div className="invalid-feedback">
                {this.state.cPasswordMessage}
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-5">
            <button
              className="btn btn-danger btn-block"
              //   style={{ backgroundColor: "#0087D5" }}
              onClick={() => {
                if (this.validateData(password, cPassword, mobileOTP)) {
                  this.verifyUser(password, mobileOTP);
                }
              }}
            >
              Submit
            </button>
          </div>
          <div className="col-7">
            <button
              className="btn btn-danger btn-block"
              //   style={{ backgroundColor: "#0087D5" }}
              onClick={() => {
                this.resendOTP();
              }}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    );
  }

  errorView() {
    const { errors } = this.state;
    return <h4 className="text-center">{errors}</h4>;
  }

  render() {
    const css = `
    //   .hr {
    //     margin-top: 25px;
    //     border: 1px dashed lightblue;
    //     width: 150%;
    //     margin-left: -75px;
    //   }
    //   .login-main {
    //     height: 520px !important;
    //     // margin-top: -20px !important;
    //     margin-bottom: 20px !important;
    //   }

    //   .login-back-layer {
    //     background-color: #fdfdfd !important;
    //     margin-top: -20px !important;
    //   }
    //   .login-page {
    //     background-color: #69951a !important;
    //   }
      #row1 {
        margin-top: -0px;
      }

      /* * Callout box - fixed position at the bottom of the page */
      .callout {
        position: absolute;
        bottom: 520px;
        right: 20px;
        margin-left: 20px;
        max-width: 300px;
      }

      /* Callout header */
      .callout-header {
        padding: 15px 10px;
        background: crimson;
        font-size: 20px;
        color: white;
      }

      /* Callout container/body */
      .callout-container {
        padding: 15px;
        background-color: grey;
        color: white;
      }

      /* Close button */
      .closebtn {
        position: absolute;
        top: 5px;
        right: 15px;
        color: white;
        font-size: 30px;
        cursor: pointer;
      }

      /* Change color on mouse-over */
      .closebtn:hover {
        color: lightgrey;
      }
      .mx-auto {
        margin-right: 50px !important;
        margin-left: 150px !important;
        margin-bottom: 5px !important;
      }

      .login-section{
        font-size: 13px;
      }
    `;

    return (
      <div className="desktop">
        {this.state.loading ? null : (
          <div className="login-page">
            <div className="login-section">
              <div class="brand">
                <img
                  src={logo}
                  width={200}
                  // className="mx-auto d-block"
                />
              </div>
              <div className="login-main">
                {this.state.activateView
                  ? this.activateUserView()
                  : this.errorView()}
                {/* {this.activateUserView()} */}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect()(withRouter(withApollo(Index)));
