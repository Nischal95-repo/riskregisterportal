import React from "react";
import { connect } from "react-redux";
// import NavItem from "./NavItem";
import { Logout } from "../../services/graphql/queries/auth";
import { GET_PERMISSION } from "../../services/graphql/queries/accessPermission";
import { redirectTo } from "../../util/redirect";
import {
  logoutAction,
  addPermission,
} from "../../services/redux/actions/login-action";
import withApollo from "react-apollo";
class Nav extends React.Component {
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
        localStorage.clear();
      })
      .catch((error) => {
        console.log("~~~error: ", error);
      });
    // debugger;
    this.props.dispatch(logoutAction());
    // this.props.addPermission({});
    redirectTo("/");
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
    // if (!Object.keys(this.props.permission).length) {
    //   this.getPermission();
    // }
    this.getPermission();
  }
  render() {
    const accessPermission = this.props.permission;
    console.log(accessPermission);
    return (
      <section className={`nav-section ${this.props.expandMenuClass}`}>
        <ul className="list-unstyled">
          {accessPermission && accessPermission[100] ? (
            <li>
              <a href="/usersview">
                <figure>
                  <svg
                    x="0px"
                    y="0px"
                    width="18px"
                    height="18px"
                    viewBox="0 0 16 16"
                  >
                    <g transform="translate(0, 0)">
                      <path
                        data-color="color-2"
                        d="M14.5,12.976a1,1,0,0,0-.426-.82A10.367,10.367,0,0,0,8,10.5a10.367,10.367,0,0,0-6.074,1.656,1,1,0,0,0-.426.82V15.5h13Z"
                        fill="none"
                        stroke="#69951a"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx={8}
                        cy={4}
                        r="3.5"
                        fill="none"
                        stroke="#69951a"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </figure>
                <span>User Mgmt.</span>
              </a>
            </li>
          ) : (
            ""
          )}
          {accessPermission && accessPermission[110] ? (
            <li>
              <a href="/upload-documents-list">
                <figure>
                  <svg
                    x="0px"
                    y="0px"
                    width="18px"
                    height="18px"
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
                </figure>
                <span>Doc. Upload</span>
              </a>
            </li>
          ) : (
            ""
          )}
          {accessPermission && accessPermission[120] ? (
            <li>
              <a href="/review-documents-list">
                <figure>
                  <svg
                    x="0px"
                    y="0px"
                    width="18px"
                    height="18px"
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
                      ></line>
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
                      ></line>
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
                      ></line>
                      <polygon
                        fill="none"
                        stroke="#69951a"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit={10}
                        points="9.5,0.5 1.5,0.5 1.5,15.5 14.5,15.5 14.5,5.5 "
                      ></polygon>
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
                </figure>{" "}
                <span>Doc. Review</span>
              </a>
            </li>
          ) : (
            ""
          )}
          {accessPermission && accessPermission[130] ? (
            <li>
              <a href="/question-list">
                <figure>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    id="Capa_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 512 512"
                    style={{ enableBackground: "new 0 0 512 512" }}
                    xmlSpace="preserve"
                    width="16px"
                    height="16px"
                  >
                    <g>
                      <g>
                        <g>
                          <g>
                            <circle
                              cx={256}
                              cy="378.5"
                              r={25}
                              data-original="#000000"
                              className="active-path"
                              data-old_color="#000000"
                              fill="#69951A"
                            />
                            <path
                              d="M256,0C114.516,0,0,114.497,0,256c0,141.484,114.497,256,256,256c141.484,0,256-114.497,256-256     C512,114.516,397.503,0,256,0z M256,472c-119.377,0-216-96.607-216-216c0-119.377,96.607-216,216-216     c119.377,0,216,96.607,216,216C472,375.377,375.393,472,256,472z"
                              data-original="#000000"
                              className="active-path"
                              data-old_color="#000000"
                              fill="#69951A"
                            />
                            <path
                              d="M256,128.5c-44.112,0-80,35.888-80,80c0,11.046,8.954,20,20,20s20-8.954,20-20c0-22.056,17.944-40,40-40     c22.056,0,40,17.944,40,40c0,22.056-17.944,40-40,40c-11.046,0-20,8.954-20,20v50c0,11.046,8.954,20,20,20     c11.046,0,20-8.954,20-20v-32.531c34.466-8.903,60-40.26,60-77.469C336,164.388,300.112,128.5,256,128.5z"
                              data-original="#000000"
                              className="active-path"
                              data-old_color="#000000"
                              fill="#69951A"
                            />
                          </g>
                        </g>
                      </g>
                    </g>{" "}
                  </svg>
                </figure>
                <span>Question Mgmt.</span>
              </a>
            </li>
          ) : (
            ""
          )}
          {accessPermission && accessPermission[140] ? (
            <li>
              <a href="/test-list">
                <figure>
                  <img src="static/images/test.svg" />
                </figure>
                <span>Compl. Test</span>
              </a>
            </li>
          ) : (
            ""
          )}
          {accessPermission && accessPermission[150] ? (
            <li>
              <a href="/emp-test-list">
                <figure>
                  <img src="static/images/test.svg" />
                </figure>
                <span>Emp. Test</span>
              </a>
            </li>
          ) : (
            ""
          )}

          {accessPermission && accessPermission[170] ? (
            <li>
              <a href="/masters-list">
                <figure>
                  <img src="static/images/master.svg" />
                </figure>{" "}
                <span>Masters</span>
              </a>
            </li>
          ) : (
            ""
          )}
          <li>
            <a href="#">
              <figure>
                <svg
                  x="0px"
                  y="0px"
                  width="18px"
                  height="18px"
                  viewBox="0 0 16 16"
                >
                  <g transform="translate(0, 0)">
                    <circle
                      data-color="color-2"
                      fill="none"
                      stroke="#69951a"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit={10}
                      cx={8}
                      cy={8}
                      r="2.5"
                    />
                    <path
                      fill="none"
                      stroke="#69951a"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit={10}
                      d="M15.5,9V7 l-2.177-0.363c-0.131-0.512-0.332-0.994-0.595-1.437l1.283-1.796L12.596,1.99L10.8,3.272c-0.443-0.263-0.925-0.464-1.437-0.595 L9,0.5H7L6.637,2.677C6.125,2.808,5.643,3.009,5.2,3.272L3.404,1.99L1.99,3.404L3.272,5.2C3.009,5.643,2.808,6.125,2.677,6.637 L0.5,7v2l2.177,0.363c0.131,0.512,0.332,0.994,0.595,1.437L1.99,12.596l1.414,1.414L5.2,12.728c0.443,0.263,0.925,0.464,1.437,0.595 L7,15.5h2l0.363-2.177c0.512-0.131,0.994-0.332,1.437-0.595l1.796,1.283l1.414-1.414L12.728,10.8 c0.263-0.443,0.464-0.925,0.595-1.437L15.5,9z"
                    />
                  </g>
                </svg>
              </figure>
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a href="../../GridData/gird/grid_gridlist.html">
              <figure>
                <img src="../../images/grid.svg" />
              </figure>
              <span>Grid Mgmt.</span>
            </a>
          </li>
          <li>
            <a href="/">
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
export default connect(mapStateToProps)(withApollo(Nav));
