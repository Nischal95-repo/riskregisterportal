import React from "react";

import RiskView from "../RiskRegister/RiskView";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";
import { format } from "date-fns";
import { dateFormatMonth, dateFormat } from "../../constants/app-constants";
import {
  getListofGenericMasterQuery,
  ALL_EMPLOYEE_LIST
} from "../../services/graphql/queries/user";
import {
  GET_MITIGATION_PLAN_BY_ID,
  CREATE_MITIGATION_ACTIVITY
} from "../../services/graphql/queries/riskRegister";
import SimpleReactValidator from "simple-react-validator";
import ButtonComponent from "../Common/form-component/ButtonComponent";
import TextAreaComponent from "../Common/form-component/TextAreComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import { compareValues } from "../Common/customSort";
class Mitigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activityDetail: {
        name: "",
        responsible: null,
        forecastDate: "",
        department: null,
        status: null
      },
      departmentOptions: [],
      userOptions: [],
      options: [],
      showReassign: false,
      activities: [],
      loading: true,
      errors: [],
      error: "",
      mitigationDetails: {},
      riskId: "",
      mitigationplanId: ""
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: message => <div style={{ color: "red" }}>{message}</div>
    });
  }
  handleInput = e => {
    let value = e.target.value;
    let name = e.target.name;
    if (value !== "" && (name == "department" || name == "responsible")) {
      value = parseInt(value);
    }
    this.setState(prevState => {
      return {
        activityDetail: {
          ...prevState.activityDetail,
          [name]: value
        }
      };
    });
    if (name == "department") {
      debugger;
      let users = [];

      this.state.options.forEach(element => {
        console.log("department", element, value);
        if (element.department.includes(parseInt(value))) {
          let obj = {
            Id: element.Id,
            label: element.name
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
          masterFor: id
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var user = result.data.getListofGenericMaster;
        let OptionArr = [];
        user.forEach(element => {
          OptionArr.push({
            Id: element.Id,
            label: element.description
          });
        });
        if (id == 3) {
          this.initialState = {
            companyOptions: OptionArr
          };
        } else if (id == 4) {
          this.initialState = {
            projectOptions: OptionArr
          };
        } else if (id == 18)
          this.initialState = {
            riskOptions: OptionArr.sort(compareValues("label"))
          };
        else if (id == 2)
          this.initialState = {
            departmentOptions: OptionArr
          };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
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
          status: 1
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var users = result.data.getListOfAyanaEmployees;

        this.setState({
          ...this.initialState,
          loading: false,
          error: "",
          options: users
        });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }
  getMitigationDetails = () => {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: GET_MITIGATION_PLAN_BY_ID,
        variables: { id: parseInt(this.state.mitigationplanId) },
        fetchPolicy: "network-only"
      })
      .then(result => {
        console.log("result", result);
        let data = result.data.getMitigationPlanById;
        this.setState({ mitigationDetails: data, loading: false });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  submitMitigationActivity = () => {
    const { showReassign, activityDetail } = this.state;
    let variables = {};
    if (!showReassign) {
      variables = {
        name: activityDetail.name,
        mitigationPlanId: parseInt(this.state.mitigationplanId),
        status: 2,
        department: activityDetail.department,
        responsible: activityDetail.responsible
      };
    } else {
      variables = {
        name: activityDetail.name == "" ? "Approved" : activityDetail.name,
        mitigationPlanId: parseInt(this.props.mitigationPlanId),
        department: activityDetail.department,
        responsible: activityDetail.responsible,
        status: 1
      };
    }
    this.props.client
      .mutate({
        mutation: CREATE_MITIGATION_ACTIVITY,
        variables: variables,
        fetchPolicy: "no-cache"
      })
      .then(result => {
        console.log("result", result);
        // this.getListOfActivities();
        this.props.history.push("risk-detail");
        // this.props.toggleMode();
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  componentDidMount() {
    this.getListOfOptions(2);
    this.getUserList();
    this.setState(
      { mitigationplanId: localStorage.getItem("mitigationPlanId") },
      () => {
        this.getMitigationDetails();
      }
    );
  }

  render() {
    const {
      activityDetail,
      departmentOptions,
      userOptions,
      showReassign,
      loading,
      activities,
      mitigationDetails
    } = this.state;
    return (
      <>
        <div className="box-card">
          <div className="row">
            <div className="col-md-4 col-lg-3">
              <div className="form-group">
                <label>Mitigation Plan </label>

                <div className="form-control-plaintext word-break">
                  {mitigationDetails.name}
                </div>
              </div>
            </div>
            <div className="col-md-3 col-lg-3">
              <div className="form-group">
                <label>Responsible</label>
                <div className="form-control-plaintext word-break">
                  {mitigationDetails.responsible
                    ? mitigationDetails.responsible.loginId
                    : ""}
                </div>
              </div>
            </div>
            <div className="col-md-3 col-lg-3">
              <div className="form-group">
                <label>Due/Completion Date</label>
                <div className="form-control-plaintext word-break">
                  {format(mitigationDetails.completionDate, dateFormat)}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <div className="form-group">
                <label>Created By</label>
                <div className="form-control-plaintext word-break">
                  {mitigationDetails.createdBy
                    ? mitigationDetails.createdBy.loginId
                    : ""}
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="form-group">
                <label>Created On</label>
                <div className="form-control-plaintext word-break">
                  {format(mitigationDetails.createdOn, dateFormatMonth)}
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="form-group">
                <label>Last Modified By</label>
                <div className="form-control-plaintext word-break">
                  {mitigationDetails.lastModifiedBy
                    ? mitigationDetails.lastModifiedBy.loginId
                    : ""}
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="form-group">
                <label>Last Modified On</label>
                <div className="form-control-plaintext word-break">
                  {format(mitigationDetails.lastModifiedOn, dateFormatMonth)}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-lg-4">
              <TextAreaComponent
                required
                label="Remarks"
                title="remarks"
                name="name"
                value={activityDetail.name}
                placeholder="Enter remarks"
                handleChange={e => {
                  this.handleInput(e);
                }}
                // validation="required"
                // validator={this.validator}
              ></TextAreaComponent>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-8">
              <ButtonComponent
                className="btn-danger"
                type="button"
                title="Approve"
                onClick={() => {
                  // this.validator.hideMessages();
                  this.submitMitigationActivity();
                }}
              ></ButtonComponent>

              <ButtonComponent
                className="btn-light  ml-3"
                type="button"
                title="Reassign"
                onClick={() => {
                  this.clear();
                }}
              ></ButtonComponent>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(withApollo(Mitigation));
