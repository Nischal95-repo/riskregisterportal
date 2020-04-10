import React from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";

import { Link, withRouter } from "react-router-dom";
import test from "../../../static/images/test.svg";
import master from "../../../static/images/master.svg";
import { Logout } from "../../../services/graphql/queries/auth";
import {
  loginAction,
  addPermission
} from "../../../services/redux/actions/loginActions";
import { GET_PERMISSION } from "../../../services/graphql/queries/accessPermission";
import TaskUploadImage from "../../../static/images/task-upload.png";
import TaskReviewImage from "../../../static/images/svg/view.svg";

import avatar from "../../../static/images/avatar1.png";
class SideBar extends React.Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    this.props.client
      .mutate({
        mutation: Logout,
        variables: { logoutBy: 1 },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        console.log("result", result.data.logout.message);
        document
          .getElementsByTagName("body")[0]
          .classList.toggle("menu-expand");
        localStorage.clear();
        this.props.history.push("/mobile-login");
      })
      .catch(error => {
        console.log("~~~error: ", error);
      });
    // debugger;
    this.props.dispatch(loginAction());
  };
  getPermission() {
    this.props.client
      .query({
        query: GET_PERMISSION,
        fetchPolicy: "network-only"
      })
      .then(result => {
        console.log("nav permission ", JSON.parse(result.data.getPermission));
        this.setState(
          {
            accessPermission: JSON.parse(result.data.getPermission),
            loading: true
          },
          () => {
            this.props.dispatch(addPermission(this.state.accessPermission));
          }
        );
      })
      .catch(error => {
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

  onNavClick = () => {
    let ele = document
      .getElementsByClassName("menu1")[0]
      .classList.toggle("menu-expand");
    console.log("adsdasdas", ele);
  };

  render() {
    const accessPermission = this.props.permission;
    return (
      // <section className={`nav-section ${this.props.expandMenuClass}`}>
      <div id="menu1" className="menu1">
        <div class="menu-section">
          <div class="user-profile">
            <img src={avatar} />
            <span>{this.props ? this.props.username : ""}</span>
          </div>
          <div class="sidebar-scroll">
            <nav class="nav">
              {/* <a className="nav-link " href="/mobile-home">
                <i class="fas fa-home green"></i>
                <span>Home</span>
              </a> */}
              {accessPermission && accessPermission[120] ? (
                <a className="nav-link " href="/mobile-review-documents-list">
                  <img src={TaskReviewImage} />

                  <span>Task Review</span>
                </a>
              ) : (
                ""
              )}

              {accessPermission && accessPermission[191] ? (
                <a className="nav-link " href="/mobile-view-info-list">
                  <i class="fas fa-info-circle green"></i>

                  <span>Info View</span>
                </a>
              ) : (
                ""
              )}

              <a
                className="nav-link "
                onClick={() => {
                  this.logout();
                }}
              >
                <i class="fas fa-sign-out-alt green"></i>

                <span>Logout</span>
              </a>
            </nav>
          </div>
        </div>
        <div
          class="menu-hider"
          onClick={() => {
            this.onNavClick();
          }}
        ></div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state,
  permission: state.auth.permission
});
export default connect(mapStateToProps)(withRouter(withApollo(SideBar)));
