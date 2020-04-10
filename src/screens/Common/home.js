import React from "react";
// import image from "../../static/images/home.jpg";
import image from "../../static/images/logo.jpg";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        // style={{ backgroundImage: "url(" + image + ")", minHeight: "100%" }}
        // className="row"
        style={{ textAlign: "center", marginTop: "15%" }}
        // className="mt-5"
      >
        <img src={image} width="360px"></img>
      </div>
    );
  }
}

export default Home;
