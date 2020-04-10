import React from "react";
import { format } from "date-fns";

import { dateFormatMonth, dateFormat } from "../../constants/app-constants";

import { getUserStatus } from "../Common/ListOfStatus";

class UserView extends React.Component {
  getDepartmentNames(deptArr) {
    let arr = [];
    deptArr.forEach(element => {
      arr.push(element.description);
    });
    return arr.join(", ");
  }
  render() {
    const {
      name,
      // employeeId,
      emailId,
      mobileNumber,
      designationDetail,
      dateOfJoining,
      reportingManager,
      departmentDetail,
      createdByDetail,
      createdOn,
      modifiedByDetail,
      lastModifiedOn,
      status,
      lockedDetail
    } = this.props.user;
    const statusName = getUserStatus(parseInt(status))[0];
    var deptNames;
    if (departmentDetail && departmentDetail.length) {
      deptNames = this.getDepartmentNames(departmentDetail);
    }

    return (
      <div>
        <h1 className="heading m-b-25">User Details</h1>
        <div className="row">
          <div className="col-md-12">
            {/* Form Section start */}
            <div className="box-card">
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Name<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={name}
                    />
                  </div>
                </div>
                {/* <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Employee Id<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={employeeId}
                    />
                  </div>
                </div> */}
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Email Id for login <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={emailId}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Mobile number<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={mobileNumber}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>User Type</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        lockedDetail && lockedDetail.entityType == 1
                          ? "Ayana Investor "
                          : "Ayana User"
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                {/* <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Designation<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        designationDetail && designationDetail.description
                          ? designationDetail.description
                          : ""
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Date Of Joining<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        dateOfJoining ? format(dateOfJoining, dateFormat) : ""
                      }
                    />
                  </div>
                </div> */}

                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Reporting Manager <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        reportingManager && reportingManager.name
                          ? reportingManager.name
                          : "-"
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>
                      Department<span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={deptNames}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Status</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        statusName && statusName.name ? statusName.name : ""
                      }
                    />
                  </div>
                </div>
                {/* <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>User Type</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        lockedDetail && lockedDetail.entityType == 1
                          ? "Ayana Investor "
                          : "Ayana User"
                      }
                    />
                  </div>
                </div> */}
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Created By</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        createdByDetail && createdByDetail.loginId
                          ? createdByDetail.loginId
                          : ""
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Created On</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        createdOn ? format(createdOn, dateFormatMonth) : ""
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Last Modified By</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        modifiedByDetail && modifiedByDetail.loginId
                          ? modifiedByDetail.loginId
                          : ""
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Last Modified On</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        lastModifiedOn
                          ? format(lastModifiedOn, dateFormatMonth)
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                {/* <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Status</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        statusName && statusName.name ? statusName.name : ""
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>User Type</label>
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext "
                      value={
                        lockedDetail && lockedDetail.entityType == 1
                          ? "Ayana Investor "
                          : "Ayana User"
                      }
                    />
                  </div>
                </div> */}
              </div>
              <div className="row">
                <div className="col-md-5">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      this.props.toggleEditMode();
                    }}
                  >
                    Edit
                  </button>
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

export default UserView;
