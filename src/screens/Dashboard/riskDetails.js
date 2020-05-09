import React from "react";
import {
  RISK_DETAILSK,
  RISK_DETAILS,
} from "../../services/graphql/queries/dashboard";
import { withApollo } from "react-apollo";
class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  getRiskDetails = () => {
    this.props.client
      .query({
        query: RISK_DETAILS,
        fetchPolicy: "network-only",
      })
      .then((result) => {
        console.log("result", result.data.getRiskDetailByUserId);
        let data = result.data.getRiskDetailByUserId;
        this.setState({ data: data });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  componentDidMount() {
    this.getRiskDetails();
  }
  render() {
    const { data } = this.state;
    return (
      <>
        <h1 className="heading mb-3">Risk Register - Dashboard</h1>
        <div className="row">
          <div className="col-md-3">
            {/* <div class="widget red-gradient"> */}
            <div className="widget " style={{ backgroundColor: "#17a2b8" }}>
              <div className="row  align-items-center">
                <div className="col">
                  <div className="counter-label">Total</div>
                  <div className="counter-no">
                    {data && data.total ? data.total : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            {/* <div class="widget cracyn-gradient"> */}
            <div className="widget " style={{ backgroundColor: "#6c757d" }}>
              <div className="row  align-items-center">
                <div className="col">
                  <div className="counter-label">Closed</div>
                  <div className="counter-no">
                    {data && data.closed ? data.closed : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            {/* <div class="widget black-gradient"> */}
            <div className="widget " style={{ backgroundColor: "#f3ad06" }}>
              <div className="row  align-items-center">
                <div className="col">
                  <div className="counter-label">Pending</div>
                  <div className="counter-no">
                    {data && data.pending ? data.pending : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            {/* <div class="widget purple-gradient"> */}
            <div className="widget " style={{ backgroundColor: "#343a40" }}>
              <div className="row  align-items-center">
                <div className="col">
                  <div className="counter-label">Deviated</div>
                  <div className="counter-no">
                    {data && data.deviated ? data.deviated : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withApollo(Cards);
