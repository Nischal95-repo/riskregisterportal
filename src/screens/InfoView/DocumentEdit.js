import React from "react";

import SimpleReactValidator from "simple-react-validator";
import { format } from "date-fns";

import { withApollo } from "react-apollo";

import { getListofGenericMasterQuery } from "../../services/graphql/queries/user";
import { updateInfo, getListofProjectsByCompanyId } from "../../services/graphql/queries/document-upload";

import ReactModal from "../Common/ReactModal";
import InputComponent from "../Common/form-component/InputComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import TextAreComponent from "../Common/form-component/TextAreComponent";
import DisplayErrors from "../Common/DisplayErrors";
import { getInfoUploadStatus } from "../Common/ListOfStatus";

import { errorMessage } from "../../miscellaneous/error-messages";

import { SET_TIMEOUT_VALUE, dateInputFormat, dateFormatMonth } from "../../constants/app-constants";

class DocumentEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        errors:[],
        documentDetail:{
            title:'',
            categoryId:'',
            companyId:'',
            typeId: 1,
            projectId:'',
            description:'',
            status:'',
        },
        categoryOption:[],
        companyOption:[],
        projectOption:[],
        reactModalVisible: false,
        requireCancel: false,
        modalMessage: ""
    }
    this.validator = new SimpleReactValidator({
        autoForceUpdate: this,
        element: message => <div style={{ color: "red" }}>{message}</div>
    });
    this.handleInput = this.handleInput.bind(this);
    this.handleCompany = this.handleCompany.bind(this);
    this.updateDocument = this.updateDocument.bind(this);
    this.submitModal = this.submitModal.bind(this);

  }

  submitModal() {
    this.setState({ reactModalVisible: false, modalMessage: "" });
    this.props.onUpdateDocument();
    this.props.toggleEditMode(false);
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
  }

  handleCompany(e){
    let value = e.target.value;
    let name = e.target.name;
    this.state.documentDetail.projectId = '';
    this.setState(prevState => {
      return {
        documentDetail: {
          ...prevState.documentDetail,
          [name]: value
        }
      };
    });
    this.getListOfProjectsByCompanyId(value)
  }

  updateDocument(e){
    e.preventDefault();
    if(this.validator.allValid()){
    this.state.documentDetail.id = this.props.document.Id;
    debugger
    this.props.client
      .mutate({
        mutation: updateInfo,
        variables: this.state.documentDetail,
        fetchPolicy: "no-cache"
      })
      .then(result => {
        this.setState({ reactModalVisible: true, modalMessage: "Updated Successfully" });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, errors: [errorMessage(error)] });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
    } else{
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  }

  getListOfCategory(id){
    this.props.client
      .query({
        query: getListofGenericMasterQuery,
        variables: {
          masterFor: id
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var options = result.data.getListofGenericMaster;

        this.initialState = {
          categoryOption: options
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  getListOfCompany(id){
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

  getListOfProjectsByCompanyId(id){
    this.props.client
      .query({
        query: getListofProjectsByCompanyId,
        variables: {
          companyId: parseInt(id)
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var projectList = result.data.getListOfProjectsByCompanyId;
        let projArr = [];
        projectList.forEach(element => {
          let obj={
            Id: element.projectDetail.Id,
            description: element.projectDetail.description
          }
          projArr.push(obj)
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

  updateData() {
    const {
      title,
      categoryDetail,
      companyDetail,
      typeId,
      projectDetail,
      description,
      status
    } = this.props.document;
    let documentDetail = {
      title: title,
      categoryId:categoryDetail.Id,
      companyId: companyDetail.Id,
      typeId: typeId,
      projectId: projectDetail.Id,
      description: description,
      status: status
    };

    this.setState({ documentDetail: documentDetail });
  }

  componentDidMount(){
    this.getListOfCategory(15);
    this.getListOfCompany(3);
    this.getListOfProjectsByCompanyId(this.props.document.companyDetail.Id);
    this.updateData();
  }

  render() {
    const { errors, documentDetail, categoryOption, companyOption, projectOption, reactModalVisible, requireCancel, modalMessage } = this.state;
    const { Id, createdByDetail, createdOn, modifiedByDetail, lastModifiedOn,status } = this.props.document;
    const statusOptions = getInfoUploadStatus(status);
    return (
      <>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
        />
        <h1 className="heading m-b-25">Info Details - {Id}</h1>
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
      <form onSubmit={this.updateDocument}>
        <div className="row">
          <div className="col-md-12">
            
            <div className="box-card" style={{height: '500px'}}>
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <InputComponent
                    required
                    type="text"
                    title="Title"
                    name="title"
                    label="Title"
                    value={documentDetail.title}
                    placeholder="Enter Title"
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
                <div className="col-md-3 col-lg-3">
                  <div className="form-group">
                    <label>Created By <span style={{color: 'red'}}>*</span></label>
                    {/* <input type="text" readOnly className="form-control-plaintext" value={createdByDetail && createdByDetail.loginId ? createdByDetail.loginId : ""} />
                   */}
                   <div className="form-control-plaintext word-break">{createdByDetail && createdByDetail.loginId ? createdByDetail.loginId : ""}</div>
                  </div>
                </div>
                <div className="col-md-3 col-lg-3">
                  <div className="form-group">
                    <label>Created On<span style={{color: 'red'}}>*</span></label>
                    {/* <input type="text" readOnly className="form-control-plaintext" value={createdOn?format(createdOn, dateFormatMonth):''} /> */}
                    <div className="form-control-plaintext word-break">{createdOn?format(createdOn, dateFormatMonth):''}</div>
                  </div>
                </div>
                <div className="col-md-3 col-lg-3">
                  <div className="form-group">
                    <label>Last Modified By<span style={{color: 'red'}}>*</span></label>
                    {/* <input type="text" readOnly className="form-control-plaintext" value={modifiedByDetail && modifiedByDetail.loginId ? modifiedByDetail.loginId : ""} /> */}
                    <div className="form-control-plaintext word-break">{modifiedByDetail && modifiedByDetail.loginId ? modifiedByDetail.loginId : ""}</div>
                  </div>
                </div>
                <div className="col-md-3 col-lg-3">
                  <div className="form-group">
                    <label>Last Modified On <span style={{color: 'red'}}>*</span></label>
                    {/* <input type="text" readOnly className="form-control-plaintext"  value={lastModifiedOn?format(lastModifiedOn, dateFormatMonth):''} /> */}
                    <div className="form-control-plaintext word-break">{lastModifiedOn?format(lastModifiedOn, dateFormatMonth):''}</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <div className="form-group">
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
                <div className="col-md-6 col-lg-6">
                    <SelectComponent
                      required
                      label={"Status"}
                      title={"status"}
                      name={"status"}
                      options={statusOptions}
                      optionKey={"name"}
                      valueKey={"id"}
                      value={documentDetail.status}
                      placeholder={"Select Status"}
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                </div>
              </div>
              <div className="row">
                <div className="col-md-5">
                  <button type="submit" className="btn btn-danger">Submit</button>
                  <button type="button" className="btn btn-light m-l-45" onClick={() => this.updateData()}>Reset</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </form>
        {/* Form Section End */}
      </>
    );
  }
}

export default withApollo(DocumentEdit);  