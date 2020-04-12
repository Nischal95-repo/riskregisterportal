import React from "react";

import { withApollo } from "react-apollo";

import { GET_LIST_OF_EMPLOYEES } from "../../../services/graphql/queries/riskRegister";

import ReactModal from "../../Common/ReactModal";
import DisplayErrors from "../../Common/DisplayErrors";

import { SET_TIMEOUT_VALUE } from "../../../constants/app-constants";

import { errorMessage } from "../../../miscellaneous/error-messages";

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
      requireCancel: true
    };
    this.submitModal = this.submitModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  submitModal() {
    this.props.client
      .mutate({
        mutation: "",
        variables: {
          id: this.state.deleteId
        },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        this.setState({ reactModalVisible: false });
        this.getListOfReviewers();
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, errors: [errorMessage(error)] });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  }

  closeModal() {
    this.setState({ reactModalVisible: false, deleteId: "" });
  }

  onRemoveReviewer(id) {
    this.setState({
      reactModalVisible: true,
      modalMessage: "Are you sure, you want to delete this reviewer?",
      deleteId: id
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
          riskId: parseInt(localStorage.getItem("riskId"))
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var employees = result.data.getListOfEmployeesForRisk;
        // employees = employees.sort((a, b) => this.compare(a, b));

        this.initialState = {
          employees: employees
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  componentDidMount() {
    this.getListOfEmployees();
  }

  render() {
    const {
      loading,
      errors,
      employees,
      reactModalVisible,
      requireCancel,
      modalMessage
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
              Employee List
            </h1>

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
            <a href="#" onClick={this.props.changeMode} className="link-click ">
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
                  <circle
                    fill="none"
                    stroke="#69951a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    cx={8}
                    cy={8}
                    r="7.5"
                  />
                  <g>
                    <line
                      fill="none"
                      stroke="#69951a"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit={10}
                      x1="2.5"
                      y1={8}
                      x2="13.5"
                      y2={8}
                    />
                    <line
                      fill="none"
                      stroke="#69951a"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit={10}
                      x1={8}
                      y1="2.5"
                      x2={8}
                      y2="13.5"
                    />
                  </g>
                </g>
              </svg>
              Add
            </a>
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
                            <a
                              href="#"
                              className="link-delete m-l-45"
                              data-toggle="tooltip"
                              data-placement="bottom"
                              title="Delete"
                            >
                              <svg
                                x="0px"
                                y="0px"
                                width="16px"
                                height="16px"
                                viewBox="0 0 16 16"
                                onClick={() => this.onRemoveReviewer(data.id)}
                              >
                                <g transform="translate(0, 0)">
                                  <path
                                    fill="none"
                                    stroke="#61951a"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit={10}
                                    d="M2.5,6.5v7 c0,1.105,0.895,2,2,2h8c1.105,0,2-0.895,2-2v-7"
                                  />
                                  <line
                                    data-color="color-2"
                                    fill="none"
                                    stroke="#61951a"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit={10}
                                    x1="1.5"
                                    y1="3.5"
                                    x2="15.5"
                                    y2="3.5"
                                  />
                                  <polyline
                                    data-color="color-2"
                                    fill="none"
                                    stroke="#61951a"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit={10}
                                    points=" 6.5,3.5 6.5,0.5 10.5,0.5 10.5,3.5 "
                                  />
                                  <line
                                    fill="none"
                                    stroke="#61951a"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit={10}
                                    x1="8.5"
                                    y1="7.5"
                                    x2="8.5"
                                    y2="12.5"
                                  />
                                  <line
                                    fill="none"
                                    stroke="#61951a"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit={10}
                                    x1="11.5"
                                    y1="7.5"
                                    x2="11.5"
                                    y2="12.5"
                                  />
                                  <line
                                    fill="none"
                                    stroke="#61951a"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit={10}
                                    x1="5.5"
                                    y1="7.5"
                                    x2="5.5"
                                    y2="12.5"
                                  />
                                </g>
                              </svg>
                            </a>
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
