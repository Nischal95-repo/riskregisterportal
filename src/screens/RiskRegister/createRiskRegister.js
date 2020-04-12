import React from "react";
import InputComponent from "../Common/form-component/InputComponent";
import ButtonComponent from "../Common/form-component/ButtonComponent";
import TextAreaComponent from "../Common/form-component/TextAreComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import SimpleReactValidator from "simple-react-validator";
import { getListofGenericMasterQuery } from "../../services/graphql/queries/user";
import { getListofProjectsByCompanyId } from "../../services/graphql/queries/document-upload";
import { CREATE_RISK_REGISTER } from "../../services/graphql/queries/riskRegister";
import ReactModal from "../Common/ReactModal";
import { format } from "date-fns";

import { withApollo } from "react-apollo";

import {
  SET_TIMEOUT_VALUE,
  dateInputFormat
} from "../../constants/app-constants";
import { withRouter } from "react-router-dom";

const impAndProbOptions = [
  { Id: 1, label: "Low" },
  { Id: 2, label: "Medium" },
  { Id: 3, label: "High" }
];

class AddRiskRegister extends React.Component {
  constructor() {
    super();
    this.state = {
      riskDetail: {
        company: null,
        project: null,
        riskCategory: null,
        name: "",
        description: "",
        impact: "",
        probability: "",
        severity: ""
      },
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: "Created Successfully",

      companyOptions: [],

      projectOptions: [],

      riskOptions: []
    };

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: message => <div style={{ color: "red" }}>{message}</div>
    });
  }
  handleInput = e => {
    let value = e.target.value;
    let name = e.target.name;
    if (name != "name" && name != "description" && value !== "")
      value = parseInt(value);
    this.setState(prevState => {
      return {
        riskDetail: {
          ...prevState.riskDetail,
          [name]: value
        }
      };
    });
  };

  handleCompany = e => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => {
      return {
        riskDetail: {
          ...prevState.riskDetail,
          [name]: value != "" ? parseInt(value) : value
        }
      };
    });
    this.props.client
      .query({
        query: getListofProjectsByCompanyId,
        variables: {
          companyId: parseInt(value)
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var projectList = result.data.getListOfProjectsByCompanyId;
        let projArr = [];
        projectList.forEach(element => {
          let obj = {
            Id: element.projectDetail.Id,
            label: element.projectDetail.description
          };
          projArr.push(obj);
        });
        this.initialState = {
          projectOptions: projArr,
          project: ""
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
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

  submitRisk = () => {
    this.props.client
      .mutate({
        mutation: CREATE_RISK_REGISTER,
        variables: this.state.riskDetail,
        fetchPolicy: "no-cache"
      })
      .then(result => {
        localStorage.setItem("riskId", result.data.createRisk.risk.id);
        console.log("result", result);
        this.setState({ reactModalVisible: true });
      })
      .catch(error => {
        console.log("error", error);
      });
  };

  clear() {
    this.setState({
      riskDetail: {
        company: null,
        project: null,
        riskCategory: null,
        name: "",
        description: "",
        impact: "",
        probability: "",
        severity: ""
      },
      projectOptions: []
    });
    this.validator.hideMessages();
  }
  submitModal = () => {
    this.setState({ reactModalVisible: false, modalMessage: "" }, () => {
      this.props.history.push("/risk-detail");
    });
    // this.props.onUpdateUser();
  };
  componentDidMount() {
    this.getListOfOptions(18);
    this.getListOfOptions(3);
  }

  render() {
    const {
      riskDetail,
      riskOptions,
      companyOptions,
      projectOptions,
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
        <h1 className="heading m-b-25">Risk Creation</h1>
        <div className="row">
          <div className="col-md-12">
            {/* Form Section start */}
            <div className="box-card">
              <div className="row">
                <div className="col-md-4 col-lg-3">
                  <InputComponent
                    label="Risk"
                    required
                    title="Risk"
                    name="name"
                    value={riskDetail.name}
                    placeholder="Enter Name"
                    validator={this.validator}
                    handleChange={e => {
                      this.handleInput(e);
                    }}
                    validation="required"
                  ></InputComponent>
                </div>
                <div className="col-md-4 col-lg-3">
                  <SelectComponent
                    required
                    label="Risk Category"
                    title={"risk category"}
                    name="riskCategory"
                    options={riskOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={riskDetail.riskCategory}
                    placeholder={"Select Risk Category"}
                    handleChange={e => {
                      this.handleInput(e);
                    }}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
                <div className="col-md-3">
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
                    handleChange={e => {
                      this.handleCompany(e);
                    }}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
                <div className="col-md-3">
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
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <SelectComponent
                    required
                    label="Impact"
                    title={"impact"}
                    name="impact"
                    options={impAndProbOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={riskDetail.impact}
                    placeholder={"Select Impact"}
                    handleChange={this.handleInput}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <SelectComponent
                    required
                    label="Probability"
                    title={"probability"}
                    name="probability"
                    options={impAndProbOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={riskDetail.probability}
                    placeholder={"Select Probability"}
                    handleChange={this.handleInput}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Severity<span style={{ color: "red" }}>*</span>
                    </label>
                    <input type="text" className="form-control" readOnly />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-lg-6">
                  <TextAreaComponent
                    required
                    label="Impact/Description"
                    title="description"
                    name="description"
                    value={riskDetail.description}
                    placeholder="Enter description"
                    handleChange={this.handleInput}
                    validation="required"
                    validator={this.validator}
                  ></TextAreaComponent>
                </div>
                <div className="col-md-6 col-lg-6 ">
                  <div className="row" style={{ paddingLeft: "10px" }}>
                    <label />
                    <div
                      className="upload-btn-wrapper"
                      style={{ marginTop: "25px" }}
                    >
                      <button className="btn btn-light">
                        Upload Attachment
                      </button>
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
            {/* Form Section End */}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withApollo(AddRiskRegister));
