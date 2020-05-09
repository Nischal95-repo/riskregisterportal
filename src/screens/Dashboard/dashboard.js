import React from "react";
import RiskCards from "./riskDetails";
import PieChart from "./pieChart";
import ColumnChart from "./columnChart";
import { RISK_DETAILS_FOR_CHARTS } from "../../services/graphql/queries/dashboard";
import { withApollo } from "react-apollo";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: {},
      companies: {},
      projects: {},
      departments: {},
    };
  }
  getRiskDetails = () => {
    this.props.client
      .query({
        query: RISK_DETAILS_FOR_CHARTS,
        fetchPolicy: "network-only",
      })
      .then((result) => {
        console.log("result", result.data.getRiskDetailByUserId);
        let data = result.data;
        this.setState({
          projects: JSON.parse(data.getRisksByProjects),
          categories: JSON.parse(data.getRisksByCategories),
          companies: JSON.parse(data.getRisksByCompanies),
          departments: JSON.parse(data.getRisksByDepartments),
        });
      })

      .catch((error) => {
        console.log("error", error);
      });
  };
  componentDidMount() {
    this.getRiskDetails();
  }
  render() {
    const { categories, companies, projects, departments } = this.state;
    return (
      <>
        <RiskCards></RiskCards>
        <div>
          <div className="row">
            <div className="col-md-6 col-lg-6">
              <div className="inner-box" style={{ minHeight: "300px" }}>
                <h4>Risk By Category</h4>
                <PieChart
                  data={categories}
                  legendPos={"right"}
                  maxWidth={100}
                ></PieChart>
              </div>
            </div>
            <div className="col-md-6 col-lg-6">
              <div className="inner-box">
                <h4>Risk By Company</h4>
                <PieChart
                  data={companies}
                  legendPos={"right"}
                  maxWidth={100}
                ></PieChart>
              </div>
            </div>
          </div>
          <div className="row">
            {/* <div class="col-md-3 col-lg-3"></div> */}
            <div className="col-md-12 col-lg-6">
              <div className="inner-box" style={{ minHeight: "300px" }}>
                <h4>Risk By Project</h4>
                <PieChart
                  data={projects}
                  legendPos={"bottom"}
                  maxWidth={100}
                ></PieChart>
              </div>
            </div>
            {/* <div class="col-md-3 col-lg-3"></div> */}
            {/* </div>
          <div className="row"> */}
            <div className="col-md-12 col-lg-6">
              <div className="inner-box" style={{ minHeight: "300px" }}>
                <h4>Risk By Department</h4>
                <ColumnChart
                  data={departments}
                  legendPos={"bottom"}
                  maxWidth={100}
                ></ColumnChart>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withApollo(Dashboard);
