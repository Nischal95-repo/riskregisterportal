import React from "react";

class AddRiskRegister extends React.Component {
  render() {
    return (
      <div>
        <h1 className="heading m-b-25">Risk Creation</h1>
        <div className="row">
          <div className="col-md-12">
            {/* Form Section start */}
            <div className="box-card">
              <div className="row">
                <div className="col-md-4 col-lg-3">
                  <div className="form-group">
                    <label>
                      Risk <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Name"
                    />
                  </div>
                </div>
                <div className="col-md-4 col-lg-3">
                  <div className="form-group">
                    <label>
                      Risk Category<span style={{ color: "red" }}>*</span>
                    </label>
                    <select className="form-control select-style-1">
                      <option>Select Risk Category</option>
                      <option>General</option>
                      <option>Permits &amp; Approval</option>
                      <option>Procurement</option>
                      <option>Construction</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Company<span style={{ color: "red" }}>*</span>
                    </label>
                    <select className="form-control select-style-1">
                      <option>Select Company</option>
                      <option>Ayana Ananthapurama Pvt Ltd</option>
                      <option>Ayana Renewable Power Pvt Ltd</option>
                      <option>Ayana Renewable Power One Pvt Ltd</option>
                      <option>Ayana Renewable Power Two Pvt Ltd</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Project<span style={{ color: "red" }}>*</span>
                    </label>
                    <select className="form-control select-style-1">
                      <option>Select Project</option>
                      <option>NTPC</option>
                      <option>MRV</option>
                      <option>SECI Kadapa</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Impact<span style={{ color: "red" }}>*</span>
                    </label>
                    <select className="form-control select-style-1">
                      <option>Select </option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Probability<span style={{ color: "red" }}>*</span>
                    </label>
                    <select className="form-control select-style-1">
                      <option>Select </option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Severity<span style={{ color: "red" }}>*</span>
                    </label>
                    <input type="text" className="form-control" readOnly />
                  </div>
                </div>
                {/* <div class="col-md-6 col-lg-3 ">
          <label></label>
          <div class="upload-btn-wrapper mt-3">
            <button class="btn btn-light">
              Upload Attachment
            </button>
            <input type="file" name="myfile" />
          </div>
        </div> */}
              </div>
              <div className="row">
                <div className="col-md-4 col-lg-6">
                  <div className="form-group">
                    <label>
                      Impact/Description<span style={{ color: "red" }}>*</span>
                    </label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Description"
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 ">
                  <div className="row" style={{ paddingLeft: "10px" }}>
                    <label />
                    <div
                      className="upload-btn-wrapper"
                      style={{ marginTop: "25px" }}
                    >
                      <button className="btn btn-light">
                        Upload Attachment
                      </button>
                      <input type="file" name="myfile" />
                    </div>
                  </div>
                  <label className="mt-2">Attachment List</label>
                  <div className="row attachment-list">
                    <ol>
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
                <div className="col-md-12 col-lg-8">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onclick="myFunction()"
                  >
                    Submit
                  </button>
                  <button type="button" className="btn btn-clear m-l-50">
                    Clear
                  </button>
                  {/* <button class="btn btn-light m-l-50">
            Upload Attachment
          </button> */}
                </div>
              </div>
            </div>
            {/* Form Section End */}
          </div>
        </div>
      </div>
    );
  }
}

export default AddRiskRegister;
