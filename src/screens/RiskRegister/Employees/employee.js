import React from "react";

import AddEmployee from "./addEmployees";
import EmployeeList from "./employeeList";
import ReactModal from "../../Common/ReactModal";

import { DO_NOT_ACCESS_MESSAGE } from "../../../constants/app-constants";
class Reviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: props.document,
      addMode: false,
      display: false,
      riskDetails: {},
      reactModalVisible: false,
      requireCancel: false,
    };
    this.toggleMode = this.toggleMode.bind(this);
  }

  toggleMode = () => {
    if (this.props.editPermission) {
      this.setState((prevState) => {
        return { addMode: !prevState.addMode };
      });
    } else this.setState({ reactModalVisible: true });
  };
  displayToggle = () => {
    this.setState((prevState) => {
      return { display: !prevState.display };
    });
  };
  submitModal = () => {
    this.setState({ reactModalVisible: false });
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
    const {
      document,
      addMode,
      display,
      riskDetails,
      reactModalVisible,
      requireCancel,
    } = this.state;
    return (
      <>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={DO_NOT_ACCESS_MESSAGE}
          requireCancel={requireCancel}
        />
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
      </>
    );
  }
}

export default Reviewer;
