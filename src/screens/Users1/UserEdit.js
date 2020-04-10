import React from "react";
import SimpleReactValidator from "simple-react-validator";
import Select from "react-select";
import NumberFormat from "react-number-format";
import { format } from "date-fns";

import ReactModal from "../Common/ReactModal";
import InputComponent from "../Common/form-component/InputComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import { getUserStatus } from "../Common/ListOfStatus";
import DisplayErrors from "../Common/DisplayErrors";

import { withApollo } from "react-apollo";
import {
  getListofGenericMasterQuery,
  getListofReportingManagersQuery,
  updateUser,
  unlockUser
} from "../../services/graphql/queries/user";

import {
  SET_TIMEOUT_VALUE,
  dateInputFormat,
  dateFormatMonth
} from "../../constants/app-constants";
import { errorMessage } from "../../miscellaneous/error-messages";

class UserEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
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
        status: ""
      },
      isReportingManager: false,
      maxJoinDate: "",
      mobNum: "",
      selectedOption: null,
      departmentOption: [],
      designationOption: [],
      reportingManagerOption: [],
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: ""
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,

      element: message => <div style={{ color: "red" }}>{message}</div>
    });
    this.handleInput = this.handleInput.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.submitModal = this.submitModal.bind(this);
  }

  submitModal() {
    this.setState({ reactModalVisible: false, modalMessage: "" });
    this.props.onUpdateUser();
    this.props.toggleEditMode(false);
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
      this.setState({ ...this.state.userDetail, isReportingManager: true });
    }
  }

  updateUser(e) {
    e.preventDefault();
    if (this.validator.allValid()) {
      // this.state.userDetail.department = this.state.selectedOption[0].value;
      let deptArr = [];
      this.state.selectedOption.forEach(element => {
        deptArr.push(element.value);
      });
      this.state.userDetail.department = deptArr;
      this.state.userDetail.mobileNumber = this.state.mobNum;
      // this.state.userDetail.designation = parseInt(
      //   this.state.userDetail.designation
      // );
      this.state.userDetail.reportingManagerId = parseInt(
        this.state.userDetail.reportingManagerId
      );
      this.state.userDetail.id = this.props.user.Id;
      this.state.userDetail.name = this.state.userDetail.name.trim();
      this.state.userDetail.emailId = this.state.userDetail.emailId.trim();
      this.state.userDetail.status = parseInt(this.state.userDetail.status);
      this.props.client
        .mutate({
          mutation: updateUser,
          variables: this.state.userDetail,
          fetchPolicy: "no-cache"
        })
        .then(result => {
          this.setState({
            reactModalVisible: true,
            modalMessage: "Updated Successfully"
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
    }
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
        this.setState({ loading: false, errors: [errorMessage(error)] });
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
        this.setState({ loading: false, errors: [errorMessage(error)] });
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

  updateData() {
    const {
      name,
      // employeeId,
      emailId,
      mobileNumber,
      lockedDetail,
      designationDetail,
      dateOfJoining,
      reportingManagerId,
      department,
      departmentDetail,
      status
    } = this.props.user;
    let userDetail = {
      name: name,
      // employeeId: employeeId,
      emailId: emailId,
      // designation: designationDetail.Id,
      mobileNumber: mobileNumber,
      // dateOfJoining: dateOfJoining,
      reportingManagerId: reportingManagerId != "" ? reportingManagerId : null,
      department: department,
      status: status
    };

    let optionArr = [];
    departmentDetail.forEach(element => {
      optionArr.push({
        value: element.Id,
        label: element.description
      });
    });
    this.setState({
      userDetail: userDetail,
      mobNum: mobileNumber,
      selectedOption: optionArr,
      isReportingManager:
        lockedDetail && lockedDetail.entityType == 2 ? false : true
    });
  }

  unlockUser() {
    this.props.client
      .mutate({
        mutation: unlockUser,
        variables: { id: this.props.user.Id },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        this.setState({
          reactModalVisible: true,
          modalMessage: "User Unlocked Successfully"
        });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, errors: [errorMessage(error)] });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  }

  componentDidMount() {
    if (this.props.user) {
      // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
      this.setState({ maxJoinDate: format(new Date(), dateInputFormat) });
      // this.getListOfDesignation(1);
      this.getListOfDepartment(2);
      this.getListOfReportingManager();
      this.updateData();
    }
  }

  render() {
    const {
      loading,
      errors,
      userDetail,
      isReportingManager,
      designationOption,
      reportingManagerOption,
      maxJoinDate,
      selectedOption,
      departmentOption,
      mobNum,
      reactModalVisible,
      requireCancel,
      modalMessage
    } = this.state;
    const {
      createdByDetail,
      createdOn,
      modifiedByDetail,
      lastModifiedOn,
      status,
      lockedDetail
    } = this.props.user;
    const statusOptions = getUserStatus(status);
    return (
      <div>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
        />
        <h1 className="heading m-b-25">User Details</h1>
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
              <form onSubmit={this.updateUser}>
                <div className="row">
                  <div className="col-md-6 col-lg-3">
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
                  {/* <div className="col-md-6 col-lg-3">
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
                  <div className="col-md-6 col-lg-3">
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
                  <div className="col-md-6 col-lg-3">
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
                  <div className="col-md-6 col-lg-3">
                    <InputComponent
                      readOnly
                      type="text"
                      title="userType"
                      name="userType"
                      label="User Type"
                      value={
                        lockedDetail &&
                        lockedDetail.entityType &&
                        lockedDetail.entityType == 1
                          ? "Ayana Investor"
                          : lockedDetail.entityType &&
                            lockedDetail.entityType == 2
                          ? "Ayana User"
                          : ""
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  {/* <div className="col-md-6 col-lg-3"> */}
                  {/* <SelectComponent
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
                  </div>
                  <div className="col-md-6 col-lg-3">
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
                  </div>*/}
                  <div className="col-md-6 col-lg-3">
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
                      validator={this.validator}
                      validation={
                        lockedDetail && lockedDetail.entityType == 2
                          ? "required"
                          : false
                      }
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
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
                        this.state.selectedOption,
                        "required"
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <SelectComponent
                      required
                      label={"Status"}
                      title={"status"}
                      name={"status"}
                      options={statusOptions}
                      optionKey={"name"}
                      valueKey={"id"}
                      value={userDetail.status}
                      placeholder={"Select Designation"}
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div>
                  {/* <div className="col-md-6 col-lg-3">
                    <InputComponent
                      readOnly
                      type="text"
                      title="userType"
                      name="userType"
                      label="User Type"
                      value={
                        lockedDetail &&
                        lockedDetail.entityType &&
                        lockedDetail.entityType == 1
                          ? "Ayana Investor"
                          : lockedDetail.entityType &&
                            lockedDetail.entityType == 2
                          ? "Ayana User"
                          : ""
                      }
                    />
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-md-6 col-lg-3">
                    {/* <div className="form-group">
                    <label>Created By</label>
                    <input type="text" readOnly className="form-control " defaultValue={createdByDetail && createdByDetail.loginId ? createdByDetail.loginId : ''} />
                  </div> */}
                    <InputComponent
                      readOnly
                      type="text"
                      title="createdBy"
                      name="createdBy"
                      label="Created By"
                      value={
                        createdByDetail && createdByDetail.loginId
                          ? createdByDetail.loginId
                          : ""
                      }
                      placeholder=""
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    {/* <div className="form-group">
                    <label>Created On</label>
                    <input type="text" readOnly className="form-control-plaintext " defaultValue={createdOn?format(createdOn, dateFormatMonth):''} />
                  </div> */}
                    <InputComponent
                      readOnly
                      type="text"
                      title="createdOn"
                      name="createdOn"
                      label="Created On"
                      value={
                        createdOn ? format(createdOn, dateFormatMonth) : ""
                      }
                      placeholder=""
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    {/* <div className="form-group">
                    <label>Last Modified By</label>
                    <input type="text" readOnly className="form-control-plaintext " defaultValue={modifiedByDetail && modifiedByDetail.loginId ? modifiedByDetail.loginId : ''} />
                  </div> */}
                    <InputComponent
                      readOnly
                      type="text"
                      title="modifiedBy"
                      name="modifiedBy"
                      label="Modified By"
                      value={
                        modifiedByDetail && modifiedByDetail.loginId
                          ? modifiedByDetail.loginId
                          : ""
                      }
                      placeholder=""
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    {/* <div className="form-group">
                    <label>Last Modified On</label>
                    <input type="text" readOnly className="form-control-plaintext " defaultValue={lastModifiedOn?format(lastModifiedOn, dateFormatMonth):''} />
                  </div> */}
                    <InputComponent
                      readOnly
                      type="text"
                      title="lastModifiedOn"
                      name="lastModifiedOn"
                      label="Last Modified On"
                      value={
                        lastModifiedOn
                          ? format(lastModifiedOn, dateFormatMonth)
                          : ""
                      }
                      placeholder=""
                    />
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-md-6 col-lg-3">
                    <SelectComponent
                      required
                      label={"Status"}
                      title={"status"}
                      name={"status"}
                      options={statusOptions}
                      optionKey={"name"}
                      valueKey={"id"}
                      value={userDetail.status}
                      placeholder={"Select Designation"}
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div>
                </div> */}
                <div className="row">
                  <div className="col-md-12">
                    <button type="submit" className="btn btn-danger">
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-light m-l-50"
                      onClick={() => this.updateData()}
                    >
                      Reset
                    </button>
                    {lockedDetail && lockedDetail.locked ? (
                      <button
                        type="button"
                        className="btn btn-danger m-l-50"
                        onClick={() => this.unlockUser()}
                      >
                        Unlock User
                      </button>
                    ) : null}
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

export default withApollo(UserEdit);
