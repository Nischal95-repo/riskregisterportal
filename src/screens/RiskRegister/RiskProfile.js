import React from "react";

import { RISK_DETAIL } from "../../services/graphql/queries/riskRegister";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import RiskView from "./RiskView";
import RiskEdit from "./RiskEdit";
import MitigationProfile from "../MitigationPlan/mitigationProfile";
import Employee from "../RiskRegister/Employees/employee";
import { withApollo } from "react-apollo";

class RiskProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      riskDetails: {},
      loading: true,
      riskId: ""
    };
  }
  getRiskDetail = () => {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: RISK_DETAIL,
        variables: { id: parseInt(this.state.riskId) },
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
    this.setState({ riskId: localStorage.getItem("riskId") }, () => {
      this.getRiskDetail();
    });
  }
  render() {
    const { riskDetails, editMode, loading, riskId } = this.state;

    return (
      <>
        {!editMode && !loading ? (
          <RiskView
            riskDetails={riskDetails}
            changeMode={this.changeMode}
            displayEdit={true}
          ></RiskView>
        ) : !loading ? (
          <RiskEdit
            riskDetails={riskDetails}
            changeMode={this.changeMode}
            riskUpdate={this.getRiskDetail}
          ></RiskEdit>
        ) : null}
        {!loading ? (
          <>
            <Employee riskId={riskId}></Employee>
            <MitigationProfile
              mitigationDetails={riskDetails.mitigationplanSet}
              riskId={riskId}
            ></MitigationProfile>
          </>
        ) : null}
      </>
    );
  }
}
export default withApollo(RiskProfile);
