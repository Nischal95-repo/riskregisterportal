import React from "react";
import { withApollo } from "react-apollo";
import { format } from "date-fns";
import {
  getListofGenericMasterQuery,
  ALL_EMPLOYEE_LIST,
} from "../../services/graphql/queries/user";
import { CREATE_MITIGATION } from "../../services/graphql/queries/riskRegister";
import SimpleReactValidator from "simple-react-validator";
import ButtonComponent from "../Common/form-component/ButtonComponent";
import TextAreaComponent from "../Common/form-component/TextAreComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import { compareValues } from "../Common/customSort";
import CloseSvg from "../../static/images/svg/Close.svg";
import Select from "react-select";
import InputComponent from "../Common/form-component/InputComponent";
import {
  SET_TIMEOUT_VALUE,
  dateInputFormat,
} from "../../constants/app-constants";
import { errorMessage } from "../../miscellaneous/error-messages";
import { errorMsg, successMsg } from "../Common/alert";
class MitigationAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mitigationDetail: {
        name: "",
        responsible: null,
        completionDate: "",
        department: null,
      },
      departmentOptions: [],
      userOptions: [],
      options: [],
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
        mitigationDetail: {
          ...prevState.mitigationDetail,
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
    // if (name == "completionDate") {
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
  getUserList(department) {
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

  submitMitigation = () => {
    this.state.mitigationDetail.riskId = parseInt(this.props.riskId);
    this.props.client
      .mutate({
        mutation: CREATE_MITIGATION,
        variables: this.state.mitigationDetail,
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        console.log("result", result);
        successMsg("Mitigation created successfully");
        this.props.updateList();
        this.props.changeMode();
      })
      .catch((error) => {
        console.log("error", error);
        errorMsg([errorMessage(error)][0][0]);
      });
  };

  clear() {
    let mitigationDetail = {
      name: "",
      responsible: null,
      completionDate: "",
      department: null,
    };
    this.setState({ userOptions: [], mitigationDetail: mitigationDetail });
    this.validator.hideMessages();
  }

  componentDidMount() {
    this.getListOfOptions(2);
    this.getUserList();
  }
  render() {
    const { mitigationDetail, userOptions, departmentOptions } = this.state;
    console.log("user options", userOptions, departmentOptions);
    return (
      <>
        <div id="mitigationAdd">
          <div className="row align-items-center">
            <div className="col-md-10">
              <h1 className="heading m-b-0">Mitigation Plan Creation</h1>
            </div>
            <div className="col-md-2">
              <div className="text-right">
                <a
                  className="link-click"
                  href="#"
                  data-placement="bottom"
                  title="Close"
                  data-toggle="modal"
                  onClick={() => {
                    this.props.changeMode();
                  }}
                >
                  <img src={CloseSvg} />
                  Close
                </a>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-3 col-lg-3">
              <div className="form-group">
                <TextAreaComponent
                  required
                  label="Mitigation Plan"
                  title="mitigation plan"
                  name="name"
                  value={mitigationDetail.name}
                  placeholder="Enter description"
                  handleChange={(e) => {
                    this.handleInput(e);
                  }}
                  validation="required"
                  validator={this.validator}
                ></TextAreaComponent>
              </div>
            </div>
            <div className="col-md-3 col-lg-3">
              <SelectComponent
                required
                label="Department"
                title="department"
                name="department"
                options={departmentOptions}
                optionKey={"label"}
                valueKey={"Id"}
                value={mitigationDetail.department}
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
                value={mitigationDetail.responsible}
                placeholder={"Select Responsible"}
                handleChange={(e) => {
                  this.handleInput(e);
                }}
                validator={this.validator}
                validation="required"
              />
            </div>
            <div className="col-md-3 col-lg-3">
              <InputComponent
                required
                label="Due/Completion Date"
                title="due/completion date"
                name="completionDate"
                value={mitigationDetail.completionDate}
                handleChange={(e) => {
                  this.handleInput(e);
                }}
                validator={this.validator}
                validation="required"
                type="date"
                min={format(new Date(), dateInputFormat)}
              ></InputComponent>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-12 col-lg-12 ">
              <div className="row" style={{ paddingLeft: "10px" }}>
                <label />
                <div className="upload-btn-wrapper mt-3">
                  <button className="btn btn-light">Upload Attachment</button>
                  <input type="file" name="myfile" />
                </div>
              </div>
              <label className="mt-2">Attachment List</label>
              <div className="row attachment-list">
                <ol>
                  <li>
                    file1.pdf <img src="../images/close.svg" />
                  </li>
                  <li>
                    file2.pdf
                    <img src="../images/close.svg" />
                  </li>
                  <li>
                    file3.pdf <img src="../images/close.svg" />
                  </li>
                </ol>
              </div>
            </div>
          </div> */}
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
        </div>
      </>
    );
  }
}

export default withApollo(MitigationAdd);
