import React from "react";
// import matrix from "../../static/images/matrix.PNG"
import SimpleReactValidator from "simple-react-validator";

import ButtonComponent from "../Common/form-component/ButtonComponent";

import SelectComponent from "../Common/form-component/SelectComponent";

import { getListofGenericMasterQuery } from "../../services/graphql/queries/user";
import { getListofProjectsByCompanyId } from "../../services/graphql/queries/document-upload";
import { RISK_PROFILE } from "../../services/graphql/queries/dashboard";
import { withApollo } from "react-apollo";
import PieCharts from "../Dashboard/pieChart";
import { errorMsg, successMsg } from "../Common/alert";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import NotAccessible from "../Common/NotAccessible";
import { DO_NOT_ACCESS_MESSAGE } from "../../constants/app-constants";
import { withRouter, Redirect } from "react-router-dom";
class RiskProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      riskDetail: {
        company: null,
        project: null,
      },

      companyOptions: [],

      projectOptions: [],
      distribution: [],
      isEmpty: true,
      loading: true,
      accessSpecifier: {},
      total: 0,
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: (message) => <div style={{ color: "red" }}>{message}</div>,
    });
  }
  handleInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    value = parseInt(value);
    this.setState((prevState) => {
      return {
        riskDetail: {
          ...prevState.riskDetail,
          [name]: value,
        },
      };
    });
  };
  handleCompany = (e) => {
    debugger;
    let value = e.target.value;
    let name = e.target.name;
    this.setState((prevState) => {
      return {
        riskDetail: {
          ...prevState.riskDetail,
          [name]: value != "" ? parseInt(value) : value,
        },
      };
    });
    this.props.client
      .query({
        query: getListofProjectsByCompanyId,
        variables: {
          companyId: parseInt(value),
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var projectList = result.data.getListOfProjectsByCompanyId;
        let projArr = [];
        projectList.forEach((element) => {
          let obj = {
            Id: element.projectDetail.Id,
            label: element.projectDetail.description,
          };
          projArr.push(obj);
        });
        this.initialState = {
          projectOptions: projArr,
          project: "",
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
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
            riskOptions: OptionArr,
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

  submitRisk = () => {
    this.setState({ loading: true });
    this.props.client
      .mutate({
        mutation: RISK_PROFILE,
        variables: {
          company: this.state.riskDetail.company,
          project: this.state.riskDetail.project,
        },
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        console.log("result", result.data.getRiskDetailsByCompanyAndProject);

        this.setState(
          {
            loading: false,
            distribution: JSON.parse(
              result.data.getRiskDetailsByCompanyAndProject.distribution
            ),
            isEmpty: result.data.getRiskDetailsByCompanyAndProject.isEmpty,
            total: result.data.getRiskDetailsByCompanyAndProject.total,
          },
          () => {
            if (!result.data.getRiskDetailsByCompanyAndProject.isEmpty)
              PieCharts(
                JSON.parse(
                  result.data.getRiskDetailsByCompanyAndProject.categories
                ),
                "right",
                "riskCategory"
              );
            else successMsg("No risks for selected Company and Project");
          }
        );
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  clear() {
    this.setState({
      riskDetail: {
        company: null,
        project: null,
      },
      // loading: true,
      isEmpty: true,
      projectOptions: [],
      companyOptions: [],
    });
    this.validator.hideMessages();
    this.getListOfOptions(3);
  }
  accessPermission = () => {
    this.props.client
      .query({
        query: getAccessPermisionQuery,
        variables: {
          moduleId: 14,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        let response = result.data.getFunctionByModuleId;
        response = JSON.parse(response);
        this.setState({
          accessSpecifier: response[242],
        });
        this.getListOfOptions(3);
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
  };
  redirect = () => {
    console.log(this.state.companyOptions, this.state.projectOptions);
    let companyName = "";
    let projectName = "";
    this.state.companyOptions.forEach((element) => {
      if (parseInt(this.state.riskDetail.company) == element.Id) {
        companyName = element.label;
      }
    });
    this.state.projectOptions.forEach((element) => {
      if (parseInt(this.state.riskDetail.project) == element.Id) {
        projectName = element.label;
      }
    });
    console.log("names", companyName, projectName);
    this.props.history.push(
      "/risk-register?company=" +
        this.state.riskDetail.company +
        "&companyName=" +
        companyName +
        "&project=" +
        this.state.riskDetail.project +
        "&projectName=" +
        projectName
    );
  };
  componentDidMount() {
    this.accessPermission();
  }

  render() {
    const {
      riskDetail,
      distribution,
      companyOptions,
      projectOptions,
      isEmpty,
      accessSpecifier,
      loading,
      total,
    } = this.state;
    console.log("test", distribution);
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <>
        {accessSpecifier && accessSpecifier.viewP ? (
          <>
            <div className="row align-items-center no-gutters">
              <div className="col-md-8">
                <h1 className="heading m-b-0">Risk Profile</h1>
              </div>
              {/* style="width: 100%;    box-shadow: 0 0 2px rgba(0,0,0, .65);
  padding: 15px;
  border-radius: 3px;" */}
              <div className="col-md-12 mt-3">
                <div className="box-card">
                  <div className="row">
                    <div className="col-md-4">
                      <SelectComponent
                        required
                        label="Company"
                        title={"company"}
                        name="company"
                        options={companyOptions}
                        optionKey={"label"}
                        valueKey={"Id"}
                        value={riskDetail.company}
                        placeholder={"Select Company"}
                        handleChange={(e) => {
                          this.handleCompany(e);
                        }}
                        validator={this.validator}
                        validation="required"
                      />
                    </div>
                    <div className="col-md-4">
                      <SelectComponent
                        required
                        label="Project"
                        title={"project"}
                        name="project"
                        options={projectOptions}
                        optionKey={"label"}
                        valueKey={"Id"}
                        value={riskDetail.project}
                        placeholder={"Select Project"}
                        handleChange={this.handleInput}
                        validator={this.validator}
                        validation="required"
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-12 col-lg-8">
                      <ButtonComponent
                        className="btn-danger"
                        type="button"
                        title="Apply"
                        onClick={() => {
                          if (this.validator.allValid()) {
                            // this.validator.hideMessages();
                            this.submitRisk();
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

                {!isEmpty ? (
                  <div className="box-card">
                    <div className="row">
                      <h1 className="heading m-b-0">Risk Distribution</h1>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        {/* <div className="col-md-2 y-axis">
                      <h4>-Probability-></h4>
                    </div> */}

                        <div className="risk-profile">
                          {/* <h4 className="y-axis">-Probability-></h4> */}
                          <table
                            className=" table "
                            style={{
                              borderCollapse: "separate",
                              borderSpacing: "10px 9px",
                            }}
                          >
                            {distribution && distribution.length
                              ? distribution.map((data, index) => {
                                  return (
                                    <tr>
                                      <td
                                        style={{
                                          backgroundColor: data[0].colour,
                                          width: "100px",
                                        }}
                                      >
                                        {data[0].val}
                                      </td>
                                      <td
                                        className="wobble-horizontal"
                                        style={{
                                          backgroundColor: data[1].colour,
                                          width: "100px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          this.redirect();
                                        }}
                                      >
                                        {data[1].val}
                                      </td>
                                      <td
                                        className="wobble-horizontal"
                                        style={{
                                          backgroundColor: data[2].colour,
                                          width: "100px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          this.redirect();
                                        }}
                                      >
                                        {data[2].val}
                                      </td>
                                      <td
                                        className="wobble-horizontal"
                                        style={{
                                          backgroundColor: data[3].colour,
                                          width: "100px",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          this.redirect();
                                        }}
                                      >
                                        {data[3].val}
                                      </td>
                                    </tr>
                                  );
                                })
                              : null}
                            <tr>
                              <td></td>
                              <td
                                style={{
                                  backgroundColor: "white",
                                  width: "100px",
                                }}
                              >
                                Low
                              </td>
                              <td
                                style={{
                                  backgroundColor: "white",
                                  width: "100px",
                                }}
                              >
                                Medium
                              </td>
                              <td
                                style={{
                                  backgroundColor: "white",
                                  width: "100px",
                                }}
                              >
                                High
                              </td>{" "}
                            </tr>
                          </table>
                          {distribution && distribution.length ? (
                            <h6 style={{ paddingLeft: "215px" }}>-IMPACT-></h6>
                          ) : null}

                          <h6>Current number of issues : {total}</h6>
                        </div>
                      </div>
                      <div
                        className="col-md-6 col-lg-6"
                        style={{ padding: "25px" }}
                      >
                        {!this.state.loading ? (
                          <canvas
                            style={{ width: "100%", height: "100%" }}
                            id="riskCategory"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : !loading ? (
          <NotAccessible />
        ) : (
          ""
        )}
      </>
    );
  }
}

export default withRouter(withApollo(RiskProfile));
