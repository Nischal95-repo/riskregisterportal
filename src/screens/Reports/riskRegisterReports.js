import React from "react";
import RiskRegister from "../RiskRegister/RiskRegister";

class RiskRegisterReport extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    return <RiskRegister isReports={true}></RiskRegister>;
  }
}

export default RiskRegisterReport;
