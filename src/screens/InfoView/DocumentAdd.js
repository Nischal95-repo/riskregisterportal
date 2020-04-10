import React from "react";
import { withRouter } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import { format } from "date-fns";

import { withApollo } from "react-apollo";
import { getListofGenericMasterQuery } from "../../services/graphql/queries/user";
import {
  createInfo,
  getListofProjectsByCompanyId
} from "../../services/graphql/queries/document-upload";

import ReactModal from "../Common/ReactModal";
import InputComponent from "../Common/form-component/InputComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import TextAreComponent from "../Common/form-component/TextAreComponent";
import DisplayErrors from "../Common/DisplayErrors";

import { errorMessage } from "../../miscellaneous/error-messages";

import {
  SET_TIMEOUT_VALUE,
  dateInputFormat
} from "../../constants/app-constants";

class DocumentAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: [],
      documentDetail: {
        title: "",
        companyId: "",
        categoryId: "",
        typeId: 1,
        projectId: "",
        description: "",
        reviewStartDate: "",
        reviewEndDate: ""
      },
      minReviewStartDate: "",
      minReviewEndDate: "",
      categoryOption: [],
      companyOption: [],
      projectOption: [],
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: ""
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: message => <div style={{ color: "red" }}>{message}</div>
    });
    this.handleInput = this.handleInput.bind(this);
    this.handleCompany = this.handleCompany.bind(this);
    this.addDocument = this.addDocument.bind(this);
    this.submitModal = this.submitModal.bind(this);
  }

  submitModal() {
    this.setState({ reactModalVisible: false, modalMessage: "" }, () => {
      // redirectTo("/upload-info-detail?id="+this.state.documentId);
      this.props.history.push(
        "/upload-info-detail?id=" + this.state.documentId
      );
    });
  }

  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => {
      return {
        documentDetail: {
          ...prevState.documentDetail,
          [name]: value
        }
      };
    });
    if (name == "reviewStartDate") {
      this.state.documentDetail.reviewEndDate = "";
      this.setState({ minReviewEndDate: format(value, dateInputFormat) });
    }
  }

  handleCompany(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => {
      return {
        documentDetail: {
          ...prevState.documentDetail,
          [name]: value
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
            description: element.projectDetail.description
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
  }

  addDocument(e) {
    e.preventDefault();
    if (this.validator.allValid()) {
      this.props.client
        .mutate({
          mutation: createInfo,
          variables: this.state.documentDetail,
          fetchPolicy: "no-cache"
        })
        .then(result => {
          this.setState({
            documentId: result.data.createDocumentInfo.document.Id,
            reactModalVisible: true,
            modalMessage: "Info Created Successfullly"
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

  onFormClear() {
    let documentDetail = {
      title: "",
      companyId: "",
      categoryId: "",
      projectId: "",
      description: "",
      reviewStartDate: "",
      reviewEndDate: ""
    };
    this.validator.hideMessages();
    this.setState({ documentDetail: documentDetail });
  }

  getListOfCompany(id) {
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
          companyOption: user
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  getListOfCategory(id) {
    this.props.client
      .query({
        query: getListofGenericMasterQuery,
        variables: {
          masterFor: id
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var option = result.data.getListofGenericMaster;

        this.initialState = {
          categoryOption: option
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  componentDidMount() {
    this.setState({
      minReviewStartDate: format(new Date(), dateInputFormat),
      minReviewEndDate: format(new Date(), dateInputFormat)
    });
    this.getListOfCompany(3);
    this.getListOfCategory(16);
  }

  render() {
    const {
      errors,
      documentDetail,
      minReviewStartDate,
      minReviewEndDate,
      companyOption,
      projectOption,
      categoryOption,
      reactModalVisible,
      requireCancel,
      modalMessage
    } = this.state;
    return (
      <>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
        />
        <h1 className="heading m-b-25">Info Creation</h1>
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
        {/* Form Section start */}
        <form onSubmit={this.addDocument}>
          <div className="row">
            <div className="col-md-12">
              <div className="box-card" style={{ height: "400px" }}>
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <InputComponent
                      required
                      type="text"
                      title="Title"
                      name="title"
                      label="Title"
                      value={documentDetail.title}
                      placeholder="Enter title"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <SelectComponent
                      required
                      label={"Category"}
                      title={"category"}
                      name={"categoryId"}
                      options={categoryOption}
                      optionKey={"description"}
                      valueKey={"Id"}
                      value={documentDetail.categoryId}
                      placeholder={"Select Category"}
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <SelectComponent
                      required
                      label={"Company"}
                      title={"company"}
                      name={"companyId"}
                      options={companyOption}
                      optionKey={"description"}
                      valueKey={"Id"}
                      value={documentDetail.companyId}
                      placeholder={"Select Company"}
                      handleChange={this.handleCompany}
                      validator={this.validator}
                      validation="required"
                    />
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <SelectComponent
                      required
                      label={"Project"}
                      title={"Project"}
                      name={"projectId"}
                      options={projectOption}
                      optionKey={"description"}
                      valueKey={"Id"}
                      value={documentDetail.projectId}
                      placeholder={"Select Project"}
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <TextAreComponent
                      required
                      title="Description"
                      name="description"
                      label="Description"
                      value={documentDetail.description}
                      placeholder="Enter Description"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div>
                  
                </div>
                <div className="row">
                  {/* <div className="col-md-6 col-lg-6">
                                    <TextAreComponent 
                                        required
                                        title="Description"
                                        name="description"
                                        label="Description"
                                        value={documentDetail.description}
                                        placeholder="Enter Description"
                                        handleChange={this.handleInput}
                                        validator={this.validator}
                                        validation="required"
                                    />
                                </div> */}
                </div>
              </div>
            </div>
            
          </div>
          <div className="row m-t-25 m-b-25">
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
        {/* Form Section End */}
      </>
    );
  }
}

export default withRouter(withApollo(DocumentAdd));
