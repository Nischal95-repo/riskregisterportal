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
                    {/* <div class="col-md-8">
        <h1 class="heading m-b-0">Risk Distribution</h1>
      </div> */}
                    <div className="row">
                      <h1 className="heading m-b-0">Risk Distribution</h1>
                    </div>
                    <div className="row">
                      <div className="col-md-12 col-lg-6">
                        {/* <img
                    src={matrix}
                    style={{ height: "240px", margin: "35px 0px 0px 75px" }}
                  /> */}

                        {/* <div className="col-md-2 y-axis">
                      <h4>-Probability-></h4>
                    </div> */}

                        <div className="risk-profile">
                          {/* <h4 className="y-axis">-Probability-></h4> */}
                          <table className=" table ">
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
                                        style={{
                                          backgroundColor: data[1].colour,
                                          width: "100px",
                                        }}
                                      >
                                        {data[1].val}
                                      </td>
                                      <td
                                        style={{
                                          backgroundColor: data[2].colour,
                                          width: "100px",
                                        }}
                                      >
                                        {data[2].val}
                                      </td>
                                      <td
                                        style={{
                                          backgroundColor: data[3].colour,
                                          width: "100px",
                                        }}
                                      >
                                        {data[3].val}
                                      </td>
                                    </tr>
                                  );
                                })
                              : null}
                          </table>
                          {distribution && distribution.length ? (
                            <h4 style={{ paddingLeft: "215px" }}>-IMPACT-></h4>
                          ) : null}
                        </div>
                      </div>
                      <div
                        className="col-md-12 col-lg-6"
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

export default withApollo(RiskProfile);
