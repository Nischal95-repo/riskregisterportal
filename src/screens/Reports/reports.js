import React from "react";

class Reports extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div class="row align-items-center no-gutters">
        <div class="col-md-8">
          <h1 class="heading m-b-0">Reports</h1>
        </div>
        <div className="col-md-12 mt-3">
          <div className="box-card">
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <a
                    className="form-control-plaintext"
                    href="/risk-register-report"
                  >
                    Risk Register
                  </a>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group" />
              </div>
              <div className="col-md-3">
                <div className="form-group" />
              </div>
              <div className="col-md-3">
                <div className="form-group" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
