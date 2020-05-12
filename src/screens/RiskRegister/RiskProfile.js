import React from "react";

import { RISK_DETAIL } from "../../services/graphql/queries/riskRegister";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import RiskView from "./RiskView";
import RiskEdit from "./RiskEdit";
import MitigationProfile from "../MitigationPlan/mitigationProfile";
import Employee from "../RiskRegister/Employees/employee";
import { withApollo } from "react-apollo";
import ReactModal from "../Common/ReactModal";

import { DO_NOT_ACCESS_MESSAGE } from "../../constants/app-constants";

class RiskProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      riskDetails: {},
      loading: true,
      riskId: "",
      reactModalVisible: false,
      requireCancel: false,
      accessSpecifier: {},
    };
  }
  getRiskDetail = () => {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: RISK_DETAIL,
        variables: { id: parseInt(this.state.riskId) },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        console.log("result", result);
        let data = result.data.getRiskById;
        this.setState({ riskDetails: data, loading: false });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  changeMode = () => {
    if (this.state.accessSpecifier[240].editP) {
      this.setState((prevState) => {
        return {
          editMode: !prevState.editMode,
        };
      });
    } else this.setState({ reactModalVisible: true });
  };
  submitModal = () => {
    this.setState({ reactModalVisible: false });
  };
  componentDidMount() {
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

        this.setState(
          { riskId: localStorage.getItem("riskId"), accessSpecifier: response },
          () => {
            this.getRiskDetail();
          }
        );
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
  }
  render() {
    const {
      riskDetails,
      editMode,
      loading,
      riskId,
      reactModalVisible,
      requireCancel,
      accessSpecifier,
    } = this.state;

    return (
      <>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={DO_NOT_ACCESS_MESSAGE}
          requireCancel={requireCancel}
        />
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
            <Employee
              riskId={riskId}
              riskDetails={riskDetails}
              editPermission={accessSpecifier[240].editP}
            ></Employee>
            <MitigationProfile
              mitigationDetails={riskDetails.mitigationplanSet}
              riskId={riskId}
              riskDetails={riskDetails}
              editPermission={accessSpecifier[240].editP}
            ></MitigationProfile>
          </>
        ) : null}
      </>
    );
  }
}
export default withApollo(RiskProfile);
