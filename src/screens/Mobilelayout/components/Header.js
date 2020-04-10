import React from "react";
import logo from "../../../static/images/logo.jpg";

class Header extends React.Component {
  onNavClick = () => {
    let ele = document
      .getElementsByClassName("menu1")[0]
      .classList.toggle("menu-expand");
    console.log("adsdasdas", ele);
  };
  render() {
    return (
      <header>
        <a
          className="menu-link"
          onClick={() => {
            this.onNavClick();
          }}
        >
          <i class="fas fa-bars"></i>
        </a>
        <a>
          <img src={logo} className="header-logo" width="100" />
        </a>
        <a></a>
      </header>
    );
  }
}

export default Header;
