import React from "react";
import SimpleReactValidator from "simple-react-validator";
import Select from "react-select";
import NumberFormat from "react-number-format";
import { format } from "date-fns";
import ReactModal from "../Common/ReactModal";
import { withApollo } from "react-apollo";
import {
  getListofGenericMasterQuery,
  getListofReportingManagersQuery,
  createUser
} from "../../services/graphql/queries/user";

import InputComponent from "../Common/form-component/InputComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import DisplayErrors from "../Common/DisplayErrors";

import { redirectTo } from "../../util/redirect";

import {
  SET_TIMEOUT_VALUE,
  dateInputFormat
} from "../../constants/app-constants";
import { errorMessage } from "../../miscellaneous/error-messages";
import { withRouter } from "react-router-dom";
import { parse } from "url";
class UserAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      userDetail: {
        name: "",
        // employeeId: "",
        emailId: "",
        designation: "",
        mobileNumber: "",
        dateOfJoining: "",
        reportingManagerId: "",
        department: "",
        entityType: ""
      },
      isReportingManager: false,
      maxJoinDate: "",
      mobNum: "9999999999",
      selectedOption: null,
      departmentOption: [],
      designationOption: [],
      reportingManagerOption: [],
      entityTypeOption: [
        {
          Id: 1,
          name: "Ayana Investor"
        },
        {
          Id: 2,
          name: "Ayana User"
        }
      ],
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: "Created Successfully",
      id: "",
      reportingManagerMsg: ""
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: message => <div style={{ color: "red" }}>{message}</div>
      // reportingManagerId: {
      //   message: "Please select reporting manager",
      //   rule: (val, params, validator) => {
      //     if (this.state.userDetail.entityType == "2") {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   }
      // }
    });
    this.handleInput = this.handleInput.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  handleSelectChange = selectedOption => {
    this.setState({ selectedOption });
  };

  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => {
      return {
        userDetail: {
          ...prevState.userDetail,
          [name]: value
        }
      };
    });
    if (name == "entityType" && parseInt(value) == 1) {
      this.state.userDetail.reportingManagerId = "";
      this.setState({
        ...this.state.userDetail,
        isReportingManager: true,
        reportingManagerMsg: ""
      });
    }
    if (name == "entityType" && parseInt(value) == 2) {
      this.setState({
        isReportingManager: false
      });
    }
    // if ((name = "reportingManagerId" && value != "")) {
    //   this.setState({ reportingManagerMsg: "" });
    // }
    // if (this.state.userDetail.entityType == "1") {
    //   this.setState({ reportingManagerMsg: "" });
    // }
  }

  addUser(e) {
    e.preventDefault();

    // if (
    //   this.state.userDetail.entityType == "2" &&
    //   !this.state.userDetail.reportingManagerId
    // ) {
    //   this.setState({
    //     reportingManagerMsg: "The reporting manager field is mandatory"
    //   });
    //   return;
    // } else if (
    //   this.state.userDetail.entityType == "2" &&
    //   this.state.userDetail.reportingManagerId
    // ) {
    //   this.setState({ reportingManagerMsg: "" });
    // }

    if (this.validator.allValid()) {
      let deptArr = [];
      this.state.selectedOption.forEach(element => {
        deptArr.push(element.value);
      });
      this.state.userDetail.department = deptArr;
      this.state.userDetail.mobileNumber = this.state.mobNum;
      this.state.userDetail.designation = parseInt(
        this.state.userDetail.designation
      );
      this.state.userDetail.reportingManagerId =
        this.state.userDetail.reportingManagerId == ""
          ? null
          : parseInt(this.state.userDetail.reportingManagerId);
      this.state.userDetail.entityType = parseInt(
        this.state.userDetail.entityType
      );
      this.state.userDetail.name = this.state.userDetail.name.trim();
      this.state.userDetail.emailId = this.state.userDetail.emailId.trim();
      if (
        this.state.userDetail.entityType == "2" &&
        !this.state.userDetail.reportingManagerId
      ) {
        this.setState({
          reportingManagerMsg: "The reporting manager field is mandatory"
        });
        return;
      } else if (
        this.state.userDetail.entityType == "2" &&
        this.state.userDetail.reportingManagerId
      ) {
        this.setState({ reportingManagerMsg: "" });
      }
      this.props.client
        .mutate({
          mutation: createUser,
          variables: this.state.userDetail,
          fetchPolicy: "no-cache"
        })
        .then(result => {
          this.setState({
            reactModalVisible: true,
            id: result.data.createOrgUser.orgUser.Id
          });
        })
        .catch(error => {
          console.log("~~~error: ", error);
          this.setState({ loading: false, errors: [errorMessage(error)] });
          this.timer = setTimeout(() => {
            this.setState({ errors: [] });
          }, SET_TIMEOUT_VALUE);
        });
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
      if (
        this.state.userDetail.entityType == "2" &&
        !this.state.userDetail.reportingManagerId
      ) {
        this.setState({
          reportingManagerMsg: "The reporting manager field is mandatory"
        });
      } else if (
        this.state.userDetail.entityType == "2" &&
        this.state.userDetail.reportingManagerId
      ) {
        this.setState({ reportingManagerMsg: "" });
      }
    }
  }

  onFormClear() {
    let userDetail = {
      name: "",
      // employeeId: "",
      emailId: "",
      designation: "",
      mobileNumber: "",
      dateOfJoining: "",
      reportingManagerId: "",
      department: "",
      entityType: ""
    };
    this.validator.hideMessages();
    this.setState({
      userDetail: userDetail,
      mobNum: "9999999999",
      selectedOption: null,
      isReportingManager: false,
      reportingManagerMsg: ""
    });
  }

  getListOfDesignation(id) {
    this.props.client
      .query({
        query: getListofGenericMasterQuery,
        variables: {
          masterFor: id
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var user = result.data.getListofGenericMaster;

        this.initialState = {
          designationOption: user
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  getListOfDepartment(id) {
    this.props.client
      .query({
        query: getListofGenericMasterQuery,
        variables: {
          masterFor: id
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var user = result.data.getListofGenericMaster;
        let OptionArr = [];
        user.forEach(element => {
          OptionArr.push({
            value: element.Id,
            label: element.description
          });
        });
        this.initialState = {
          departmentOption: OptionArr
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  getListOfReportingManager() {
    this.props.client
      .query({
        query: getListofReportingManagersQuery,
        variables: {},
        fetchPolicy: "network-only"
      })
      .then(result => {
        var user = result.data.getListOfReportingManagers;

        this.initialState = {
          reportingManagerOption: user
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ errors: [errorMessage(error)] });
      });
  }

  componentDidMount() {
    this.setState({ maxJoinDate: format(new Date(), dateInputFormat) });
    this.getListOfDesignation(1);
    this.getListOfDepartment(2);
    this.getListOfReportingManager();
  }
  submitModal = () => {
    this.setState({ reactModalVisible: false, modalMessage: "" }, () => {
      // redirectTo("/userdetails?id=" + this.state.id);
      this.props.history.push("/userdetails?id=" + this.state.id);
    });
    // this.props.onUpdateUser();
  };

  render() {
    const {
      errors,
      userDetail,
      isReportingManager,
      designationOption,
      reportingManagerOption,
      maxJoinDate,
      selectedOption,
      departmentOption,
      entityTypeOption,
      mobNum,
      reactModalVisible,
      requireCancel,
      modalMessage
    } = this.state;
    return (
      <div>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
        />
        <h1 className="heading m-b-25">User Creation</h1>
        <div
          className="row"
          style={{
            display: errors.length === 0 ? "none" : "block"
          }}
        >
          <div className="col-md-6">
            <div className="alert alert-success" role="alert">
              <div className="row">
                <span className="danger-link">
                  <DisplayErrors errors={errors} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {/* Form Section start */}
            <div className="box-card">
              <form onSubmit={this.addUser}>
                <div className="row">
                  <div className="col-md-6 col-lg-4">
                    <InputComponent
                      required
                      type="text"
                      title="Name"
                      name="name"
                      label="Name"
                      value={userDetail.name}
                      placeholder="Enter Name"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div>
                  {/* <div className="col-md-6 col-lg-4">
                    <InputComponent
                      required
                      type="text"
                      title="EmployeeId"
                      name="employeeId"
                      label="Employee ID"
                      value={userDetail.employeeId}
                      placeholder="Enter Employee ID"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div> */}
                  <div className="col-md-6 col-lg-4">
                    <InputComponent
                      required
                      type="text"
                      title="emailId"
                      name="emailId"
                      label="Email Id for login"
                      value={userDetail.emailId}
                      placeholder="user@example.com"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required|email"
                    />
                  </div>
                  {/* </div>
                <div className="row"> */}
                  {/* <div className="col-md-6 col-lg-4">
                    <SelectComponent
                      required
                      label={"Designation"}
                      title={"designation"}
                      name={"designation"}
                      options={designationOption}
                      optionKey={"description"}
                      valueKey={"Id"}
                      value={userDetail.designation}
                      placeholder={"Select Designation"}
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div> */}
                  <div className="col-md-6 col-lg-4">
                    {/* <InputComponent
                    required
                    type="number"
                    title="mobileNumber"
                    name="mobileNumber"
                    label="Mobile Number"
                    value={userDetail.mobileNumber}
                    placeholder="Enter Mobile Number"
                    handleChange={this.handleInput}
                    validator={this.validator}
                    validation="required|min:10|max:10"
                  /> */}
                    <div className="form-group">
                      <label>MOBILE NUMBER</label>
                      <span style={{ color: "#ff0000", fontSize: "16px" }}>
                        *
                      </span>
                      <NumberFormat
                        value={mobNum}
                        format="##########"
                        placeholder="Enter Mobile Number"
                        className="form-control "
                        onValueChange={values => {
                          this.setState({ mobNum: values.value });
                        }}
                      />
                      {this.validator.message(
                        "mobileNumber",
                        mobNum,
                        "required|min:10"
                      )}
                    </div>
                  </div>
                  {/* <div className="col-md-6 col-lg-4">
                    <InputComponent
                      required
                      type="date"
                      title="dateOfJoining"
                      name="dateOfJoining"
                      label="Date Of Joining"
                      value={userDetail.dateOfJoining}
                      placeholder="Enter Date Of Joining"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                      max={maxJoinDate}
                    />
                  </div> */}
                  <div className="col-md-6 col-lg-4">
                    <SelectComponent
                      required
                      label={"Type"}
                      title={"entityType"}
                      name={"entityType"}
                      options={entityTypeOption}
                      optionKey={"name"}
                      valueKey={"Id"}
                      value={userDetail.entityType}
                      placeholder={"Select Type"}
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <SelectComponent
                      // required
                      disabled={isReportingManager}
                      label={"Reporting Manager"}
                      title={"reportingManagerId"}
                      name={"reportingManagerId"}
                      options={reportingManagerOption}
                      optionKey={"name"}
                      valueKey={"Id"}
                      value={userDetail.reportingManagerId}
                      placeholder={"Select Reporting Manager"}
                      handleChange={this.handleInput}
                      // validator={this.validator}
                      // validation={
                      //   userDetail.entityType == "2" ? "required" : false
                      // }
                      style={{ marginBottom: "0px" }}
                    />
                    <div
                      className="invalid-feedback"
                      style={{ color: "#ff0000" }}
                    >
                      {this.state.reportingManagerMsg}
                    </div>
                  </div>

                  {/* <div className="col-md-6 col-lg-4">
                    <SelectComponent
                      required
                      label={"Type"}
                      title={"entityType"}
                      name={"entityType"}
                      options={entityTypeOption}
                      optionKey={"name"}
                      valueKey={"Id"}
                      value={userDetail.entityType}
                      placeholder={"Select Type"}
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div> */}
                  <div className="col-md-6 col-lg-4">
                    <div className="form-group">
                      <label>
                        Department<span style={{ color: "red" }}>*</span>
                      </label>
                      <Select
                        value={selectedOption}
                        onChange={this.handleSelectChange}
                        options={departmentOption}
                        isMulti={true}
                        closeMenuOnSelect={false}
                      />
                      {this.validator.message(
                        "department",
                        selectedOption,
                        "required"
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-lg-5">
                    <button type="submit" className="btn btn-danger">
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-light m-l-50"
                      onClick={() => this.onFormClear()}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {/* Form Section End */}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withApollo(UserAdd));
