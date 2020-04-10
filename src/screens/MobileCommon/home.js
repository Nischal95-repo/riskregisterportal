import React from "react";
// import image from "../../static/images/mobile-home.jpg";
import image from "../../static/images/logo.jpg";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div class="main-section pt-0 pl-0 pr-0">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12 text-center">
              <img class="home-img" src={image} width="60%" height="120%" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
