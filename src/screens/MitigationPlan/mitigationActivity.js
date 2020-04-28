import React from "react";
import { withApollo } from "react-apollo";
import Modal from "react-awesome-modal";
import SimpleReactValidator from "simple-react-validator";
import ButtonComponent from "../Common/form-component/ButtonComponent";
import TextAreaComponent from "../Common/form-component/TextAreComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import { compareValues } from "../Common/customSort";
import popupLogo from "../../static/images/popup-logo.png";
import InputComponent from "../Common/form-component/InputComponent";
import {
  getListofGenericMasterQuery,
  ALL_EMPLOYEE_LIST,
} from "../../services/graphql/queries/user";
import {
  CREATE_MITIGATION_ACTIVITY,
  GET_LIST_OF_ACTIVITIES,
} from "../../services/graphql/queries/riskRegister";
import CloseSvg from "../../static/images/svg/Close.svg";
import {
  SET_TIMEOUT_VALUE,
  dateInputFormat,
  dateFormatMonth,
} from "../../constants/app-constants";
import { format } from "date-fns";
class MitigationActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityDetail: {
        name: "",
        responsible: null,
        forecastDate: "",
        department: null,
        status: null,
      },
      departmentOptions: [],
      userOptions: [],
      options: [],
      showReassign: false,
      activities: [],
      loading: true,
      errors: [],
      error: "",
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: (message) => <div style={{ color: "red" }}>{message}</div>,
    });
  }

  handleInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    if (value !== "" && (name == "department" || name == "responsible")) {
      value = parseInt(value);
    }
    this.setState((prevState) => {
      return {
        activityDetail: {
          ...prevState.activityDetail,
          [name]: value,
        },
      };
    });
    if (name == "department") {
      debugger;
      let users = [];

      this.state.options.forEach((element) => {
        console.log("department", element, value);
        if (element.department.includes(parseInt(value))) {
          let obj = {
            Id: element.Id,
            label: element.name,
          };

          users.push(obj);
        }
      });
      users = users.sort(compareValues("label"));
      this.setState({ userOptions: users });
    }
    // if (name == "forecastDate") {
    //   this.state.documentDetail.reviewEndDate = "";
    //   this.setState({ minReviewEndDate: format(value, dateInputFormat) });
    // }
  };
  getListOfOptions(id) {
    this.props.client
      .query({
        query: getListofGenericMasterQuery,
        variables: {
          masterFor: id,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var user = result.data.getListofGenericMaster;
        let OptionArr = [];
        user.forEach((element) => {
          OptionArr.push({
            Id: element.Id,
            label: element.description,
          });
        });
        if (id == 3) {
          this.initialState = {
            companyOptions: OptionArr,
          };
        } else if (id == 4) {
          this.initialState = {
            projectOptions: OptionArr,
          };
        } else if (id == 18)
          this.initialState = {
            riskOptions: OptionArr.sort(compareValues("label")),
          };
        else if (id == 2)
          this.initialState = {
            departmentOptions: OptionArr,
          };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  }
  getUserList() {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: ALL_EMPLOYEE_LIST,
        variables: {
          // employeeId: this.state.employeeId ? this.state.employeeId : null,
          // name: this.state.name ? this.state.name : "",
          status: 1,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var users = result.data.getListOfAyanaEmployees;

        this.setState({
          ...this.initialState,
          loading: false,
          error: "",
          options: users,
        });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  }

  getListOfActivities() {
    this.props.client
      .query({
        query: GET_LIST_OF_ACTIVITIES,
        variables: {
          // employeeId: this.state.employeeId ? this.state.employeeId : null,
          // name: this.state.name ? this.state.name : "",
          mitigationPlanId: parseInt(this.props.mitigationPlanId),
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var activities = result.data.getListOfMitigationActivities;

        this.setState({
          loading: false,

          activities: activities,
        });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  }

  submitMitigationActivity = () => {
    const { showReassign, activityDetail } = this.state;
    let variables = {};
    if (!showReassign && activityDetail.forecastDate !== "") {
      variables = {
        name: activityDetail.name,
        mitigationPlanId: parseInt(this.props.mitigationPlanId),
        forecastDate: activityDetail.forecastDate,
        status: activityDetail.status ? activityDetail.status : null,
        department: activityDetail.department,
        responsible: activityDetail.responsible,
      };
    } else {
      variables = {
        name: activityDetail.name,
        mitigationPlanId: parseInt(this.props.mitigationPlanId),

        status: activityDetail.status ? activityDetail.status : null,
        department: activityDetail.department,
        responsible: activityDetail.responsible,
      };
    }
    this.props.client
      .mutate({
        mutation: CREATE_MITIGATION_ACTIVITY,
        variables: variables,
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        console.log("result", result);
        // this.getListOfActivities();
        this.props.updateList();
        // this.props.toggleMode();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  toggleReassign = () => {
    this.setState((prevState) => {
      return {
        showReassign: !prevState.showReassign,
      };
    });
  };

  clear() {
    let activityDetail = {
      name: "",
      responsible: null,
      forecastDate: "",
      department: null,
    };
    this.setState({
      userOptions: [],
      activityDetail: activityDetail,
      showReassign: false,
    });

    this.validator.hideMessages();
  }

  componentDidMount() {
    this.getListOfOptions(2);
    this.getUserList();
    this.getListOfActivities();
  }
  render() {
    const {
      activityDetail,
      departmentOptions,
      userOptions,
      showReassign,
      loading,
      activities,
    } = this.state;
    return (
      <Modal
        visible={this.props.visible}
        effect="fadeInDown"
        width="900px"
        height="70vh"
      >
        <div style={{ padding: "15px" }}>
          <div className="modal-content" style={{ border: "none" }}>
            <div
              className="modal-header "
              style={{ display: "-webkit-box", padding: 0, border: "none" }}
            >
              <div className="col-10" style={{ display: "-webkit-box" }}>
                <img src={popupLogo} />

                <h1 className="heading m-l-45 m-b-35">
                  Mitigation Plan Update
                </h1>
              </div>
              <div className="col-2 text-right ">
                <a
                  className="link-click"
                  href="#"
                  data-placement="bottom"
                  title="Close"
                  data-toggle="modal"
                  onClick={() => {
                    this.props.toggleMode();
                  }}
                >
                  <img src={CloseSvg} />
                  Close
                </a>
              </div>
            </div>
            <div className="modal-body" style={{ paddingTop: 0 }}>
              {this.props.riskDetails &&
              this.props.riskDetails.canEdit &&
              this.props.riskDetails.canEdit.canEditMitigationActivity ? (
                <div>
                  <div className="row">
                    <div className="col-md-6">
                      <TextAreaComponent
                        required
                        label="Remarks"
                        title="remarks"
                        name="name"
                        value={activityDetail.name}
                        placeholder="Enter remarks"
                        handleChange={(e) => {
                          this.handleInput(e);
                        }}
                        validation="required"
                        validator={this.validator}
                      ></TextAreaComponent>
                    </div>
                    <div className="col-md-3">
                      <InputComponent
                        label="Forecast Date"
                        title="forecast date"
                        name="forecastDate"
                        value={activityDetail.forecastDate}
                        handleChange={(e) => {
                          this.handleInput(e);
                        }}
                        // validator={this.validator}
                        // validation="required"
                        type="date"
                        min={format(new Date(), dateInputFormat)}
                      ></InputComponent>
                    </div>
                    {showReassign ? null : (
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Status</label>
                          <select className="form-control select-style-1">
                            <option>Select</option>
                            {/* <option> Waiting For Approval</option> */}
                            <option value="3"> Waiting For Closure</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                  {showReassign ? (
                    <div className="row" id="reassign">
                      <div className="col-md-3 col-lg-3">
                        <SelectComponent
                          required
                          label="Department"
                          title="department"
                          name="department"
                          options={departmentOptions}
                          optionKey={"label"}
                          valueKey={"Id"}
                          value={activityDetail.department}
                          placeholder={"Select Department"}
                          handleChange={(e) => {
                            this.handleInput(e);
                          }}
                          validator={this.validator}
                          validation="required"
                        />
                      </div>
                      <div className="col-md-3 col-lg-3">
                        <SelectComponent
                          required
                          label="Responsible"
                          title="responsible"
                          name="responsible"
                          options={userOptions}
                          optionKey={"label"}
                          valueKey={"Id"}
                          value={activityDetail.responsible}
                          placeholder={"Select Responsible"}
                          handleChange={(e) => {
                            this.handleInput(e);
                          }}
                          validator={this.validator}
                          validation="required"
                        />
                      </div>
                    </div>
                  ) : null}
                  <div className="row">
                    <div className="col-md-12 col-lg-8">
                      <ButtonComponent
                        className="btn-danger"
                        type="button"
                        title="Submit"
                        onClick={() => {
                          if (showReassign && this.validator.allValid()) {
                            // this.validator.hideMessages();
                            this.submitMitigationActivity();
                          } else if (
                            !showReassign &&
                            this.validator.fields.remarks
                          ) {
                            this.submitMitigationActivity();
                          } else {
                            this.validator.showMessages();
                            // rerender to show messages for the first time
                            // you can use the autoForceUpdate option to do this automatically`
                            this.forceUpdate();
                          }
                        }}
                      ></ButtonComponent>

                      <ButtonComponent
                        className="btn-light  ml-3"
                        type="button"
                        title="Clear"
                        onClick={() => {
                          this.clear();
                        }}
                      ></ButtonComponent>

                      {showReassign ? null : (
                        <ButtonComponent
                          className="btn-light  ml-3"
                          type="button"
                          title="Reassign"
                          onClick={this.toggleReassign}
                        ></ButtonComponent>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="row">
                <div className="col-md-12">
                  <div>
                    <div className="col-md-10">
                      <h1 className="heading mt-3">Activity List</h1>
                    </div>

                    <div
                      className="table-responsive"
                      style={{ maxHeight: "27vh" }}
                    >
                      <table
                        className="table table-style-1"
                        style={{ overflow: "auto" }}
                      >
                        <thead>
                          <tr>
                            <th scope="col" width={55}>
                              Sl No
                            </th>

                            <th scope="col" width={140}>
                              User
                            </th>
                            <th scope="col" width={110}>
                              Created On
                            </th>
                            <th scope="col" width={130}>
                              Status
                            </th>
                            <th scope="col" width={180}>
                              Remarks
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {!loading && activities && activities.length ? (
                            activities.map((data, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>
                                    {data.createdByDetail
                                      ? data.createdByDetail.name
                                      : ""}{" "}
                                  </td>
                                  <td>
                                    {format(data.createdOn, dateFormatMonth)}
                                  </td>
                                  <td>{data.status ? data.status.name : ""}</td>
                                  <td>{data.remarks}</td>
                                </tr>
                              );
                            })
                          ) : loading ? (
                            <div>loading</div>
                          ) : (
                            <div>No Data</div>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="modal-footer" style={{ border: "none" }}>
                <ButtonComponent
                  className="btn-danger"
                  type="button"
                  title="Submit"
                  onClick={() => {
                    if (this.validator.allValid()) {
                      // this.validator.hideMessages();
                      this.submitMitigation();
                    } else {
                      this.validator.showMessages();
                      // rerender to show messages for the first time
                      // you can use the autoForceUpdate option to do this automatically`
                      this.forceUpdate();
                    }
                  }}
                ></ButtonComponent>

                <ButtonComponent
                  className="btn-light  ml-3"
                  type="button"
                  title="Clear"
                  onClick={() => {
                    this.clear();
                  }}
                ></ButtonComponent>
              </div> */}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withApollo(MitigationActivity);
