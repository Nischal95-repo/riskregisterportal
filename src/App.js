import React from "react";
import { Route, withRouter } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

// profile
import ProfileEdit from "./pages/user-edit";
import Profile from "./pages/user-profile";
import ChangePassword from "./pages/change-password";
import Login from "./pages/login";
import Home from "./pages/home";

// RiskRegister
import RiskRegister from "./pages/risk-register";
import AddRiskRegister from "./pages/add-risk";

import RiskDetail from "./pages/risk-detail";
import MitigationApproval from "./pages/approve-mitigation";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        {/* <AdminDashboard> */}
        {/* <Route exact path="/" component={CheckDevice} /> */}
        <Route exact path="/" component={Login} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/change-password" component={ChangePassword} />
        <Route exact path="/user-edit" component={ProfileEdit} />
        <Route exact path="/user-profile" component={Profile} />
        {/* Risk Register */}
        <Route exact path="/risk-register" component={RiskRegister} />
        <Route exact path="/add-risk" component={AddRiskRegister} />
        <Route exact path="/risk-detail" component={RiskDetail} />
        <Route
          exact
          path="/approve-mitigation"
          component={MitigationApproval}
        />
        {/* Risk Register */}
      </>
    );
  }
}

export default withRouter(App);
