import React from "react";

import AddEmployee from "./addEmployees";
import EmployeeList from "./employeeList";

class Reviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: props.document,
      addMode: false,
      display: false,
      riskDetails: {},
    };
    this.toggleMode = this.toggleMode.bind(this);
  }

  toggleMode() {
    this.setState({ addMode: !this.state.addMode });
  }
  displayToggle = () => {
    this.setState((prevState) => {
      return { display: !prevState.display };
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.riskDetails !== this.props.riskDetails) {
      this.setState({
        // document: this.props.document,
        riskDetails: this.props.riskDetails,
      });
    }
  }
  componentDidMount() {
    this.setState({ riskDetails: this.props.riskDetails });
  }
  render() {
    const { document, addMode, display, riskDetails } = this.state;
    return (
      <div className="box-card">
        {addMode ? (
          <AddEmployee
            changeMode={this.toggleMode}
            display={display}
            riskId={this.props.riskId}
          ></AddEmployee>
        ) : (
          <EmployeeList
            changeMode={this.toggleMode}
            displayToggle={this.displayToggle}
            display={display}
            riskDetails={riskDetails}
          ></EmployeeList>
        )}
      </div>
    );
  }
}

export default Reviewer;
