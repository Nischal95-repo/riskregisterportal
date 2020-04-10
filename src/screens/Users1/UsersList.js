import React from "react";
import { withApollo } from "react-apollo";
import { getUserListQuery } from "../../services/graphql/queries/user";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import Pagination from "../Common/Pagination";
import NotAccessible from "../Common/NotAccessible";
import ReactModal from "../Common/ReactModal";

import {
  PAGINATION_OFFSET_VALUE,
  DO_NOT_ACCESS_MESSAGE
} from "../../constants/app-constants";

// import { redirectTo } from "../../util/redirect";
import { withRouter } from "react-router-dom";

import UserFilter from "./UserFilter";

const USER_MODULE_ID = 1;
const USER_FEATURE_ID = 100;

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: "",
      pageOfItems: [],
      currentPage: 1,
      offset: PAGINATION_OFFSET_VALUE,
      showFilter: false,
      isFilterApply: false,
      filterData: {},
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: DO_NOT_ACCESS_MESSAGE,
      accessSpecifier: {}
    };
    this.submitModal = this.submitModal.bind(this);
    this.filterAction = this.filterAction.bind(this);
    this.onFilterData = this.onFilterData.bind(this);
  }

  submitModal() {
    this.setState({ reactModalVisible: false });
  }

  onAddUser() {
    if (this.state.accessSpecifier.createP) {
      // redirectTo("/createusers");
      this.props.history.push("/createusers");
    } else {
      this.setState({ reactModalVisible: true });
    }
  }

  onFilterData(data, isFilterApply) {
    this.setState({
      isFilterApply: isFilterApply,
      filterData: data,
      currentPage: 1
    });
    if (isFilterApply) {
      this.getListOfUsers(this.state.offset, 1, data);
    } else {
      this.setState({
        filterData: {}
      });
      this.getListOfUsers(this.state.offset, 1);
    }
  }

  filterAction() {
    this.setState(prevState => {
      return {
        showFilter: !prevState.showFilter
      };
    });
  }

  onChangePage(currentPage) {
    // update state with new page of items
    this.setState(
      {
        currentPage: currentPage,
        loading: true
      },
      () => {
        if (this.state.isFilterApply) {
          this.getListOfUsers(
            this.state.offset,
            currentPage,
            this.state.filterData
          );
        } else {
          this.getListOfUsers(this.state.offset, currentPage);
        }
      }
    );
  }

  getListOfUsers(offset, pageNo, data) {
    this.props.client
      .query({
        query: getUserListQuery,
        variables: {
          offset: offset,
          pageNo: pageNo,
          employeeId: data ? data.employeeId : null,
          name: data ? data.name : "",
          emailId: data ? data.emailId : ""
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var user = result.data.getListOfOrgUsers;

        this.initialState = {
          pageOfItems: user
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  componentDidMount() {
    this.setState({
      loading: true
    });

    this.props.client
      .query({
        query: getAccessPermisionQuery,
        variables: {
          moduleId: USER_MODULE_ID
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        let response = result.data.getFunctionByModuleId;
        response = JSON.parse(response);
        this.setState({
          accessSpecifier: response[USER_FEATURE_ID]
        });
        this.getListOfUsers(this.state.offset, this.state.currentPage);
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message
        });
      });
  }

  render() {
    const {
      loading,
      error,
      accessSpecifier,
      reactModalVisible,
      requireCancel,
      modalMessage,
      pageOfItems
    } = this.state;
    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    return (
      <>
        {accessSpecifier && accessSpecifier.viewP ? (
          <div>
            <ReactModal
              reactModalVisible={reactModalVisible}
              submitModal={this.submitModal}
              modalMessage={modalMessage}
              requireCancel={requireCancel}
            />
            <div className="row align-items-center no-gutters">
              <div className="col-md-6">
                <h1 className="heading m-b-0">User List View</h1>
              </div>
              <div className="col-md-6 text-right">
                <a
                  href="#"
                  className="btn btn-danger"
                  onClick={() => this.onAddUser()}
                >
                  Add User
                </a>
                <button
                  className="btn btn-primary filter-btn  m-l-10"
                  onClick={this.filterAction}
                >
                  Filter
                </button>
                <UserFilter
                  showFilter={this.state.showFilter}
                  filterData={this.state.filterData}
                  listData={this.onFilterData}
                  filterAction={this.filterAction}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-style-1">
                <thead>
                  <tr>
                    {/* <th scope="col">EMPLOYEE ID</th> */}
                    <th scope="col">NAME</th>
                    <th scope="col">EMAIL ID</th>
                    <th scope="col">USER TYPE</th>
                    <th scope="col">REPORTING MANAGER</th>
                    <th scope="col">ACTION(s)</th>
                  </tr>
                </thead>
                <tbody>
                  {pageOfItems.length
                    ? pageOfItems.map((data, index) => {
                        return (
                          <tr key={index}>
                            {/* <td>{data.employeeId}</td> */}
                            <td>{data.name}</td>
                            <td>{data.emailId}</td>
                            <td>
                              {data.lockedDetail && 
                              data.lockedDetail.entityType == 1 ? "Ayana Investor ": "Ayana User"}
                            </td>
                            <td
                              style={{
                                paddingLeft:
                                  data.reportingManager &&
                                  data.reportingManager.name
                                    ? "9px"
                                    : "70px "
                              }}
                            >
                              {data.reportingManager &&
                              data.reportingManager.name
                                ? data.reportingManager.name
                                : "-"}
                            </td>

                            <td id="td1">
                              <a
                                href={"userdetails?id=" + data.Id}
                                className="link-primary"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="View"
                              >
                                <svg
                                  x="0px"
                                  y="0px"
                                  width="16px"
                                  height="16px"
                                  viewBox="0 0 16 16"
                                >
                                  <g transform="translate(0, 0)">
                                    <line
                                      fill="none"
                                      stroke="#69951a"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeMiterlimit={10}
                                      x1="4.5"
                                      y1="11.5"
                                      x2="11.5"
                                      y2="11.5"
                                      data-color="color-2"
                                    />
                                    <line
                                      fill="none"
                                      stroke="#69951a"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeMiterlimit={10}
                                      x1="4.5"
                                      y1="8.5"
                                      x2="11.5"
                                      y2="8.5"
                                      data-color="color-2"
                                    />
                                    <line
                                      fill="none"
                                      stroke="#69951a"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeMiterlimit={10}
                                      x1="4.5"
                                      y1="5.5"
                                      x2="6.5"
                                      y2="5.5"
                                      data-color="color-2"
                                    />
                                    <polygon
                                      fill="none"
                                      stroke="#69951a"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeMiterlimit={10}
                                      points="9.5,0.5 1.5,0.5 1.5,15.5 14.5,15.5 14.5,5.5 "
                                    />
                                    <polyline
                                      fill="none"
                                      stroke="#69951a"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeMiterlimit={10}
                                      points="9.5,0.5 9.5,5.5 14.5,5.5 "
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
            </div>
            {!pageOfItems.length && error ? <div>{error}</div> : null}
            {!pageOfItems.length && loading ? <div>Fetching...</div> : null}
            {!pageOfItems.length && !error && !loading ? (
              <div style={{ textAlign: "center" }}>No Data</div>
            ) : null}
            <Pagination
              loading={loading}
              items={pageOfItems}
              pageSize={this.state.offset}
              initialPage={this.state.currentPage}
              onChangePage={this.onChangePage.bind(this)}
            />
          </div>
        ) : (
          <NotAccessible />
        )}
      </>
    );
  }
}
export default withRouter(withApollo(UsersList));
