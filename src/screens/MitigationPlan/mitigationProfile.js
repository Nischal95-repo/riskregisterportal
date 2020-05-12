import React from "react";

import { GET_LIST_OF_MITIGATIONS } from "../../services/graphql/queries/riskRegister";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import MitigationList from "./mitigationList";
import MitigationAdd from "./mitigationAdd";
import ReactModal from "../Common/ReactModal";
import { DO_NOT_ACCESS_MESSAGE } from "../../constants/app-constants";
import { withApollo } from "react-apollo";
class RiskProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addMode: false,
      mitigationDetails: [],
      riskDetails: {},
      loading: true,
      riskId: "",
      reactModalVisible: false,
      requireCancel: false,
    };
  }
  getList = () => {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: GET_LIST_OF_MITIGATIONS,
        variables: { id: this.state.riskId },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        console.log("result", result);
        let data = result.data.getListOfMitigationPlansById;
        this.setState({ mitigationDetails: data, loading: false });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  changeMode = () => {
    if (this.state.accessSpecifier[240].editP) {
      this.setState((prevState) => {
        return {
          addMode: !prevState.addMode,
        };
      });
    } else this.setState({ reactModalVisible: true });
  };
  submitModal = () => {
    this.setState({ reactModalVisible: false });
  };
  componentDidMount() {
    // this.getRiskDetail();
    this.props.client
      .query({
        query: getAccessPermisionQuery,
        variables: {
          moduleId: 14,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        let response = result.data.getFunctionByModuleId;
        response = JSON.parse(response);

        this.setState({
          mitigationDetails: this.props.mitigationDetails,
          riskDetails: this.props.riskDetails,
          loading: false,
          riskId: this.props.riskId,
          accessSpecifier: response,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
    // this.setState({
    //   mitigationDetails: this.props.mitigationDetails,
    //   riskDetails: this.props.riskDetails,
    //   loading: false,
    //   riskId: this.props.riskId,
    // });
  }
  render() {
    const {
      mitigationDetails,
      addMode,
      loading,
      riskId,
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
          {!addMode && !loading ? (
            <MitigationList
              mitigationDetails={mitigationDetails}
              changeMode={this.changeMode}
              updateList={this.getList}
              riskDetails={riskDetails}
            ></MitigationList>
          ) : (
            <MitigationAdd
              changeMode={this.changeMode}
              updateList={this.getList}
              riskId={riskId}
            ></MitigationAdd>
          )}
        </div>
      </>
    );
  }
}
export default withApollo(RiskProfile);
