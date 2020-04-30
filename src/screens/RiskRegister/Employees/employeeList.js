import React from "react";

import { withApollo } from "react-apollo";

import {
  GET_LIST_OF_EMPLOYEES,
  REMOVE_EMPLOYEE,
} from "../../../services/graphql/queries/riskRegister";

import ReactModal from "../../Common/ReactModal";
import DisplayErrors from "../../Common/DisplayErrors";

import { SET_TIMEOUT_VALUE } from "../../../constants/app-constants";

import { errorMessage } from "../../../miscellaneous/error-messages";
import { errorMsg, successMsg } from "../../Common/alert";
import AddSvg from "../../../static/images/svg/Add.svg";
import DeleteSvg from "../../../static/images/svg/Delete.svg";
import Expand from "../../../static/images/svg/plus.svg";
class EmployeeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errors: [],
      employees: [],
      deleteId: "",
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: "",
      requireCancel: true,
    };
    this.submitModal = this.submitModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  submitModal() {
    this.props.client
      .mutate({
        mutation: REMOVE_EMPLOYEE,
        variables: {
          id: this.state.deleteId,
        },
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        this.setState({ reactModalVisible: false });
        successMsg("Employee deleted successfully");
        this.getListOfEmployees();
      })
      .catch((error) => {
        console.log("~~~error: ", error);
        this.setState({ loading: false });
        errorMsg([errorMessage(error)][0][0]);
      });
  }

  closeModal() {
    this.setState({ reactModalVisible: false, deleteId: "" });
  }

  onRemoveReviewer(id) {
    this.setState({
      reactModalVisible: true,
      modalMessage: "Are you sure, you want to delete this employee?",
      deleteId: id,
    });
  }

  compare(a, b) {
    const bandA = a.userDetail.name.toUpperCase();
    const bandB = b.userDetail.name.toUpperCase();
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  getListOfEmployees() {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: GET_LIST_OF_EMPLOYEES,
        variables: {
          riskId: parseInt(localStorage.getItem("riskId")),
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var employees = result.data.getListOfEmployeesForRisk;
        // employees = employees.sort((a, b) => this.compare(a, b));

        this.initialState = {
          employees: employees,
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  }

  componentDidMount() {
    debugger;
    this.getListOfEmployees();
  }

  render() {
    const {
      loading,
      errors,
      employees,
      reactModalVisible,
      requireCancel,
      modalMessage,
    } = this.state;
    const { document } = this.props;
    return (
      <div className="p-t-0" id="showlistDiv">
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
          closeModal={this.closeModal}
        />
        <div className="row align-items-center">
          <div className="col-md-10">
            <h1
              className="heading m-b-0"
              onClick={this.props.displayToggle}
              style={{ cursor: "pointer" }}
            >
              <img src={Expand} className="mr-2" />
              Additional Viewers
            </h1>

            {/* <div
              className="row"
              style={{
                display: errors.length === 0 ? "none" : "block",
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
            </div> */}
          </div>
          <div className="col-md-2 text-right">
            {this.props.riskDetails &&
            this.props.riskDetails.canEdit &&
            this.props.riskDetails.canEdit.canEdit ? (
              <a
                href="#"
                title="Add"
                onClick={this.props.changeMode}
                className="link-click "
              >
                <img src={AddSvg} />
                &nbsp; Add
              </a>
            ) : null}
          </div>
        </div>

        {this.props.display ? (
          <div className="table-responsive" style={{ maxHeight: "52vh" }}>
            <table className="table table-style-1 ">
              <thead>
                <tr>
                  {/* <th scope="col" width={400}>
                    NAME
                  </th> */}
                  <th scope="col" width={400}>
                    EMAIL ID
                  </th>
                  <th scope="col" width={420}>
                    ACTION(s)
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.length
                  ? employees.map((data, index) => {
                      return (
                        <tr>
                          {/* <td></td> */}
                          <td>{data.userId ? data.userId.loginId : ""}</td>
                          <td>
                            {this.props.riskDetails &&
                            this.props.riskDetails.canEdit &&
                            this.props.riskDetails.canEdit.canEdit ? (
                              <a
                                href="#"
                                className="link-delete m-l-45"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Delete"
                                onClick={() => this.onRemoveReviewer(data.id)}
                              >
                                <img src={DeleteSvg} />
                              </a>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
            {!employees.length && !loading ? (
              <div style={{ textAlign: "center" }}>No Data</div>
            ) : null}
          </div>
        ) : null}
        {/* Table Section End */}
      </div>
    );
  }
}

export default withApollo(EmployeeList);
