import Header from "./Header";
import Nav from "./Nav";
import Notifications from "./Notifications";
import Footer from "./Footer";

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNotificationsClass: "",
      expandMenuClass: ""
    };

    this.toggleNotifications = this.toggleNotifications.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleNotifications(event) {
    event.preventDefault(false);

    this.state.showNotificationsClass === ""
      ? this.setState({ showNotificationsClass: "expand" })
      : this.setState({ showNotificationsClass: "" });
  }

  toggleMenu(event) {
    event.preventDefault(false);

    this.state.expandMenuClass === ""
      ? this.setState({ expandMenuClass: "expand" })
      : this.setState({ expandMenuClass: "" });
  }

  render() {
    console.log("name", this.props.userName);
    return (
      <>
        <Header
          username={this.props.userName}
          toggleNotifications={this.toggleNotifications}
          toggleMenu={this.toggleMenu}
        />
        <Nav expandMenuClass={this.state.expandMenuClass} />
        <section className={`main-section ${this.state.expandMenuClass}`}>
          {this.props.children}
        </section>
        <Footer />
        <Notifications
          toggleNotifications={this.toggleNotifications}
          showNotificationsClass={this.state.showNotificationsClass}
        />
      </>
    );
  }
}

export default Layout;

/*
 $(".menu-icon").click(function () {
    $(".nav-section").toggleClass("expand");
    $(".main-section").toggleClass("expand");
});

$(".notifications, .notifications-close").click(function () {
    $(".notifications-section").toggleClass("expand");
});


*/
