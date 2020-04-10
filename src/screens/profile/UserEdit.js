import { validateRequired, validateEmail } from "../../util/Validations";
import DisplayErrors from "../Common/DisplayErrors";
import Modal from "react-awesome-modal";
import NumberFormat from "react-number-format";
import { withApollo } from "react-apollo";
import {
  getUserProfileQuery,
  updateUserProfileQuery
} from "../../services/graphql/queries/profile";
import {
  SET_TIMEOUT_VALUE,
  ALPHABET_NAME_VALIDATION
} from "../../constants/app-constants";
import { redirectTo } from "../../util/redirect";
import { sendOTP } from "../../services/graphql/queries/otp";
import {
  nameValidation,
  alphabetAcceptanceValidation
} from "../../miscellaneous/misc";
import React from "react";
import { withRouter } from "react-router-dom";
class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      name: "",
      nameErr: "",
      email: "",
      mobileNo: "",
      mobileNoErr: "",
      otp: "",
      errors: [],
      isMobileNoChange: false,
      isSubmit: true,
      isModalOpen: false,
      showresendMsg: false
    };
    this.resetForm = this.resetForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  sendOTP = () => {
    if (this.validateData()) {
      this.props.client
        .mutate({
          mutation: sendOTP,
          variables: { mobileNumber: this.state.mobileNo },
          fetchPolicy: "no-cache"
        })
        .then(result => {
          this.setState({ isModalOpen: true, otp: "", showresendMsg: true });
          this.timer = setTimeout(() => {
            this.setState({ showresendMsg: false });
          }, 10000);
        })
        .catch(error => {
          console.log("~~~error: ", error);
          error.graphQLErrors.map(({ message }, i) => {
            this.setState(prevState => {
              return { errors: [message] };
            });
          });
          this.timer = setTimeout(() => {
            this.setState({ errors: [] });
          }, SET_TIMEOUT_VALUE);
        });
    }
  };
  componentDidMount() {
    this.setState({ ...this.initialState });
    this.props.client
      .query({
        query: getUserProfileQuery,
        variables: {},
        fetchPolicy: "network-only"
      })
      .then(result => {
        let user = result.data.getUserProfile;
        // user = JSON.parse(user);
        this.setState({
          user: user,
          name: user.name,
          email: user.emailId,
          mobileNo: user.mobileNumber
        });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ error: error.message });
      });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  resetForm() {
    const { user } = this.state;
    this.setState({
      errors: [],
      nameErr: "",
      mobileNoErr: "",
      isMobileNoChange: false,
      isSubmit: true,
      otp: "",
      name: user.name,
      email: user.loginId,
      mobileNo: user.mobileNumber
    });
    this.setState({ ...this.initialState });
  }
  validateData = () => {
    const { user, name, mobileNo, isMobileNoChange } = this.state;
    if (!validateRequired(name)) {
      this.state.nameErr = "Please provide a valid name";
    }
    // else if (!alphabetAcceptanceValidation(name, ALPHABET_NAME_VALIDATION)) {
    //   this.state.nameErr =
    //     "Name must start with a character and can contain Alphabet and ' ";
    // }
    else this.state.nameErr = "";
    if (
      !validateRequired(mobileNo) ||
      mobileNo.trim().length < 10 ||
      mobileNo.trim().startsWith("91")
    ) {
      this.state.mobileNoErr = "Please enter a valid Mobile Number";
    } else {
      this.state.mobileNoErr = "";
    }

    if (this.state.nameErr || this.state.mobileNoErr) {
      this.setState({});
      return false;
    }
    return true;
  };
  submitForm() {
    //Use below variables to Update DB via GraphQL after all validations pass

    if (this.validateData()) {
      this.setState({ errors: [] });
      this.props.client
        .mutate({
          mutation: updateUserProfileQuery,
          variables: {
            name: this.state.name.toUpperCase(),
            mobileNo: this.state.mobileNo
          },
          fetchPolicy: "no-cache"
        })
        .then(result => {
          let user = result.data.updateUserProfile;
          localStorage.setItem("profileObject", this.state.name.toUpperCase());
          this.props.history.push("/user-profile");
        })
        .catch(error => {
          console.log("~~~error: ", error);
          error.graphQLErrors.map(({ message }, i) => {
            this.setState(prevState => {
              return { errors: [message] };
            });
          });
          this.timer = setTimeout(() => {
            this.setState({ errors: [] });
          }, SET_TIMEOUT_VALUE);
        });
    }
  }
  onOtpSubmit() {
    this.props.client
      .mutate({
        mutation: updateUserProfileQuery,
        variables: {
          name: this.state.name.trim().toUpperCase(),
          mobileNo: this.state.mobileNo,
          eventType: 1001,
          OTP: this.state.otp.trim()
        },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        let user = result.data.updateUserProfile;
        localStorage.setItem("profileObject", this.state.name.toUpperCase());
        this.setState({ isModalOpen: false });
        // redirectTo("/user-profile");
        this.props.history.push("/user-profile");
      })
      .catch(error => {
        console.log("~~~error: ", error);
        error.graphQLErrors.map(({ message }, i) => {
          this.setState(prevState => {
            return { errors: [message] };
          });
        });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  }

  render() {
    const {
      name,
      nameErr,
      email,
      mobileNo,
      mobileNoErr,
      otp,
      errors,
      isMobileNoChange,
      isSubmit,
      isModalOpen
    } = this.state;
    return (
      <>
        {isModalOpen ? (
          <Modal visible={isModalOpen} effect="fadeInDown" width="800">
            <div className="modal-content " style={{ padding: "40px" }}>
              <div className="modal-header">
                <div className="row">
                  <h1 className="heading">Enter OTP</h1>
                </div>
              </div>
              <div className="modal-body">
                <div
                  className="row"
                  style={{
                    display: errors.length === 0 ? "none" : "block"
                  }}
                >
                  <div className="col-md-6">
                    <div className="alert alert-success" role="alert">
                      <div className="row">
                        {/* <img src="/static/images/svg/Serverclose.svg" /> */}
                        {/* <span className="danger-link"> */}
                        <DisplayErrors errors={errors} />
                        {/* </span> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {this.state.showresendMsg ? (
                      <h6
                        className="danger-link"
                        style={{ fontWeight: "500", fontSize: "13px" }}
                      >
                        * OTP has been sent to your registered email. Please
                        enter OTP here.
                      </h6>
                    ) : null}
                    <div className="row">
                      <div className="col-4">
                        <div className="form-field">
                          <label style={{ fontWeight: "600" }}>OTP</label>
                          &nbsp;
                          <a
                            href="#"
                            onClick={() => {
                              this.sendOTP();

                              this.timer = setTimeout(() => {
                                this.setState({ showresendMsg: false });
                              }, 10000);
                            }}
                            style={{
                              color: "red",
                              textDecoration: "underline"
                            }}
                          >
                            Resend
                          </a>
                          <div className="ui-widget">
                            <NumberFormat
                              autoFocus
                              format="####"
                              placeholder="Please enter OTP"
                              className={"form-control "}
                              autoFocus
                              value={otp}
                              onChange={e => {
                                this.setState({
                                  otp: e.target.value
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-default popup-button-default text-w-light"
                  data-dismiss="modal"
                  onClick={() => {
                    this.setState({ isModalOpen: false });
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger popup-button-danger"
                  disabled={otp.trim().length == 4 ? false : true}
                  onClick={e => {
                    this.onOtpSubmit();
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </Modal>
        ) : (
          <>
            <h1 className="heading m-b-25">Edit User</h1>
            <div
              className="row"
              style={{
                display: errors.length === 0 ? "none" : "block"
              }}
            >
              <div className="col-md-6">
                <div className="alert alert-success" role="alert">
                  <div className="row">
                    {/* <img src="/static/images/svg/Serverclose.svg" />
                    <span className="danger-link"> */}
                    <DisplayErrors errors={errors} />
                    {/* </span> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="box-card">
                  <div className="row">
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-md-12 col-lg-4">
                          <div className="form-group">
                            <label>Name</label>
                            <span style={{ color: "red" }}>*</span>
                            <input
                              type="text"
                              className={
                                "form-control " + (nameErr ? "is-invalid" : "")
                              }
                              style={{ textTransform: "uppercase" }}
                              placeholder="Enter name"
                              value={name}
                              maxLength={40}
                              onChange={e => {
                                this.setState({
                                  name: e.target.value,
                                  isSubmit: false
                                });
                              }}
                            />
                            {nameErr != "" ? (
                              <div className="invalid-feedback">{nameErr}</div>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                          <div className="form-group">
                            <label>Email Address</label>
                            <input
                              type="text"
                              className="form-control"
                              disabled
                              title={email}
                              value={email}
                              onChange={e => {
                                this.setState({
                                  email: e.target.value
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                          <div className="form-group">
                            <label>Mobile Number</label>
                            <span style={{ color: "red" }}>*</span>
                            <NumberFormat
                              style={{ textTransform: "uppercase" }}
                              value={mobileNo}
                              format="##########"
                              placeholder="Enter Mobile Number"
                              className={
                                "form-control " +
                                (mobileNoErr ? "is-invalid" : "")
                              }
                              onChange={e => {
                                this.setState({
                                  mobileNo: e.target.value.trim(),

                                  isMobileNoChange: false
                                });
                                if (
                                  this.state.user.mobileNumber !=
                                  e.target.value.trim()
                                ) {
                                  this.setState({
                                    isMobileNoChange: true,
                                    isSubmit: false
                                  });
                                }
                              }}
                            />
                            {mobileNoErr != "" ? (
                              <div className="invalid-feedback">
                                {mobileNoErr}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="row m-t-45 m-b-15">
                        <div className="col-md-5">
                          {isMobileNoChange ? (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={this.sendOTP}
                              disabled={isSubmit}
                            >
                              Continue
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={this.submitForm}
                              disabled={isSubmit}
                            >
                              Submit
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn btn-light m-l-50"
                            onClick={this.resetForm}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default withRouter(withApollo(UserEdit));
