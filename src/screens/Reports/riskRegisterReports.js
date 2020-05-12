import React from "react";
import RiskRegister from "../RiskRegister/RiskRegister";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import NotAccessible from "../Common/NotAccessible";
import { withApollo } from "react-apollo";
class RiskRegisterReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessSpecifier: {},
      loading: true,
    };
  }

  accessPermission = () => {
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
          accessSpecifier: response[241],
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          error: error.message,
        });
      });
  };

  componentDidMount() {
    this.accessPermission();
  }
  render() {
    const { loading, accessSpecifier } = this.state;
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <>
        {accessSpecifier && accessSpecifier.viewP ? (
          <RiskRegister isReports={true}></RiskRegister>
        ) : (
          <NotAccessible />
        )}
      </>
    );
  }
}

export default withApollo(RiskRegisterReport);
