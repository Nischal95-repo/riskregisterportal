import React from "react";

import { RISK_DETAIL } from "../../services/graphql/queries/riskRegister";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import RiskView from "./RiskView";
import RiskEdit from "./RiskEdit";
import MitigationProfile from "../MitigationPlan/mitigationProfile";
import { withApollo } from "react-apollo";
class RiskProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      riskDetails: {},
      loading: true
    };
  }
  getRiskDetail = () => {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: RISK_DETAIL,
        variables: { id: 6 },
        fetchPolicy: "network-only"
      })
      .then(result => {
        console.log("result", result);
        let data = result.data.getRiskById;
        this.setState({ riskDetails: data, loading: false });
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  changeMode = () => {
    this.setState(prevState => {
      return {
        editMode: !prevState.editMode
      };
    });
  };
  componentDidMount() {
    this.getRiskDetail();
  }
  render() {
    const { riskDetails, editMode, loading } = this.state;

    return (
      <>
        {!editMode && !loading ? (
          <RiskView
            riskDetails={riskDetails}
            changeMode={this.changeMode}
          ></RiskView>
        ) : !loading ? (
          <RiskEdit
            riskDetails={riskDetails}
            changeMode={this.changeMode}
            riskUpdate={this.getRiskDetail}
          ></RiskEdit>
        ) : null}
        {!loading ? (
          <MitigationProfile
            mitigationDetails={riskDetails.mitigationplanSet}
          ></MitigationProfile>
        ) : null}
      </>
    );
  }
}
export default withApollo(RiskProfile);
