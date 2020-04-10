import { withApollo } from "react-apollo";
import DisplayErrors from "../screens/Common/DisplayErrors";
import { SET_TIMEOUT_VALUE } from "../constants/app-constants";
import { FORGOT_PASSWORD } from "../services/graphql/queries/auth";
import SimpleReactValidator from "simple-react-validator";
import InputComponent from "../screens/Common/form-component/InputComponent";
import ButtonComponent from "../screens/Common/form-component/ButtonComponent";
import React from "react";
import logo from "../static/images/logo.jpg";
class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: "",
      displayMessage: "",
      emailId: "",
      errors: [],
      loading: false,
      componentMounted: false,
      submitButtonEnable: true
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      //   messages: {
      //     required: "This Field is required",
      //     default: "Validation has failed!" // will override all messages
      //   },
      element: message => <div className="invalid-feedback">{message}</div>
    });
    this.forgotPassword = this.forgotPassword.bind(this);
  }

  componentDidMount() {
    this.setState({ componentMounted: true });
    localStorage.setItem(
      "token",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdXRoIjoiYXV0aEBhcG9sbG9nYXRld2F5IiwiZW1haWwiOiJkZXZAcmVkaW50ZWdyby5jb20iLCJ1c2VySWQiOjF9.cZkue-J1BWJZUQzBTzC5_PgUv_-OMLsD8-a26N8RsII"
    );
  }

  componentWillUnmount() {
    this.setState({ componentMounted: false });
  }
  closeWindow = () => {
    // window.open("about:blank", "_self");
    window.open("", "_parent", "");
    // window.close();
  };
  handleInput = e => {
    let value = e.target.value;

    this.setState({ emailId: value });
  };

  forgotPassword() {
    this.setState({ errors: [] });
    this.props.client
      .mutate({
        mutation: FORGOT_PASSWORD,
        variables: { emailAddress: this.state.emailId.trim(), portalType: 1 },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        console.log("result~~~", result.data.resetPassword);
        this.setState({
          displayMessage:
            "Reset password link has been sent to your registered Email"
        });
        // setTimeout(() => {
        //   this.setState({ displayMessage: "" });
        // }, 10000);
      })
      .catch(error => {
        error.graphQLErrors.map(({ message }, i) => {
          this.setState({
            errors: [message],
            isSubmitDisable: false
          });
        });
        setTimeout(() => {
          this.setState({ errors: [], loading: false });
        }, SET_TIMEOUT_VALUE);
      });
  }

  render() {
    const { emailId, displayMessage, errors, msg } = this.state;
    return (
      <div className="desktop">
        <div className="login-page">
          <div className="login-section">
            <div className="brand text-center">
              <img src={logo} width={200} />
            </div>
            <div className="login-main">
              <h2 className="text-center mb-3">Forgot Password</h2>
              <div
                className="row"
                style={{
                  display: errors.length === 0 ? "none" : "block"
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

              {displayMessage == "" ? (
                <>
                  <div className="row">
                    <div className="col">
                      <InputComponent
                        required
                        type="text"
                        title="Email"
                        name="emailId"
                        className="login-input"
                        value={emailId}
                        placeholder="Email"
                        handleChange={this.handleInput}
                        validator={this.validator}
                        validation="required|email"
                      ></InputComponent>
                    </div>
                  </div>

                  <div className="row text-center mb-3">
                    <div className="col">
                      <ButtonComponent
                        type="submit"
                        className="btn-danger "
                        title="Submit"
                        onClick={() => {
                          if (this.validator.allValid()) {
                            this.forgotPassword();
                          } else {
                            this.validator.showMessages();
                          }
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div className="col">
                      <div className="form-group">
                        <h6
                          style={{
                            backgroundColor: "white",
                            padding: "5px",
                            textAlign: "center"
                          }}
                        >
                          {displayMessage}
                        </h6>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withApollo(ForgotPassword);
