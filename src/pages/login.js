import React from "react";
import { withRouter } from "react-router-dom";
import { render } from "react-dom";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
class Check extends React.Component {
  componentDidMount() {
    if (isMobile) {
      this.props.history.push("/mobile-login");
    } else {
      this.props.history.push("/login");
    }
  }
  render() {
    return <></>;
  }
}

export default withRouter(Check);
