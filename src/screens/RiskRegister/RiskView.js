import React from "react";
import { withApollo } from "react-apollo";
import { format } from "date-fns";
import { dateFormat, dateFormatMonth } from "../../constants/app-constants";
class RiskView extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      id,
      name,
      categoryId,
      projectId,
      companyId,
      impact,
      probability,
      severity,
      description,
      createdBy,
      createdOn,
      lastModifiedBy,
      lastModifiedOn,
      status
    } = this.props.riskDetails;
    console.log("test details");

    return (
      <>
        <h1 className="heading m-b-25">Risk Details</h1>
        <div className="row">
          <div className="col-md-12">
            {/* Form Section start */}
            <div className="box-card">
              <div className="row">
                <div className="col-md-4 col-lg-3">
                  <div className="form-group">
                    <label>Risk</label>
                    <input
                      type="text"
                      className="form-control-plaintext"
                      value={name}
                    />
                  </div>
                </div>
                <div className="col-md-4 col-lg-3">
                  <div className="form-group">
                    <label>Risk Category</label>

                    <div className="form-control-plaintext word-break">
                      {categoryId ? categoryId.description : ""}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-lg-3">
                  <div className="form-group">
                    <label>Company</label>

                    <div className="form-control-plaintext word-break">
                      {companyId ? companyId.description : ""}
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Project</label>

                    <div className="form-control-plaintext word-break">
                      {projectId ? projectId.description : ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Impact</label>
                    <div className="form-control-plaintext word-break">
                      {impact}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Probability</label>
                    <div className="form-control-plaintext word-break">
                      {probability}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Severity</label>
                    <div className="form-control-plaintext word-break">
                      {severity}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Status</label>
                    <div className="form-control-plaintext word-break">
                      {status == 2 ? "Open" : "Closed"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <div className="form-group">
                    <label>Impact/Description</label>
                    <div className="form-control-plaintext word-break">
                      {description}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6">
                  <div className="form-group">
                    <label>Attachments</label>
                    <ol className="attachment-list">
                      <li>
                        file1.pdf <img src="../images/close.svg" />
                      </li>
                      <li>
                        file2.pdf
                        <img src="../images/close.svg" />
                      </li>
                      <li>
                        file3.pdf <img src="../images/close.svg" />
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Created By</label>
                    <div className="form-control-plaintext word-break">
                      {createdBy ? createdBy.loginId : ""}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Created On</label>
                    <div className="form-control-plaintext word-break">
                      {createdOn ? format(createdOn, dateFormatMonth) : ""}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Last Modified By</label>
                    <div className="form-control-plaintext word-break">
                      {lastModifiedBy ? lastModifiedBy.loginId : ""}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Last Modified On</label>
                    <div className="form-control-plaintext word-break">
                      {lastModifiedOn
                        ? format(lastModifiedOn, dateFormatMonth)
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-8">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      this.props.changeMode();
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Form Section End */}
        </div>
      </>
    );
  }
}

export default withApollo(RiskView);
