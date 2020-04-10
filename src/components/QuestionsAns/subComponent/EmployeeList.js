import React from "react";
import { UPDATE_ORDER_NUMBER } from "../../../services/graphql/queries/questions";
import { withApollo } from "react-apollo";
import equal from "fast-deep-equal";
import InputComponent from "../../Common/form-component/InputComponent";
import SimpleReactValidator from "simple-react-validator";
import { SET_TIMEOUT_VALUE } from "../../../constants/app-constants";
import DisplayErrors from "../../Common/DisplayErrors";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import {
  getUserListQuery,
  ADD_EMPLOYEE_TEST
} from "../../../services/graphql/queries/user";
import Modal from "react-awesome-modal";
import popupLogo from "../../../static/images/popup-logo.png";
import { addReviewers } from "../../../services/graphql/queries/document-upload";
import ReactModal from "../../Common/ReactModal";
// import DisplayErrors from "../../Common/DisplayErrors";

class EmployeeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errors: [],
      modalVisible: false,
      isSearched: false,
      employeeId: "",
      name: "",
      users: [],
      userIds: [],
      userNames: [],
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: "",
      usersList: [],
      isModalVisible: false
    };
    this.checkBoxhandler = this.checkBoxhandler.bind(this);
    this.addEmployee = this.addEmployee.bind(this);
    this.callBack = this.callBack.bind(this);
  }
  closeModel() {
    this.setState({
      questionDetail: {
        orderNumber: "",
        id: ""
      }
    });
    // this.props.editOrderVisible();
  }
  onModalVisible() {
    this.setState({ modalVisible: !this.state.modalVisible });
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
  getUserList() {
    this.setState({ loading: true, isSearched: true });
    if (this.state.employeeId || this.state.name) {
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

          this.initialState = {
            users: users
          };
          this.setState({ ...this.initialState, loading: false, error: "" });
        })
        .catch(error => {
          this.setState({ loading: false, error: error.message });
        });
    }
  }
  checkBoxhandler(Id) {
    let array = this.state.usersList;

    if (array.includes(Id)) {
      const index = array.indexOf(Id);
      if (index > -1) {
        array.splice(index, 1);
      }
    } else {
      array.push(Id);
    }
    this.setState(
      {
        usersList: array
      },
      () => {
        console.log("testssssss", this.state.usersList);
      }
    );
  }
  addEmployee() {
    if (this.state.usersList.length) {
      this.props.client
        .mutate({
          mutation: ADD_EMPLOYEE_TEST,
          variables: {
            userId: this.state.usersList,
            testId: parseInt(queryString.parse(this.props.location.search).id)
          },
          fetchPolicy: "no-cache"
        })
        .then(result => {
          this.setState({
            isModalVisible: true,
            modalMessage: "Employees Created Successfully"
          });
        })
        .catch(error => {
          error.graphQLErrors.map(({ message }, i) => {
            this.setState({
              errors: [message]
            });
          });
          setTimeout(() => {
            this.setState({ errors: [] });
          }, SET_TIMEOUT_VALUE);
          //   });
          //   console.log("~~~error: ", error);
          //   this.setState({ loading: false, errors: [errorMessage(error)] });
          //   this.timer = setTimeout(() => {
          //     this.setState({ errors: [] });
          //   }, SET_TIMEOUT_VALUE);
        });
    }
  }
  callBack() {
    this.setState(
      {
        isModalVisible: false
      },
      () => {
        this.props.employeeListMode();
      }
    );
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
      isModalVisible,
      requireCancel,
      modalMessage
    } = this.state;
    // const { model, questionDetail, errors, modelValue } = this.state;

    return (
      <Modal
        visible={this.props.visible}
        effect="fadeInDown"
        width="800"
        className="modal-dialog modal-dialog-centered popvalue"
      >
        <ReactModal
          reactModalVisible={isModalVisible}
          modalMessage={modalMessage}
          submitModal={this.callBack}
          reqireCancel={false}
        ></ReactModal>
        <div style={{ padding: "40px 40px" }}>
          <div className="modal-content" style={{ border: "none" }}>
            <div
              className="modal-header"
              style={{ display: "-webkit-box", padding: 0 }}
            >
              <figure style={{ marginRight: "20px" }}>
                <img src={popupLogo} />
              </figure>
              <h1 className="heading m-l-28">Select Reviewer</h1>
              <br />
              <DisplayErrors errors={errors} />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-6 ">
                  <div className="form-group">
                    <label>EMPLOYEE ID</label>
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
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label>NAME</label>
                    <div className="ui-widget">
                      <input
                        id="name"
                        className="form-control autocomplete"
                        placeholder="Please Enter Employee Name"
                        value={name}
                        onChange={e => this.setState({ name: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer m-t-15">
                <button
                  type="button"
                  className="btn btn-default popup-button-default text-w-light"
                  data-dismiss="modal"
                  //   onClick={() => this.onCancelClicked()}
                  onClick={this.props.employeeListMode}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger popup-button-danger"
                  onClick={() => this.getUserList()}
                >
                  Done
                </button>
              </div>
              {users.length ? (
                <div className="row">
                  <div className="col-md-12">
                    {/* Table Section Start */}
                    <form onSubmit={this.onFormSubmit}>
                      <div className="table-responsive">
                        <table className="table table-style-1 m-t-15">
                          <thead>
                            <tr>
                              <th scope="col" width={180}>
                                EMPLOYEE ID
                              </th>
                              <th scope="col" width={420}>
                                NAME
                              </th>
                              <th scope="col" width={200}>
                                ACTION(s)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {console.log("ids", this.props.selectedEmployees)}
                            {users.length
                              ? users.map((user, index) => {
                                  return (
                                    <>
                                      {!this.props.selectedEmployees.includes(
                                        user.employeeId
                                      ) ? (
                                        <tr key={index}>
                                          <td>{user.employeeId}</td>
                                          <td>{user.name}</td>
                                          <td>
                                            <input
                                              type="checkbox"
                                              id={user.Id + "_" + user.name}
                                              onChange={() => {
                                                this.checkBoxhandler(
                                                  user.employeeId
                                                );
                                              }}
                                              className="userCheckbox"
                                            />
                                          </td>
                                        </tr>
                                      ) : null}
                                    </>
                                  );
                                })
                              : null}
                          </tbody>
                        </table>
                      </div>
                      <div className="text-right">
                        <button
                          type="button"
                          className="btn btn-danger popup-button-danger"
                          onClick={this.addEmployee}
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          className="btn btn-light popup-button-danger ml-2"
                          onClick={() => this.onCancelClicked()}
                        >
                          Cencel
                        </button>
                      </div>
                    </form>
                    {/* Table Section End   onClick={() => this.onCancelClicked()}*/}
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
    );
  }
}
export default withRouter(withApollo(EmployeeList));
