import React from "react";
import { RISK_DETAIL } from "../../services/graphql/queries/riskRegister";
import RiskView from "../RiskRegister/RiskView";
import MitigationPlan from "./MitigationDetail";
import { withApollo } from "react-apollo";

class ApproveMitigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
  componentDidMount() {
    this.setState({ riskId: localStorage.getItem("riskId") }, () => {
      this.getRiskDetail();
    });
  }
  render() {
    const { riskDetails, loading, riskId } = this.state;
    return (
      <>
        {loading ? null : (
          <>
            <RiskView
              riskDetails={riskDetails}
              changeMode={this.changeMode}
              dispalyEdit={false}
            ></RiskView>
            <MitigationPlan></MitigationPlan>
          </>
        )}
      </>
    );
  }
}
export default withApollo(ApproveMitigation);
