import React from "react";
import { withApollo } from "react-apollo";

class MitigationAdd extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div id="mitigationAdd">
          <div className="row align-items-center">
            <div className="col-md-10">
              <h1 className="heading m-b-0">Mitigation Plan Creation</h1>
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
                  onclick={() => {
                    this.props.changeMode();
                  }}
                >
                  <img src="../images/close.svg" />
                  Close
                </a>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-3 col-lg-3">
              <div className="form-group">
                <label>
                  Description <span style={{ color: "red" }}>*</span>
                </label>
                <textarea
                  placeholder="Enter description"
                  className="form-control"
                  id
                  cols={30}
                  rows={10}
                  defaultValue={""}
                />
              </div>
            </div>
            <div className="col-md-3 col-lg-3">
              <div className="form-group">
                <label>
                  Department<span style={{ color: "red" }}>*</span>
                </label>
                <select className="form-control select-style-1">
                  <option>Select User</option>
                  <option>Finance</option>
                  <option>IT</option>
                  <option>Others</option>
                </select>
              </div>
            </div>
            <div className="col-md-3 col-lg-3">
              <div className="form-group">
                <label>
                  Responsible<span style={{ color: "red" }}>*</span>
                </label>
                <select className="form-control select-style-1">
                  <option>Select User</option>
                  <option>Raj</option>
                  <option>Ram</option>
                  <option>Rsvi</option>
                </select>
              </div>
            </div>
            <div className="col-md-3 col-lg-3">
              <div className="form-group">
                <label>
                  Due/Completion Date<span style={{ color: "red" }}>*</span>
                </label>
                <input className="form-control" type="date" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-12 ">
              <div className="row" style={{ paddingLeft: "10px" }}>
                <label />
                <div className="upload-btn-wrapper mt-3">
                  <button className="btn btn-light">Upload Attachment</button>
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
                onclick="toggleList()"
              >
                Submit
              </button>
              <button type="button" className="btn btn-light m-l-50">
                Clear
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withApollo(MitigationAdd);
