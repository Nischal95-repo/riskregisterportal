import React from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";

import { Link, withRouter } from "react-router-dom";
import test from "../../../static/images/test.svg";
import master from "../../../static/images/master.svg";
import { Logout } from "../../../services/graphql/queries/auth";
import {
  loginAction,
  addPermission,
} from "../../../services/redux/actions/loginActions";
import { GET_PERMISSION } from "../../../services/graphql/queries/accessPermission";
import RiskRegisterImg from "../../../static/images/svg/category.svg";
import DashboardImg from "../../../static/images/svg/dashboard.svg";
import ReportsImg from "../../../static/images/svg/reports.svg";
import InfoViewImage from "../../../static/images/info-view.png";
import QAImage from "../../../static/images/qa.png";
import EmpTestImage from "../../../static/images/emp-test.png";
import TestReportViewImage from "../../../static/images/report.png";
import gridIcon from "../../../static/images/grid.svg";
import GridInputIcon from "../../../static/images/gridColInput.svg";
class SideBar extends React.Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    this.props.client
      .mutate({
        mutation: Logout,
        variables: { logoutBy: 1 },
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        console.log("result", result.data.logout.message);
        let userType = localStorage.getItem("userType");
        console.log("!!!!!!!!!!!!!!", userType);
        localStorage.clear();
        this.props.history.push("/");
        // if (userType == "1") {
        //   localStorage.clear();

        // } else if (userType == "2") {
        //   localStorage.clear();
        //   this.props.history.push("/doc-workflow");
        // } else if (userType == "3") {
        //   localStorage.clear();
        //   this.props.history.push("/compliance-bi-admin");
        // }
      })
      .catch((error) => {
        console.log("~~~error: ", error);
      });
    // debugger;
    this.props.dispatch(loginAction());
  };
  getPermission() {
    this.props.client
      .query({
        query: GET_PERMISSION,
        fetchPolicy: "network-only",
      })
      .then((result) => {
        console.log("nav permission ", JSON.parse(result.data.getPermission));
        this.setState(
          {
            accessPermission: JSON.parse(result.data.getPermission),
            loading: true,
          },
          () => {
            this.props.dispatch(addPermission(this.state.accessPermission));
          }
        );
      })
      .catch((error) => {
        this.props.dispatch(addPermission({}));
        console.log("~~~error: ", error);
      });
  }
  componentDidMount() {
    if (!Object.keys(this.props.permission).length) {
      this.getPermission();
    }
    // this.getPermission();
  }

  render() {
    const accessPermission = this.props.permission;
    return (
      <section
        className={`nav-section ${this.props.expandMenuClass}`}
        style={{ overflowY: "auto", overflowX: "hidden" }}
      >
        <ul className="list-unstyled">
          {/* {accessPermission && accessPermission[100] ? (

          ) : (
            ""
          )} */}
          <li title="Dashboard">
            <a href="#">
              <figure>
                <img src={DashboardImg} />
              </figure>{" "}
              <span>Dashboard</span>
            </a>
          </li>
          <li title="Risk Register">
            <a href="/risk-register">
              <figure>
                <img src={RiskRegisterImg} />
              </figure>{" "}
              <span>Risk Register</span>
            </a>
          </li>
          <li title="Reports">
            <a href="#">
              <figure>
                <img src={ReportsImg} />
              </figure>{" "}
              <span>Reports</span>
            </a>
          </li>

          <li title="Logout">
            <a
              href="#"
              onClick={() => {
                this.logout();
              }}
            >
              <figure>
                <svg
                  x="0px"
                  y="0px"
                  width="18px"
                  height="18px"
                  viewBox="0 0 16 16"
                  style={{ transform: "rotate(90deg)" }}
                >
                  <g transform="translate(0, 0)">
                    <polygon
                      fill="none"
                      stroke="#69951a"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit={10}
                      points="12.5,5.5 8,0.5 3.5,5.5 6.5,5.5 6.5,11.5 9.5,11.5 9.5,5.5 "
                      data-color="color-2"
                    />
                    <path
                      fill="none"
                      stroke="#69951a"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.5,10.5v4c0,0.552-0.448,1-1,1h-13 c-0.552,0-1-0.448-1-1v-4"
                    />
                  </g>
                </svg>
              </figure>
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </section>
    );
  }
}
const mapStateToProps = (state) => ({
  ...state,
  permission: state.auth.permission,
});
export default connect(mapStateToProps)(withRouter(withApollo(SideBar)));
