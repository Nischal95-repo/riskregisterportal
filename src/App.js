import React from "react";
import { Route, withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { SET_TIMEOUT_VALUE } from "./constants/app-constants";
import "react-toastify/dist/ReactToastify.min.css";
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

// Reports
import Reports from "./pages/reports";
import RiskRegisterReports from "./pages/risk-register-report";

// Dashboard
import Dashboard from "./pages/dashboard";

toast.configure({
  // autoClose: SET_TIMEOUT_VALUE,
  draggable: false,
  //etc you get the idea
});
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
        <Route exact path="/reports" component={Reports} />
        <Route
          exact
          path="/risk-register-report"
          component={RiskRegisterReports}
        />
        <Route exact path="/dashboard" component={Dashboard} />
        {/* Risk Register */}
      </>
    );
  }
}

export default withRouter(App);
