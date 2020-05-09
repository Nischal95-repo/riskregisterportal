import React from "react";
import Select from "react-select";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";
import { format } from "date-fns";
import { dateFormatMonth, dateFormat } from "../../constants/app-constants";

import NotAccessible from "../Common/NotAccessible";
import InputComponent from "../Common/form-component/InputComponent";
import Pagination from "../Common/Pagination";
import ButtonComponent from "../Common/form-component/ButtonComponent";
import {
  SET_TIMEOUT_VALUE,
  dateInputFormat,
  PAGINATION_OFFSET_VALUE,
} from "../../constants/app-constants";
import {
  getListofGenericMasterQuery,
  ALL_EMPLOYEE_LIST,
} from "../../services/graphql/queries/user";
import { getListofProjectsByCompanyId } from "../../services/graphql/queries/document-upload";
import {
  RISK_REGISTER,
  DOWNLOAD_RISK_REGISTER,
} from "../../services/graphql/queries/riskRegister";
import ApproveImage from "../../static/images/svg/approve.svg";
import ViewImg from "../../static/images/svg/view.svg";
import { compareValues } from "../Common/customSort";
import Expand from "../../static/images/svg/plus.svg";
require("../../static/css/bootstrap.min.css");
const FileSaver = require("file-saver");
const mime = require("mime-types");
const customStyles = {};
const statusOptions = [
  { value: 2, label: "Open" },
  { value: 1, label: "Closed" },
];
const customOptions = [
  { value: 1, label: "Select All" },
  { value: 2, label: "Deviated" },
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
      riskId: null,
      pageNumber: 1,
      options: [],
      noOfRows: PAGINATION_OFFSET_VALUE,
    };
  }
  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber });
  }
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
            value: element.Id,
            label: element.description,
          });
        });
        if (id == 3) {
          this.initialState = {
            companyOptions: OptionArr.sort(compareValues("label")),
          };
        } else if (id == 4) {
          this.initialState = {
            projectOptions: OptionArr.sort(compareValues("label")),
          };
        } else if (id == 18)
          this.initialState = {
            riskOptions: OptionArr.sort(compareValues("label")),
          };
        else if (id == 2)
          this.initialState = {
            departmentOptions: OptionArr.sort(compareValues("label")),
          };
        this.setState({ ...this.initialState, error: "" });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  }
  getListOfProjects = (id) => {
    this.props.client
      .query({
        query: getListofProjectsByCompanyId,
        variables: {
          companyId: "",
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var projectList = result.data.getListOfProjectsByCompanyId;
        let projArr = [];
        projectList.forEach((element) => {
          let obj = {
            value: element.projectDetail.Id,
            label: element.projectDetail.description,
          };
          projArr.push(obj);
        });
        this.initialState = {
          projectOption: projArr.sort(compareValues("label")),
        };
        this.setState({ ...this.initialState, error: "" });
      })
      .catch((error) => {
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
          status: 1,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var users = result.data.getListOfAyanaEmployees;

        let userArr = [];
        users.forEach((element) => {
          let obj = {
            value: element.Id,
            label: element.name,
          };
          userArr.push(obj);
        });
        this.initialState = {
          userOptions: userArr.sort(compareValues("label")),
        };
        this.setState({
          ...this.initialState,

          error: "",
          deSelectEmployees: false,
          options: users,
        });
      })
      .catch((error) => {
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
      riskId,
      noOfRows,
      pageNumber,
    } = this.state;

    let risk = [];
    riskSelectedOption &&
      riskSelectedOption.forEach((element) => {
        risk.push(element.value);
      });

    let company = [];
    companySelectedOption &&
      companySelectedOption.forEach((element) => {
        company.push(element.value);
      });
    let project = [];
    projectSelectedOption &&
      projectSelectedOption.forEach((element) => {
        project.push(element.value);
      });

    let user = [];
    userSelectedOptions &&
      userSelectedOptions.forEach((element) => {
        user.push(element.value);
      });

    let department = [];
    departmentSelectedOption &&
      departmentSelectedOption.forEach((element) => {
        department.push(element.value);
      });
    let status = null;

    this.props.client
      .query({
        query: RISK_REGISTER,
        variables: {
          riskId: riskId,
          companyId: company.length ? company : null,
          projectId: project.length ? project : null,
          riskCategory: risk.length ? risk : null,
          status: statusSelectedOptions ? statusSelectedOptions.value : null,
          department: department.length ? department : null,
          deviated: customSelectedOptions
            ? customSelectedOptions.value == 1
              ? false
              : true
            : false,
          responsible: user.length ? user : null,
          noOfRows: noOfRows,
          pageNumber: pageNumber,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var riskList = result.data.getListOfRisk;
        console.log("risk list", riskList);
        this.setState({
          loading: false,
          error: "",
          riskRegisterData: riskList,
        });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  };

  downloadReport = () => {
    // this.setState({ loading: true });
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
      riskId,
      noOfRows,
      pageNumber,
    } = this.state;

    let risk = [];
    riskSelectedOption &&
      riskSelectedOption.forEach((element) => {
        risk.push(element.value);
      });

    let company = [];
    companySelectedOption &&
      companySelectedOption.forEach((element) => {
        company.push(element.value);
      });
    let project = [];
    projectSelectedOption &&
      projectSelectedOption.forEach((element) => {
        project.push(element.value);
      });

    let user = [];
    userSelectedOptions &&
      userSelectedOptions.forEach((element) => {
        user.push(element.value);
      });

    let department = [];
    departmentSelectedOption &&
      departmentSelectedOption.forEach((element) => {
        department.push(element.value);
      });
    let status = null;

    this.props.client
      .query({
        query: DOWNLOAD_RISK_REGISTER,
        variables: {
          riskId: riskId,
          companyId: company.length ? company : null,
          projectId: project.length ? project : null,
          riskCategory: risk.length ? risk : null,
          status: statusSelectedOptions ? statusSelectedOptions.value : null,
          department: department.length ? department : null,
          deviated: customSelectedOptions
            ? customSelectedOptions.value == 1
              ? false
              : true
            : false,
          responsible: user.length ? user : null,
          noOfRows: noOfRows,
          pageNumber: pageNumber,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        // this.setState({
        //   loading: false,
        //   error: "",
        //   riskRegisterData: riskList,
        // });
        let document = JSON.parse(result.data.downloadRiskRegisterReport);
        var byteCharacters = atob(document.fileData);

        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        const contentType = mime.lookup(document.fileName.split(".")[1]);

        var blob = new Blob([byteArray], {
          type: contentType,
        });

        FileSaver.saveAs(blob, document.fileName);

        this.setState({
          errors: [],
          loading: false,
        });
      })
      .catch((error) => {
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
        riskId: null,
      },
      () => {
        this.getListOfRisk();
      }
    );
  };
  accordion(data, riskId) {
    return (
      <tr className="background-white">
        <td
          colSpan={9}
          style={{
            fontSize: "13px",
            textAlign: "center",
            whiteSpace: "normal",
            backgroundColor: "white",
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
                <th scope="col" width={150}>
                  FORECAST DATE
                </th>
                {this.props && !this.props.isReports ? (
                  <th scope="col">ACTION</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="mitigation-table">
              {data && data.length
                ? data.map((ele, index) => {
                    return (
                      <tr>
                        <td>{ele.id}</td>
                        <td>{ele.name}</td>
                        <td>
                          {ele.departmentId ? ele.departmentId.description : ""}
                        </td>
                        <td>
                          {ele.responsible ? ele.responsible.loginId : ""}
                        </td>
                        <td>{ele.status ? ele.status.name : ""}</td>
                        <td>{format(ele.completionDate, dateFormat)}</td>
                        <td>{format(ele.forecastDate, dateFormat)}</td>
                        {this.props && !this.props.isReports ? (
                          <td>
                            {ele.canEdit &&
                            ele.canEdit.canApprove &&
                            ele.status &&
                            (ele.status.statusId == 1 ||
                              ele.status.statusId == 3) ? (
                              <a
                                href="#"
                                href="#"
                                className="link-primary"
                                title="Approve"
                                onClick={() => {
                                  localStorage.setItem("riskId", riskId);
                                  localStorage.setItem(
                                    "mitigationPlanId",
                                    ele.id
                                  );
                                  this.props.history.push(
                                    "/approve-mitigation"
                                  );
                                }}
                              >
                                <img src={ApproveImage} />
                              </a>
                            ) : null}

                            {ele.status && ele.status.statusId == 2 ? (
                              <a
                                href="#"
                                href="#"
                                className="link-primary"
                                title="view"
                                onClick={() => {
                                  localStorage.setItem("riskId", riskId);
                                  this.props.history.push("/risk-detail");
                                }}
                              >
                                <img src={ViewImg} />
                              </a>
                            ) : null}
                          </td>
                        ) : null}
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
  onChangePage(pageNumber) {
    // update state with new page of items
    this.setState(
      {
        pageNumber: pageNumber,
      },
      () => {
        // if (this.state.isFilterApply) {
        //   this.getListOfDocuments(
        //     this.state.noOfRows,
        //     pageNumber,
        //     this.state.filterData
        //   );
        // } else {
        //   this.getListOfDocuments(this.state.noOfRows, pageNumber);
        // }
        this.getListOfRisk();
      }
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
      riskId,
    } = this.state;
    // console.log("company", companySelectedOption);
    // if (loading) return <>Fetching!!!</>;
    return (
      <>
        <div className="row align-items-center no-gutters">
          <div className="col-md-8">
            <h1 className="heading m-b-0">Risk Register</h1>
          </div>
          <div className="col-md-4 text-right">
            {this.props && !this.props.isReports ? (
              <a href="/add-risk" className="btn btn-danger">
                Add
              </a>
            ) : null}
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
                      onChange={(e) => {
                        this.setState({ companySelectedOption: e }, (e) => {
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
                      onChange={(e) => {
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
                      onChange={(e) => {
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
                        borderColor: "hsl(0,0%,80%)",
                      }}
                      placeholder="Enter Risk Id"
                      onChange={(e) => {
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
                      onChange={(e) => {
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
                      onChange={(e) => {
                        this.setState(
                          { departmentSelectedOption: e }

                          // () => {
                          //   let users = [];
                          //   users.concat(userOptions);

                          //   let departments = [];
                          //   console.log("options", e);
                          //   e &&
                          //     e.forEach(data => {
                          //       departments.push(data.value);
                          //     });
                          //   console.log(departments);
                          //   departments.forEach(data => {
                          //     this.state.options.forEach(element => {
                          //       if (element.department.includes(data)) {
                          //         let obj = {
                          //           Id: element.Id,
                          //           label: element.name
                          //         };

                          //         users.push(obj);
                          //       }
                          //     });
                          //   });

                          //   users = users.sort(compareValues("label"));

                          //   this.setState({ userOptions: users });
                          // }
                        );
                        console.log("test", e);
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
                      onChange={(e) => {
                        this.setState({ userSelectedOptions: e }, () => {
                          console.log("test", userOptions);
                        });
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
                      onChange={(e) => {
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
                <div className="col-md-12">
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
                  {this.props && this.props.isReports ? (
                    <ButtonComponent
                      className="btn-light  ml-3"
                      type="button"
                      title="Download"
                      onClick={() => {
                        this.downloadReport();
                      }}
                    ></ButtonComponent>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table
            className="table table-style-1 risk-register-table"
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
                {this.props && !this.props.isReports ? (
                  <th scope="col">ACTION</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {!loading && riskRegisterData && riskRegisterData.length ? (
                riskRegisterData.map((data, index) => {
                  return (
                    <>
                      <tr className="risk-register-table-colour">
                        <td>
                          {data.mitigationplanSet.length > 0 ? (
                            <figure style={{ cursor: "pointer" }}>
                              <img
                                src={Expand}
                                onClick={() => {
                                  this.setState((prevState) => {
                                    let display = [];
                                    display[index] = !prevState.display[index];
                                    return {
                                      display: [...display],
                                    };
                                  });
                                }}
                                alt=""
                              />
                            </figure>
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
                        <td>
                          {data.severity == 1
                            ? "Low"
                            : data.severity == 2
                            ? "Medium"
                            : data.severity == 3
                            ? "High"
                            : ""}
                        </td>
                        <td>{data.status == 1 ? "Closed" : "Open"}</td>
                        {this.props && !this.props.isReports ? (
                          <td>
                            <a
                              href="#"
                              className="link-primary"
                              title="view"
                              onClick={() => {
                                localStorage.setItem("riskId", data.id);
                                this.props.history.push("/risk-detail");
                              }}
                            >
                              <img src={ViewImg} />
                            </a>
                          </td>
                        ) : null}
                      </tr>

                      {this.state.display[index] &&
                      data.mitigationplanSet.length > 0
                        ? this.accordion(data.mitigationplanSet, data.id)
                        : null}
                      {/* {this.accordion(data.mitigationPlanSet)} */}
                    </>
                  );
                })
              ) : !loading && !riskRegisterData.length ? (
                <div>No Data</div>
              ) : (
                <div>Fetching !!!</div>
              )}
            </tbody>
          </table>
          {/* {!pageOfItems.length && error ? <div>{error}</div> : null}
            {!pageOfItems.length && loading ? <div>Fetching...</div> : null}
            {!pageOfItems.length && !error && !loading ? (
            <div style={{ textAlign: "center" }}>No Data</div>
            ) : null} */}

          {loading ? null : (
            <div className="row" style={{ margin: "0px" }}>
              <div className="col-md-2">
                {/* <select
                  value={this.state.noOfRows}
                  style={{ width: "70px", marginTop: "8px" }}
                  className="form-control ml-2"
                  onChange={(e) =>
                    this.setState(
                      { noOfRows: parseInt(e.target.value) },
                      () => {
                        this.getListOfRisk();
                      }
                    )
                  }
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                </select> */}
              </div>
              <div className="col-md-8">
                <Pagination
                  loading={loading}
                  items={riskRegisterData}
                  pageSize={this.state.noOfRows}
                  initialPage={this.state.pageNumber}
                  onChangePage={this.onChangePage.bind(this)}
                />
              </div>
              <div
                className="col-md-2 text-right"
                style={{ display: "inline-flex" }}
              >
                <label style={{ marginTop: "12px", fontSize: "15px" }}>
                  Page Size:{" "}
                </label>
                <select
                  value={this.state.noOfRows}
                  style={{ width: "70px", marginTop: "8px" }}
                  className="form-control ml-2"
                  onChange={(e) =>
                    this.setState(
                      { noOfRows: parseInt(e.target.value) },
                      () => {
                        this.getListOfRisk();
                      }
                    )
                  }
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                </select>
              </div>
            </div>
          )}
        </div>
        {/* Table Section End */}
        {/* Pagination Start */}
      </>
    );
  }
}

export default withRouter(withApollo(RiskRegister));
