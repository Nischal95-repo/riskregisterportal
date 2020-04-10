import { withApollo } from "react-apollo";
import { CHANGE_PASSWORD } from "../../services/graphql/queries/auth";
import { SET_TIMEOUT_VALUE } from "../../constants/app-constants";
import { errorMessage } from "../../miscellaneous/error-messages";
import SimpleReactValidator from "simple-react-validator";
import InputComponent from "../../screens/Common/form-component/InputComponent";
import ButtonComponent from "../../screens/Common/form-component/ButtonComponent";
import { withRouter } from "react-router-dom";
import ReactModal from "../Common/ReactModal";
import DisplayErrors from "../Common/DisplayErrors";
import { redirectTo } from "../../util/redirect";
import React from "react";
// export const PASSWORD_REGEX =
//   "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])";
class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordInfo: {
        newPassword: "",
        oldPassword: "",
        confirmPassword: ""
      },
      displayMessage: "Password changed successfully",
      isModalVisible: false,
      errors: []
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      messages: {
        in: "Passwords need to match!",
        regex:
          "Password must contain minimum 8 characters, 1 lowercase and 1 uppercase alphabetical, 1 numeric and 1 special character"
      },
      //   validators: {
      // password: {
      //   message:
      //     "Password should contain minimum 8 characters,1 special charcter and a digit",
      //   rule: (val, params, validator) => {
      //     console.log(validator.helpers.testRegex(val, PASSWORD_REGEX));
      //     return validator.helpers.testRegex(val, PASSWORD_REGEX);
      //   },
      //   messageReplace: (message, params) =>
      //     message.replace(":values", this.helpers.toSentence(params))
      // }
      //   },
      element: message => <div className="invalid-feedback">{message}</div>
    });
  }
  handleInput = e => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => {
      return {
        passwordInfo: {
          ...prevState.passwordInfo,
          [name]: value
        }
      };
    });
  };
  ChangePassword = () => {
    const { passwordInfo, errors } = this.state;
    this.props.client
      .mutate({
        mutation: CHANGE_PASSWORD,
        variables: {
          token: localStorage.getItem("token"),
          password: passwordInfo.newPassword.trim(),
          oldPassword: passwordInfo.oldPassword.trim()
        },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        this.setState({ isModalVisible: true, errors: [] });
      })
      .catch(error => {
        this.setState({
          errors: [errorMessage(error)],

          loading: false
        });

        setTimeout(() => {
          this.setState({
            errors: [],

            loading: false
          });
        }, SET_TIMEOUT_VALUE);
      });
  };
  resetData = e => {
    console.log("RESET");

    this.setState(
      {
        passwordInfo: {
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        }
      },
      () => {
        this.validator.hideMessages();
      }
    );
  };
  componentDidMount() {
    console.log("change password");
  }

  render() {
    const { passwordInfo, errors, isModalVisible, displayMessage } = this.state;
    return (
      <>
        <ReactModal
          reactModalVisible={isModalVisible}
          modalMessage={displayMessage}
          submitModal={() => {
            this.setState(
              {
                isModalVisible: false
              },
              () => {
                this.props.history.push("/user-profile");
              }
            );
          }}
          requireCancel={false}
        />
        <h1 className="heading m-b-25">Change Password</h1>
        <div
          className="row"
          style={{
            display: errors.length === 0 ? "none" : "block"
          }}
        >
          <div className="col-md-6">
            <div className="alert alert-success" role="alert">
              <div className="row">
                <DisplayErrors errors={errors} />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="box-card">
              <div className="row">
                <div className="col-md-4">
                  <InputComponent
                    title="old password"
                    label="OLD PASSWORD"
                    required
                    name="oldPassword"
                    type="password"
                    placeholder="Enter Old Password"
                    handleChange={this.handleInput}
                    validator={this.validator}
                    value={passwordInfo.oldPassword}
                    validation="required"
                  ></InputComponent>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <InputComponent
                    title="new password"
                    label="NEW PASSWORD"
                    required
                    name="newPassword"
                    type="password"
                    placeholder="Enter New Password"
                    handleChange={this.handleInput}
                    validator={this.validator}
                    value={passwordInfo.newPassword}
                    validation={`required|regex:${"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"}|min:8`}
                  ></InputComponent>
                </div>
                <div className="col-md-4">
                  <InputComponent
                    title="confirm password"
                    label="CONFIRM PASSWORD"
                    required
                    name="confirmPassword"
                    type="password"
                    placeholder="Enter Password"
                    handleChange={this.handleInput}
                    validator={this.validator}
                    value={passwordInfo.confirmPassword}
                    validation={`required|regex:${"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"}|in:${
                      passwordInfo.newPassword
                    }|min:8`}
                  ></InputComponent>
                </div>
              </div>
              <div className="Row">
                <ButtonComponent
                  type="Submit"
                  className="btn-danger mr-3"
                  onClick={() => {
                    if (this.validator.allValid()) {
                      //   alert("Success");
                      this.ChangePassword();
                    } else {
                      this.validator.showMessages();
                    }
                  }}
                  title="Submit"
                ></ButtonComponent>
                <ButtonComponent
                  type="Submit"
                  className="btn-light"
                  title="Clear"
                  onClick={this.resetData}
                ></ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(withApollo(ChangePassword));
