import React from "react";

import SimpleReactValidator from "simple-react-validator";
import { format } from "date-fns";

import { withApollo } from "react-apollo";

import { getListofGenericMasterQuery } from "../../services/graphql/queries/user";
import { updateDocument, getListofProjectsByCompanyId } from "../../services/graphql/queries/document-upload";

import ReactModal from "../Common/ReactModal";
import InputComponent from "../Common/form-component/InputComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import TextAreComponent from "../Common/form-component/TextAreComponent";
import DisplayErrors from "../Common/DisplayErrors";
import { getDocumentUploadStatus } from "../Common/ListOfStatus";

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
            typeId: 2,
            projectId:'',
            description:'',
            reviewStartDate:'',
            reviewEndDate:'',
            status:'',
        },
        minReviewStartDate:'',
        minReviewEndDate:'',
        categoryOption:[],
        companyOption:[],
        projectOption:[],
        typeOption:[
            {
                Id:1,
                name:"Info"
            },
            {
                Id:2,
                name:"Review"
            }
        ],
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
    if(name == "reviewStartDate"){
      this.state.documentDetail.reviewEndDate = ''
      this.setState({ minReviewEndDate: format(value, dateInputFormat) })
    }
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
    this.state.documentDetail.companyId = parseInt(this.state.documentDetail.companyId);
      this.state.documentDetail.categoryId = parseInt(this.state.documentDetail.categoryId);
      this.state.documentDetail.projectId = parseInt(this.state.documentDetail.projectId);
    this.props.client
      .mutate({
        mutation: updateDocument,
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
      reviewStartDate,
      reviewEndDate,
      status
    } = this.props.document;
    let documentDetail = {
      title: title,
      categoryId:categoryDetail.Id,
      companyId: companyDetail.Id,
      typeId: typeId,
      projectId: projectDetail.Id,
      description: description,
      reviewStartDate: reviewStartDate,
      reviewEndDate: reviewEndDate,
      status: status
    };

    this.setState({ documentDetail: documentDetail });
  }

  componentDidMount(){
    this.setState({
      // minReviewStartDate: format(this.props.document.reviewStartDate, dateInputFormat), 
      minReviewStartDate: format(new Date(), dateInputFormat),
      minReviewEndDate: format(new Date(), dateInputFormat)
    });
    this.getListOfCategory(15);
    this.getListOfCompany(3);
    this.getListOfProjectsByCompanyId(this.props.document.companyDetail.Id);
    this.updateData();
  }

  render() {
    const { errors, documentDetail, minReviewStartDate, minReviewEndDate, categoryOption, companyOption, projectOption, typeOption, reactModalVisible, requireCancel, modalMessage } = this.state;
    const { Id, categoryDetail, createdByDetail, createdOn, modifiedByDetail, lastModifiedOn, comments, approvedOn, approvedByDetail, status, companyDetail, projectDetail, type, statusDetail } = this.props.document;
    const statusOptions = getDocumentUploadStatus(status);
    return (
      <>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
        />
        <h1 className="heading m-b-25">Task Details - {Id}</h1>
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
          <div className="col-md-8">
            
            <div className="box-card" style={{height: '520px'}}>
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <InputComponent
                    readOnly={status != 4 ? true : false}
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
                  {status == 4?
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
                    :
                    <InputComponent
                      readOnly={true}
                      required
                      type="text"
                      title="Category"
                      name="categoryId"
                      label="Category"
                      value={categoryDetail && categoryDetail.description ? categoryDetail.description : ""}
                      placeholder="Enter Category"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  }
              </div>
                
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  {status == 4?
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
                    :
                    <InputComponent
                      readOnly={true}
                      required
                      type="text"
                      title="Company"
                      name="company"
                      label="Company"
                      value={companyDetail && companyDetail.description ? companyDetail.description : ''}
                      placeholder="Enter Company"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  }
                </div>
                <div className="col-md-6 col-lg-6">
                  {status == 4?
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
                    :
                    <InputComponent
                      readOnly={true}
                      required
                      type="text"
                      title="Project"
                      name="project"
                      label="Project"
                      value={projectDetail && projectDetail.description ? projectDetail.description : ''}
                      placeholder="Enter Project"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  } 
                </div>
                
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Created By <span style={{color: 'red'}}>*</span></label>
                    {/* <input type="text" readOnly className="form-control-plaintext" value={createdByDetail && createdByDetail.loginId ? createdByDetail.loginId : ""} /> */}
                    <div className="form-control-plaintext word-break">{createdByDetail && createdByDetail.loginId ? createdByDetail.loginId : ""}</div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Created On<span style={{color: 'red'}}>*</span></label>
                    {/* <input type="text" readOnly className="form-control-plaintext" value={createdOn?format(createdOn, dateFormatMonth):''} /> */}
                    <div className="form-control-plaintext word-break">{createdOn?format(createdOn, dateFormatMonth):''}</div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Last Modified By<span style={{color: 'red'}}>*</span></label>
                    {/* <input type="text" readOnly className="form-control-plaintext" value={modifiedByDetail && modifiedByDetail.loginId ? modifiedByDetail.loginId : ""} /> */}
                    <div className="form-control-plaintext word-break">{modifiedByDetail && modifiedByDetail.loginId ? modifiedByDetail.loginId : ""}</div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
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
                        readOnly={status != 4 ? true : false }
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
                
                { status ==4 || status == 1?null : <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label>Comments</label>
                      {/* <textarea className="form-control-plaintext text-justify" readOnly value={comments} /> */}
                      <div className="form-control-plaintext word-break">{comments}</div>
                    </div>
                  </div>}
              </div>
              <div className="row">
                <div className="col-md-12">
                  <button type="submit" className="btn btn-danger">Submit</button>
                  <button type="button" className="btn btn-light m-l-45" onClick={() => this.updateData()}>Reset</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="box-card" style={{height: '520px'}}>
              <div className="row">
                <div className="col-md-12 col-lg-6">
                  {status != 2 ?
                    <InputComponent
                      required
                      type="date"
                      title="reviewStartDate"
                      name="reviewStartDate"
                      label="Start Date"
                      value={documentDetail.reviewStartDate}
                      placeholder="Enter Review Start Date"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                      min={minReviewStartDate}
                    />
                    :
                    <InputComponent
                      readOnly={true}
                      required
                      type="date"
                      title="reviewStartDate"
                      name="reviewStartDate"
                      label="Start Date"
                      value={documentDetail.reviewStartDate}
                      placeholder="Enter Review Start Date"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                      min={minReviewStartDate}
                    />
                  }
                </div>
                <div className="col-md-12 col-lg-6">
                  <InputComponent
                      required
                      type="date"
                      title="reviewEndDate"
                      name="reviewEndDate"
                      label="End Date"
                      value={documentDetail.reviewEndDate}
                      placeholder="Enter Review End Date"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                      min={minReviewEndDate}
                  />  
                </div>
              </div>
              {status != 4 && status != 1 ?<div className="row">
                  <div className="col-md-12 col-lg-6">
                    <div className="form-group">
                      <label>{status != 4 &&  status != 1 && status != 3? "Approved":""} {status == 3 ? "Rejected":""} By<span style={{color: 'red'}}>*</span></label>
                      {/* <input type="text" readOnly className="form-control-plaintext" value={approvedByDetail && approvedByDetail.loginId?approvedByDetail && approvedByDetail.loginId:null} /> */}
                      <div className="form-control-plaintext word-break">{approvedByDetail && approvedByDetail.loginId?approvedByDetail && approvedByDetail.loginId:null}</div>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-6">
                    <div className="form-group">
                      <label>{status != 4 &&  status != 1 && status != 3? "Approved":""} {status == 3 ? "Rejected":""} On<span style={{color: 'red'}}>*</span></label>
                      {/* <input type="text" readOnly className="form-control-plaintext" value={approvedOn?format(approvedOn, dateFormatMonth):''} /> */}
                      <div className="form-control-plaintext word-break">{approvedOn?format(approvedOn, dateFormatMonth):''}</div>
                    </div>
                  </div>
                </div>:null}
              <div className="row">
                <div className="col-md-12 col-lg-6">
                  {status == 2 || status == 6?
                    <SelectComponent
                      required
                      label={"Status"}
                      title={"status"}
                      name={"status"}
                      options={statusOptions}
                      optionKey={"name"}
                      valueKey={"id"}
                      value={documentDetail.status}
                      placeholder={"Select Statuus"}
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                    :
                    <InputComponent
                      readOnly={true}
                      required
                      type="text"
                      title="status"
                      name="status"
                      label="Status"
                      value={statusDetail[0].name}
                      placeholder="Enter Project"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  }
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