import React from "react";

import Modal from "react-awesome-modal";

import { withApollo } from "react-apollo";

import { getUserListQuery } from "../../../services/graphql/queries/user";
import { addReviewers } from "../../../services/graphql/queries/document-upload";

import DisplayErrors from "../../Common/DisplayErrors";
import ReactModal from "../../Common/ReactModal";

import { SET_TIMEOUT_VALUE } from "../../../constants/app-constants";

import { errorMessage } from "../../../miscellaneous/error-messages";

import popupLogo from "../../../static/images/popup-logo.png";

class ReviewerAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errors: [],
      modalVisible: false,
      isSearched: false,
      employeeId: "",
      name: "",
      allusers: {},
      users: [],
      userIds: [],
      userNames: [],
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: ""
    };
    this.submitModal = this.submitModal.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onModalVisible() {
    this.setState({ modalVisible: !this.state.modalVisible, name: "", users:[] },()=>{
      if(this.state.modalVisible){
        if(this.state.userIds.length){
          for(let i=0; i<this.state.userIds.length; i++){
            this.state.users.push(this.state.allusers[this.state.userIds[i]]);
          }
          this.setState({users: this.state.users},
            ()=>{
              this.userListUpdate(this.state.users);
            }
          );
        }else{
          this.getUserList();
          this.getAllUserList();
        } 
      }
    });
    
  }

  submitModal() {
    this.setState({ reactModalVisible: false, users:[] });
    this.props.toggleMode();
  }

  onCancelClicked() {
    if (this.state.userNames.length) {
      this.setState({ isSearched: false });
    } else {
      this.setState({
        isSearched: false,
        users: [],
        userIds: [],
        userNames: [],
        name: "",
        employeeId: ""
      });
    }
    this.onModalVisible();
  }

  compare(a, b) {
    const bandA = a.name.toUpperCase();
    const bandB = b.name.toUpperCase();
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  getUserList() {
    this.setState({ loading: true, users: [], isSearched: true });
    // if (this.state.employeeId || this.state.name) {
      this.props.client
        .query({
          query: getUserListQuery,
          variables: {
            employeeId: this.state.employeeId ? this.state.employeeId : null,
            name: this.state.name ? this.state.name : "",
            status: 1
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          var users = result.data.getListOfOrgUsers;
          users = users.sort((a,b)=>this.compare(a,b));

          this.initialState = {
            users: users
          };
          this.setState({ ...this.initialState, loading: false, error: "" });
          this.userListUpdate(users);
        })
        .catch(error => {
          this.setState({ loading: false, error: error.message });
        });
    // }
  }

  userListUpdate(users){
    var inputElements = document.getElementsByClassName("userCheckbox");
    for (let i = 0; i<inputElements.length; i++) {
      for(let j=0; j<this.state.userIds.length; j++){
        if (this.state.userIds[j] == users[i].Id) {
          inputElements[i].checked = true
        }
      }
    }
  }

  onFormSubmit(e) {
    e.preventDefault();
    // var inputElements = document.getElementsByClassName("userCheckbox");
    // // var userIds = [],
    // //   userNames = [];
    // for (var i = 0; inputElements[i]; ++i) {
    //   if (inputElements[i].checked) {
    //     this.state.userIds.push(parseInt(inputElements[i].id.split("_")[0]));
    //     this.state.userNames.push(inputElements[i].id.split("_")[1]);
    //   }
    // }
    // this.setState({ userIds: this.state.userIds, userNames: this.state.userNames });
    this.onModalVisible();
  }

  onSelectReviewer(e, user){
    if(e.target.checked){
      this.state.userIds.push(parseInt(user.Id));
      this.state.userNames.push(user.name);
    }else{
      for(let i = 0; i < this.state.userIds.length; i++){
        if(this.state.userIds[i] == user.Id){
          this.state.userIds.splice(i,1);
          this.state.userNames.splice(i,1);
        }
      }
    }
  }

  onCreateReviewers() {
    this.props.client
      .mutate({
        mutation: addReviewers,
        variables: {
          documentId: this.props.document.Id,
          userId: this.state.userIds
        },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        this.setState({
          reactModalVisible: true,
          modalMessage: "Reviewer added successfully"
        });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, errors: [errorMessage(error)], userNames: [], userIds: [], users: [] });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  }

  getAllUserList() {
    // this.setState({ loading: true, isSearched: true });
      this.props.client
        .query({
          query: getUserListQuery,
          variables: {
            status: 1
          },
          fetchPolicy: "network-only"
        })
        .then(result => {
          var allusers = result.data.getListOfOrgUsers;
          allusers.forEach(element => {
            this.state.allusers[element.Id] = element;
          });
          this.initialState = {
            allusers: this.state.allusers
          };
          this.setState({ ...this.initialState, loading: false, error: "" });
        })
        .catch(error => {
          this.setState({ loading: false, error: error.message });
        });
    
  }

  componentDidMount(){
    this.getAllUserList();
  }

  render() {
    const {
      loading,
      errors,
      modalVisible,
      isSearched,
      employeeId,
      name,
      users,
      userNames,
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
        <div id="addDiv">
          <div className="row align-items-center">
            <div className="col-md-10">
              <h1 className="heading m-b-0">Add Reviewers</h1>
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
              <a
                href="#"
                onClick={this.props.toggleMode}
                className="link-click "
              >
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
            <div className="col-md-12 col-lg-12">
              <div className="row">
                <div className="col-md-12 col-lg-6">
                  <div className="form-group">
                    <label>
                      Name<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Select Reviewer"
                      readOnly
                      data-toggle="modal"
                      data-target="#selectGeoId"
                      value={userNames.join(", ")}
                      onClick={() => this.onModalVisible()}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-10">
                <div className="row">
                  <div className="col-md-12 ">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => this.onCreateReviewers()}
                      disabled={!userNames.length ? true : false}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-light m-l-50"
                      onClick={() => this.setState({ userNames: [], userIds: [], users: [] })}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal visible={modalVisible} effect="fadeInDown" width="900">
          <div style={{ padding: "40px 40px" }}>
            <div className="modal-content" style={{ border: "none" }}>
              <div
                className="modal-header"
                style={{ display: "-webkit-box", padding: 0 }}
              >
                <div className="col-10" style={{display: "-webkit-box"}}>
                  <figure style={{ marginRight: "20px" }}>
                    <img src={popupLogo} />
                  </figure>
                  <h1 className="heading m-l-28">Select Reviewer</h1>
                </div>
                <div className="col-2 text-right">
                  <a
                    href="#"
                    onClick={() => this.onCancelClicked()}
                    className="link-click "
                  >
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
                  </a>
                </div>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* <div className="col-5 ">
                    <div className="form-group">
                      <label>ID</label>
                      <div className="ui-widget">
                        <input
                          id="employeeId"
                          className="form-control autocomplete"
                          placeholder="Please Enter Employee Id"
                          value={employeeId}
                          onChange={e =>
                            this.setState({ employeeId: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div> */}
                  <div className="col-5">
                    <div className="form-group">
                      <label>NAME</label>
                      <div className="ui-widget">
                        <input
                          id="name"
                          className="form-control autocomplete"
                          placeholder="Please Enter Employee Name"
                          value={name}
                          onChange={e =>
                            this.setState({ name: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-2">
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn-danger popup-button-danger m-t-28"
                        onClick={() => this.getUserList()}
                      >
                        Go
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer m-t-15">
                  {/* <button
                    type="button"
                    className="btn btn-default popup-button-default text-w-light"
                    data-dismiss="modal"
                    onClick={() => this.onCancelClicked()}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger popup-button-danger"
                    onClick={() => this.getUserList()}
                  >
                    Done
                  </button> */}
                </div>
                {users.length ? (
                  <div className="row">
                    <div className="col-md-12">
                      {/* Table Section Start */}
                      <form onSubmit={this.onFormSubmit}>
                        <div className="table-responsive" style={{height: "55vh"}}>
                          <table className="table table-style-1 m-t-15">
                            <thead>
                              <tr>
                                
                                <th scope="col" width={420}>
                                  NAME
                                </th>
                                <th scope="col" width={400}>
                                  EMAIL ID
                                </th>
                                <th scope="col" width={200}>
                                  ACTION(s)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.length
                                ? users.map((user, index) => {
                                    return (
                                      <tr key={index}>
                                        <td>{user.name}</td>
                                        <td>{user.emailId}</td>
                                        <td>
                                          <input
                                            type="checkbox"
                                            id={user.Id + "_" + user.name}
                                            className="userCheckbox"
                                            onChange={(e)=>this.onSelectReviewer(e, user)}
                                          />
                                        </td>
                                      </tr>
                                    );
                                  })
                                : null}
                            </tbody>
                          </table>
                        </div>
                        <div className="text-right m-t-5">
                          <button
                            type="submit"
                            className="btn btn-danger popup-button-danger"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                      {/* Table Section End */}
                    </div>
                  </div>
                ) : null}
                {!users.length && isSearched && !loading ? (
                  <div style={{ textAlign: "center" }}>No Data</div>
                ) : null}
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default withApollo(ReviewerAdd);