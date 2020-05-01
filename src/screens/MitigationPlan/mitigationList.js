import React from "react";
import { withApollo } from "react-apollo";
import { format } from "date-fns";
import { dateFormat, dateFormatMonth } from "../../constants/app-constants";
import AddSvg from "../../static/images/svg/Add.svg";
import ModifySvg from "../../static/images/svg/Modify.svg";
import ApproveSvg from "../../static/images/svg/approve.svg";
import MitigationActivity from "./mitigationActivity";
import { withRouter } from "react-router-dom";
import MitigationView from "./mitigationView";
class MitigationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      mitigationPlanId: "",
      mitigationView: false,
      canEditMitigationActivity: false,
    };
  }
  toggleMode = (data) => {
    this.setState((prevState) => {
      return { visible: !prevState.visible, canEditMitigationActivity: data };
    });
  };
  viewToggle = () => {
    this.setState((prevState) => {
      return { mitigationView: !prevState.mitigationView };
    });
  };
  render() {
    console.log("mitigation details", this.props.mitigationDetails);
    const {
      visible,
      mitigationPlanId,
      mitigationView,
      canEditMitigationActivity,
    } = this.state;
    return (
      <>
        {visible ? (
          <MitigationActivity
            visible={visible}
            toggleMode={this.toggleMode}
            mitigationPlanId={mitigationPlanId}
            updateList={this.props.updateList}
            mitigationDetails={this.props.mitigationDetails}
            canEditMitigationActivity={canEditMitigationActivity}
          ></MitigationActivity>
        ) : null}
        {mitigationView ? (
          <MitigationView
            toggleMode={this.viewToggle}
            mitigationPlanId={mitigationPlanId}

            updateList={this.props.updateList}
          ></MitigationView>
        ) : (
          <div id="mitigationList">
            <div className="row align-items-center">
              <div className="col-md-10">
                <h1 className="heading m-b-0">Mitigation Plans</h1>
              </div>
              <div className="col-md-2">
                <div className="text-right">
                  {this.props.riskDetails &&
                  this.props.riskDetails.canEdit &&
                  this.props.riskDetails.canEdit.canEdit ? (
                    <a
                      className="link-click"
                      href="#"
                      data-placement="bottom"
                      title="Add"
                      onClick={() => this.props.changeMode()}
                    >
                      <img src={AddSvg} />
                      &nbsp; Add
                    </a>
                  ) : null}
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
                            <td
                              onClick={() => {
                                this.setState(
                                  { mitigationPlanId: data.id },
                                  () => {
                                    this.viewToggle();
                                  }
                                );
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {data.id}
                            </td>
                            <td>{data.name}</td>
                            <td>
                              {data.departmentId
                                ? data.departmentId.description
                                : ""}
                            </td>
                            <td>
                              {data.responsible ? data.responsible.loginId : ""}
                            </td>
                            <td>{format(data.completionDate, dateFormat)}</td>
                            <td>{format(data.forecastDate, dateFormat)}</td>
                            <td>{data.status ? data.status.name : ""}</td>
                            <td>
                              {data.canEdit &&
                              data.canEdit.canApprove &&
                              data.status &&
                              (data.status.statusId == 1 ||
                                data.status.statusId == 3) ? (
                                <a
                                  className="link-click ml-3"
                                  href="#"
                                  data-placement="bottom"
                                  title="  Approve"
                                  onClick={() => {
                                    this.setState(
                                      { mitigationPlanId: parseInt(data.id) },
                                      () => {
                                        localStorage.setItem(
                                          "mitigationPlanId",
                                          data.id
                                        );
                                        this.props.history.push(
                                          "/approve-mitigation"
                                        );
                                      }
                                    );
                                  }}
                                >
                                  <img src={ApproveSvg} />
                                </a>
                              ) : null}
                              <a
                                className="link-click ml-3"
                                href="#"
                                data-placement="bottom"
                                title="  Mitigation Activity"
                                onClick={() => {
                                  this.setState(
                                    { mitigationPlanId: parseInt(data.id) },
                                    () => {
                                      this.toggleMode(
                                        data.canEdit.canEditMitigationActivity
                                      );
                                    }
                                  );
                                }}
                              >
                                <img src={ModifySvg} />
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
  }
}
export default withRouter(withApollo(MitigationList));
