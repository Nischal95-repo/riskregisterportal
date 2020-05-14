import React from "react";
import { connect } from "react-redux";

import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Notifications from "./components/Notifications";
import Footer from "./components/Footer";
class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotificationsClass: "",
      expandMenuClass: "",
    };

    this.toggleNotifications = this.toggleNotifications.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleNotifications(event) {
    console.log("Toggle Notification");
    event.preventDefault(false);
    this.state.showNotificationsClass === ""
      ? this.setState({ showNotificationsClass: "expand" })
      : this.setState({ showNotificationsClass: "" });
  }

  toggleMenu(event) {
    console.log("Toggle Menu");
    event.preventDefault(false);
    this.state.expandMenuClass === ""
      ? this.setState({ expandMenuClass: "expand" })
      : this.setState({ expandMenuClass: "" });
  }

  render() {
    return (
      <div className="desktop">
        <Header
          username={this.props.userName}
          toggleNotifications={this.toggleNotifications}
          toggleMenu={this.toggleMenu}
        />
        <SideBar expandMenuClass={this.state.expandMenuClass} />
        <section className={`main-section ${this.state.expandMenuClass}`}>
          {this.props.children}
        </section>
        <Footer />
        {/* <Notifications
          toggleNotifications={this.toggleNotifications}
          showNotificationsClass={this.state.showNotificationsClass}
        /> */}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { userName: state.auth.userName };
}
export default connect(mapStateToProps)(AdminDashboard);
