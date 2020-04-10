import React from "react";
import Select from "react-select";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";

import { format } from "date-fns";

import { dateFormatMonth } from "../../constants/app-constants";
import { ALL_EMPLOYEE_LIST } from "../../services/graphql/queries/user";
import Pagination from "../Common/Pagination";
import NotAccessible from "../Common/NotAccessible";
import InputComponent from "../Common/form-component/InputComponent";
import ButtonComponent from "../Common/form-component/ButtonComponent";
import {
  SET_TIMEOUT_VALUE,
  dateInputFormat
} from "../../constants/app-constants";
import { getListofGenericMasterQuery } from "../../services/graphql/queries/user";
import { getListofProjectsByCompanyId } from "../../services/graphql/queries/document-upload";
import { RISK_REGISTER } from "../../services/graphql/queries/riskRegister";
import { ApproveImage } from "../../static/images/svg/approve.svg";
import { ViewImg } from "../../static/images/svg/view.svg";
const customStyles = {};
const statusOptions = [
  { value: 1, label: "Open" },
  { value: 2, label: "Closed" }
];
const customOptions = [
  { value: 1, label: "Select All" },
  { value: 2, label: "Deviated" }
];
class RiskRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: [],
      companySelectedOption: null,
      companyOptions: [],
      projectSelectedOption: null,
      projectOptions: [],
      riskSelectedOption: null,
      riskOptions: [],
      statusSelectedOptions: null,
      departmentSelectedOption: null,
      departmentOptions: [],
      customSelectedOptions: null,
      loading: false,
      riskRegisterData: [],
      userOptions: [],
      userSelectedOptions: null,
      riskId: null
    };
  }

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
            value: element.Id,
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
            riskOptions: OptionArr
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
  getListOfProjects = id => {
    this.props.client
      .query({
        query: getListofProjectsByCompanyId,
        variables: {
          companyId: ""
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var projectList = result.data.getListOfProjectsByCompanyId;
        let projArr = [];
        projectList.forEach(element => {
          let obj = {
            value: element.projectDetail.Id,
            label: element.projectDetail.description
          };
          projArr.push(obj);
        });
        this.initialState = {
          projectOption: projArr
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  };

  getUserList() {
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

        let userArr = [];
        users.forEach(element => {
          let obj = {
            value: element.Id,
            label: element.name
          };
          userArr.push(obj);
        });
        this.initialState = {
          userOptions: userArr
        };
        this.setState({
          ...this.initialState,
          loading: false,
          error: "",
          deSelectEmployees: false
        });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }
  getListOfRisk = () => {
    this.setState({ loading: true });
    const {
      companySelectedOption,
      companyOptions,
      projectOptions,
      projectSelectedOption,
      riskOptions,
      riskSelectedOption,
      statusSelectedOptions,
      departmentOptions,
      departmentSelectedOption,
      customSelectedOptions,
      userOptions,
      userSelectedOptions,
      riskId
    } = this.state;

    let risk = null;
    riskSelectedOption &&
      riskSelectedOption.forEach(element => {
        risk.push(element.value);
      });

    let company = null;
    companySelectedOption &&
      companySelectedOption.forEach(element => {
        company.push(element.value);
      });
    let project = null;
    projectSelectedOption &&
      projectSelectedOption.forEach(element => {
        project.push(element.value);
      });

    let user = null;
    userSelectedOptions &&
      userSelectedOptions.forEach(element => {
        user.push(element.value);
      });
    let status = null;

    this.props.client
      .query({
        query: RISK_REGISTER,
        variables: {
          riskId: riskId,
          companyId: company,
          projectId: project,
          riskCategory: risk,
          status: statusSelectedOptions ? statusSelectedOptions.value : null,
          deviated: customSelectedOptions
            ? customSelectedOptions.value == 1
              ? false
              : true
            : false,
          responsible: user
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var riskList = result.data.getListOfRisk;
        console.log("risk list", riskList);
        this.setState({
          loading: false,
          error: "",
          riskRegisterData: riskList
        });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  };

  clearFilter = () => {
    this.setState(
      {
        companySelectedOption: null,

        projectSelectedOption: null,

        riskSelectedOption: null,

        statusSelectedOptions: null,
        departmentSelectedOption: null,

        customSelectedOptions: null,
        userSelectedOptions: null,
        riskId: null
      },
      () => {
        this.getListOfRisk();
      }
    );
  };
  accordion(data) {
    return (
      <tr>
        <td
          colSpan={9}
          style={{
            fontSize: "13px",
            textAlign: "center",
            whiteSpace: "normal"
          }}
        >
          <table
            className="table table-style-1"
            style={{ paddingLeft: "45px" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th scope="col">MITIGATION PLAN</th>
                <th scope="col">DEPARTMENT</th>
                <th scope="col">RESPONSIBLE</th>
                <th scope="col">STATUS</th>
                <th scope="col">DUE/COMPLETION DATE</th>
                <th scope="col">FORECAST DATE</th>
                <th scope="col">ACTION</th>
              </tr>
            </thead>
            <tbody className="mitigation-table">
              {data && data.length
                ? data.map((ele, index) => {
                    return (
                      <tr>
                        <td>{ele.id}</td>
                        <td>{ele.name}</td>
                        <td>Finance</td>
                        <td>
                          {ele.responsible ? ele.responsible.loginId : ""}
                        </td>
                        <td>{ele.status ? ele.status.name : ""}</td>
                        <td>{format(ele.completionDate, dateFormatMonth)}</td>
                        <td>{format(ele.forecastDate, dateFormatMonth)}</td>
                        <td>
                          {ele.status && ele.status.Id == 1 ? (
                            <a href="#">
                              <img src={ApproveImage} />
                            </a>
                          ) : (
                            <a href="#">
                              <img src={ViewImg} />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </td>
      </tr>
    );
  }
  componentDidMount() {
    this.getListOfOptions(3);
    this.getListOfOptions(4);
    this.getListOfOptions(18);
    this.getListOfOptions(2);
    this.getListOfRisk();
    this.getUserList();
  }
  componentDidUpdate() {}
  render() {
    const {
      companySelectedOption,
      companyOptions,
      projectOptions,
      projectSelectedOption,
      riskOptions,
      riskSelectedOption,
      statusSelectedOptions,
      departmentOptions,
      departmentSelectedOption,
      customSelectedOptions,
      loading,
      riskRegisterData,
      userOptions,
      userSelectedOptions,
      riskId
    } = this.state;
    console.log("company", companySelectedOption);

    return (
      <>
        <div className="row align-items-center no-gutters">
          <div className="col-md-8">
            <h1 className="heading m-b-0">Risk Register</h1>
          </div>
          <div className="col-md-4 text-right">
            <a href="/add-risk" className="btn btn-danger">
              Add
            </a>
            {/* Changed btn-danger*/}
            {/* <button class="btn btn-primary filter-btn  m-l-10">Filter</button> */}
          </div>
          {/* style="width: 100%;    box-shadow: 0 0 2px rgba(0,0,0, .65);
  padding: 15px;
  border-radius: 3px;" */}
          <div className="col-md-12 mt-3">
            <div className="box-card">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <Select
                      value={companySelectedOption}
                      onChange={e => {
                        this.setState({ companySelectedOption: e }, e => {
                          console.log("inside", companySelectedOption);
                        });
                      }}
                      options={companyOptions}
                      isMulti={true}
                      closeMenuOnSelect={false}
                      placeholder="Select Company"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <Select
                      value={projectSelectedOption}
                      onChange={e => {
                        this.setState({ projectSelectedOption: e });
                      }}
                      options={projectOptions}
                      isMulti={true}
                      closeMenuOnSelect={false}
                      placeholder="Select Project"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <Select
                      value={riskSelectedOption}
                      onChange={e => {
                        this.setState({ riskSelectedOption: e });
                      }}
                      options={riskOptions}
                      isMulti={true}
                      closeMenuOnSelect={false}
                      placeholder="Select Risk Category"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <input
                      type="number"
                      min="1"
                      value={riskId}
                      className="form-control"
                      style={{
                        height: "37px !important",
                        borderColor: "hsl(0,0%,80%)"
                      }}
                      placeholder="Enter Risk Id"
                      onChange={e => {
                        this.setState({ riskId: parseInt(e.target.value) });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <Select
                      value={statusSelectedOptions}
                      onChange={e => {
                        this.setState({ statusSelectedOptions: e });
                      }}
                      options={statusOptions}
                      placeholder="Select Status"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <Select
                      value={departmentSelectedOption}
                      onChange={e => {
                        this.setState({ departmentSelectedOption: e });
                      }}
                      options={departmentOptions}
                      isMulti={true}
                      closeMenuOnSelect={false}
                      placeholder="Select Department"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <Select
                      value={userSelectedOptions}
                      onChange={e => {
                        this.setState({ userSelectedOptions: e });
                      }}
                      isMulti
                      closeMenuOnSelect={false}
                      options={userOptions}
                      placeholder="Select Assignee"
                      styles={customStyles}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <Select
                      value={customSelectedOptions}
                      onChange={e => {
                        this.setState({ customSelectedOptions: e });
                      }}
                      options={customOptions}
                      placeholder="Custom Filter"
                      styles={customStyles}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <ButtonComponent
                    className="btn-danger"
                    type="button"
                    title="Apply"
                    onClick={() => {
                      this.getListOfRisk();
                    }}
                  ></ButtonComponent>

                  <ButtonComponent
                    className="btn-light  ml-3"
                    type="button"
                    title="Clear"
                    onClick={() => {
                      this.clearFilter();
                    }}
                  ></ButtonComponent>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table
            className="table table-style-1"
            data-toggle="collapse"
            data-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            <thead>
              <tr>
                <th />
                <th>ID</th>
                <th scope="col">RISK DESCRIPTION</th>
                <th scope="col">CATEGORY</th>
                {/* <th scope="col">DESCRIPTION</!*/}
                <th scope="col" style={{ width: "270px" }}>
                  COMPANY
                </th>
                <th scope="col">PROJECT</th>
                <th scope="col">SEVERITY</th>
                <th scope="col">STATUS</th>
                <th scope="col">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {riskRegisterData && riskRegisterData.length ? (
                riskRegisterData.map((data, index) => {
                  return (
                    <>
                      <tr>
                        <td>
                          {data.mitigationplanSet.length > 0 ? (
                            <i
                              className="fa fa-chevron-circle-down"
                              aria-hidden="true"
                              onClick={() => {
                                this.setState(prevState => {
                                  let display = [];
                                  display[index] = !prevState.display[index];
                                  return {
                                    display: [...display]
                                  };
                                });
                              }}
                            />
                          ) : null}
                        </td>
                        <td>{data.id}</td>
                        <td>{data.name}</td>
                        <td>
                          {data.categoryId ? data.categoryId.description : ""}
                        </td>
                        <td>
                          {data.companyId ? data.companyId.description : ""}
                        </td>
                        <td>
                          {data.projectId ? data.projectId.description : ""}
                        </td>
                        <td>Low</td>
                        <td>Active</td>
                        <td>
                          <a href="riskDetails.html" className="link-primary">
                            <img src={ViewImg} />
                          </a>
                        </td>
                      </tr>

                      {this.state.display[index] &&
                      data.mitigationplanSet.length > 0
                        ? this.accordion(data.mitigationplanSet)
                        : null}
                      {/* {this.accordion(data.mitigationPlanSet)} */}
                    </>
                  );
                })
              ) : loading ? (
                <tr>
                  <td align={"center"} colSpan="9">
                    Fetching
                  </td>
                </tr>
              ) : (
                <tr>
                  <td align={"center"} colSpan="9">
                    No Data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Table Section End */}
        {/* Pagination Start */}
      </>
    );
  }
}

export default withApollo(RiskRegister);
