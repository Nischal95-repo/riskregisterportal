import React from "react";
import { withApollo } from "react-apollo";
import { format } from "date-fns";
import { dateFormat, dateFormatMonth } from "../../constants/app-constants";
import { AddSvg } from "../../static/images/svg/Add.svg";
class MitigationList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    debugger;
    console.log("mitigation details", this.props.mitigationDetails);
    const { mitigations } = this.props.mitigationDetails;
    return (
      <>
        <div id="mitigationList">
          <div className="row align-items-center">
            <div className="col-md-10">
              <h1 className="heading m-b-0">Mitigation Plans</h1>
            </div>
            <div className="col-md-2">
              <div className="text-right">
                <a
                  className="link-click"
                  href="#"
                  data-placement="bottom"
                  title="Upload"
                  style={{ fontSize: "16px" }}
                  data-toggle="modal"
                  onClick={() => this.props.changeMode()}
                >
                  <img src={AddSvg} />
                  Add
                </a>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-style-1">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Department</th>
                  <th>Responsible</th>
                  <th>Due/Completion Date</th>
                  <th>Forecast Date</th>
                  <th>Status</th>
                  <th>Action(s)</th>
                </tr>
              </thead>
              <tbody>
                {this.props.mitigationDetails &&
                this.props.mitigationDetails.length
                  ? this.props.mitigationDetails.map((data, index) => {
                      return (
                        <tr>
                          <td>{data.id}</td>
                          <td>{data.name}</td>
                          <td></td>
                          <td>
                            {data.responsible ? data.responsible.loginId : ""}
                          </td>
                          <td>{format(data.completionDate, dateFormat)}</td>
                          <td>{format(data.forecastDate, dateFormat)}</td>
                          <td>{data.status ? data.status.name : ""}</td>
                          <td></td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
export default withApollo(MitigationList);
