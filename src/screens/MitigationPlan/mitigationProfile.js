import React from "react";

import { RISK_DETAIL } from "../../services/graphql/queries/riskRegister";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import MitigationList from "./mitigationList";
import MitigationAdd from "./mitigationAdd";

import { withApollo } from "react-apollo";
class RiskProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      mitigationDetails: [],
      loading: true
    };
  }
  //   getRiskDetail = () => {
  //     this.setState({ loading: true });
  //     this.props.client
  //       .query({
  //         query: RISK_DETAIL,
  //         variables: { id: 6 },
  //         fetchPolicy: "network-only"
  //       })
  //       .then(result => {
  //         console.log("result", result);
  //         let data = result.data.getRiskById;
  //         this.setState({ mitigationDetails: data, loading: false });
  //       })
  //       .catch(error => {
  //         console.log("error", error);
  //       });
  //   };
  changeMode = () => {
    this.setState(prevState => {
      return {
        editMode: !prevState.editMode
      };
    });
  };
  componentDidMount() {
    // this.getRiskDetail();
    this.setState({
      mitigationDetails: this.props.mitigationDetails,
      loading: false
    });
  }
  render() {
    const { mitigationDetails, editMode, loading } = this.state;

    return (
      <div className="box-card">
        {!editMode && !loading ? (
          <MitigationList
            mitigationDetails={mitigationDetails}
            changeMode={this.changeMode}
          ></MitigationList>
        ) : (
          <MitigationAdd changeMode={this.changeMode}></MitigationAdd>
        )}
      </div>
    );
  }
}
export default withApollo(RiskProfile);
