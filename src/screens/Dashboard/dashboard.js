import React from "react";
import RiskCards from "./riskDetails";
import PieChart from "./pieChart";
import ColumnChart from "./columnChart";
import { RISK_DETAILS_FOR_CHARTS } from "../../services/graphql/queries/dashboard";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";
import PieCharts from "./pieChart";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: {},
      companies: {},
      projects: {},
      departments: {},
      loading: true,
      records: 0,
    };
  }
  getRiskDetails = () => {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: RISK_DETAILS_FOR_CHARTS,
        fetchPolicy: "network-only",
      })
      .then((result) => {
        console.log("result", result.data.getRiskDetailByUserId);
        let data = result.data;
        this.setState(
          {
            projects: JSON.parse(data.getRisksByProjects),
            categories: JSON.parse(data.getRisksByCategories),
            companies: JSON.parse(data.getRisksByCompanies),
            departments: JSON.parse(data.getRisksByDepartments),
            loading: false,
            records: JSON.parse(data.getRisksByCategories).records,
            loading: false,
          },
          () => {
            console.log("piechart");
            if (this.state.records == 0) {
              this.props.history.push("/home");
            }
            PieCharts(this.state.categories, "right", "category");
            PieCharts(this.state.companies, "right", "company");
            PieCharts(this.state.projects, "right", "project");
            ColumnChart(this.state.departments, "right", "department");
          }
        );
      })

      .catch((error) => {
        console.log("error", error);
      });
  };
  componentDidMount() {
    this.getRiskDetails();
  }
  render() {
    const {
      categories,
      companies,
      projects,
      departments,
      loading,
      records,
    } = this.state;
    return (
      <>
        <RiskCards></RiskCards>
        <div>
          <div className="row">
            <div className="col-md-12 col-lg-6">
              <div className="inner-box" style={{ minHeight: "300px" }}>
                <h4>Risk By Category</h4>
                {/* <PieChart
                  data={categories}
                  legendPos={"right"}
                  maxWidth={100}
                ></PieChart> */}
                {!this.state.loading ? (
                  <canvas
                    style={{ width: "100%", height: "40vh" }}
                    id="category"
                  />
                ) : null}
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <div className="inner-box" style={{ minHeight: "300px" }}>
                <h4>Risk By Project</h4>
                {/* <PieChart
                  data={projects}
                  legendPos={"bottom"}
                  maxWidth={100}
                ></PieChart> */}
                {!this.state.loading ? (
                  <>
                    <canvas
                      style={{ width: "100%", height: "40vh" }}
                      id="project"
                    />
                    <div id="chart-legends"></div>
                    {/* <div className="pie">
                      <div class="float-left col-md-12">
                        <div class="float-left col-md-8">
                          <canvas
                            id="project"
                            style={{ width: "100%", height: "40vh" }}
                          ></canvas>
                        </div>
                        <div class="float-left col-md-4">
                          <div id="js-legend" class="chart-legend"></div>
                        </div>
                      </div>
                    </div> */}
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className="row">
            {/* <div class="col-md-3 col-lg-3"></div> */}
            <div className="col-md-12 col-lg-12">
              <div className="inner-box" style={{ minHeight: "300px" }}>
                <h4>Risk By Company</h4>
                {/* <PieChart
                  data={companies}
                  legendPos={"bottom"}
                  maxWidth={100}
                ></PieChart> */}
                {!this.state.loading ? (
                  <canvas
                    style={{ width: "100%", height: "45vh" }}
                    id="company"
                  />
                ) : null}
              </div>
            </div>
            {/* <div class="col-md-3 col-lg-3"></div> */}
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <div className="inner-box" style={{ minHeight: "300px" }}>
                <h4>Risk By Department</h4>
                {/* <ColumnChart
                  data={departments}
                  legendPos={"bottom"}
                  maxWidth={100}
                ></ColumnChart> */}
                {!this.state.loading ? (
                  <canvas
                    style={{ width: "100%", height: "50vh" }}
                    id="department"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(withApollo(Dashboard));
