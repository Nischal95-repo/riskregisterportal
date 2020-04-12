import React from "react";

import { withApollo } from "react-apollo";
import {
  getListofGenericMasterQuery,
  ALL_EMPLOYEE_LIST
} from "../../../services/graphql/queries/user";
import {
  GET_LIST_OF_EMPLOYEES,
  ADD_EMPLOYEE
} from "../../../services/graphql/queries/riskRegister";
import SimpleReactValidator from "simple-react-validator";
import ButtonComponent from "../../Common/form-component/ButtonComponent";
import TextAreaComponent from "../../Common/form-component/TextAreComponent";
import SelectComponent from "../../Common/form-component/SelectComponent";
import ReactModal from "../../Common/ReactModal";
import DisplayErrors from "../../Common/DisplayErrors";
import { compareValues } from "../../Common/customSort";
import { SET_TIMEOUT_VALUE } from "../../../constants/app-constants";

import { errorMessage } from "../../../miscellaneous/error-messages";

class AddEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeDetail: {
        department: null,

        userId: null
      },
      departmentOptions: [],
      options: [],
      userOptions: [],
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: "Employee Added successfully",
      errors: []
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: message => <div style={{ color: "red" }}>{message}</div>
    });
  }
  handleInput = e => {
    let value = e.target.value;
    let name = e.target.name;
    if (value !== "" && (name == "department" || name == "userId")) {
      value = parseInt(value);
    }
    this.setState(prevState => {
      return {
        employeeDetail: {
          ...prevState.employeeDetail,
          [name]: value
        }
      };
    });
    if (name == "department") {
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
  getUserList(department) {
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

  submitMitigation = () => {
    this.state.employeeDetail.riskId = parseInt(this.props.riskId);
    this.props.client
      .mutate({
        mutation: ADD_EMPLOYEE,
        variables: this.state.employeeDetail,
        fetchPolicy: "no-cache"
      })
      .then(result => {
        console.log("result", result);

        this.props.changeMode();
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  clear() {
    let employeeDetail = {
      userId: null,

      department: null
    };
    this.setState({ userOptions: [], employeeDetail: employeeDetail });
    this.validator.hideMessages();
  }

  componentDidMount() {
    this.getListOfOptions(2);
    this.getUserList();
  }
  render() {
    const {
      errors,
      employeeDetail,
      userOptions,
      departmentOptions
    } = this.state;
    return (
      <>
        <div className="row align-items-center">
          <div className="col-md-10">
            <h1 className="heading m-b-0">Add Employees</h1>
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
          </div>
          <div className="col-md-2 text-right">
            <a href="#" onClick={this.props.changeMode} className="link-click ">
              <svg
                x="0px"
                y="0px"
                width="16px"
                height="16px"
                viewBox="0 0 16 16"
                enableBackground="new 0 0 16 16"
                xmlSpace="preserve"
              >
                <g>
                  <line
                    fill="none"
                    stroke="#69951a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    x1="3.25"
                    y1="3.25"
                    x2="12.75"
                    y2="12.75"
                  />
                  <line
                    fill="none"
                    stroke="#69951a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit={10}
                    x1="12.75"
                    y1="3.25"
                    x2="3.25"
                    y2="12.75"
                  />
                </g>
              </svg>
              Close
            </a>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-3 col-lg-3">
            <SelectComponent
              required
              label="Department"
              title="department"
              name="department"
              options={departmentOptions}
              optionKey={"label"}
              valueKey={"Id"}
              value={employeeDetail.department}
              placeholder={"Select Department"}
              handleChange={e => {
                this.handleInput(e);
              }}
              validator={this.validator}
              validation="required"
            />
          </div>
          <div className="col-md-3 col-lg-3">
            <SelectComponent
              required
              label="Employee"
              title="employee"
              name="userId"
              options={userOptions}
              optionKey={"label"}
              valueKey={"Id"}
              value={employeeDetail.userId}
              placeholder={"Select Employee"}
              handleChange={e => {
                this.handleInput(e);
              }}
              validator={this.validator}
              validation="required"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-8">
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
          </div>
        </div>
      </>
    );
  }
}
export default withApollo(AddEmployee);
