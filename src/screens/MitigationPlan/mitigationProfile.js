import React from "react";

import { GET_LIST_OF_MITIGATIONS } from "../../services/graphql/queries/riskRegister";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import MitigationList from "./mitigationList";
import MitigationAdd from "./mitigationAdd";

import { withApollo } from "react-apollo";
class RiskProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addMode: false,
      mitigationDetails: [],
      loading: true,
      riskId: ""
    };
  }
  getList = () => {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: GET_LIST_OF_MITIGATIONS,
        variables: { id: this.state.riskId },
        fetchPolicy: "network-only"
      })
      .then(result => {
        console.log("result", result);
        let data = result.data.getListOfMitigationPlansById;
        this.setState({ mitigationDetails: data, loading: false });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  changeMode = () => {
    this.setState(prevState => {
      return {
        addMode: !prevState.addMode
      };
    });
  };
  componentDidMount() {
    // this.getRiskDetail();
    this.setState({
      mitigationDetails: this.props.mitigationDetails,
      loading: false,
      riskId: this.props.riskId
    });
  }
  render() {
    const { mitigationDetails, addMode, loading, riskId } = this.state;

    return (
      <div className="box-card">
        {!addMode && !loading ? (
          <MitigationList
            mitigationDetails={mitigationDetails}
            changeMode={this.changeMode}
          ></MitigationList>
        ) : (
          <MitigationAdd
            changeMode={this.changeMode}
            updateList={this.getList}
            riskId={riskId}
          ></MitigationAdd>
        )}
      </div>
    );
  }
}
export default withApollo(RiskProfile);
