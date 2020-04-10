import React from "react";

import { format } from "date-fns";

import { dateFormatMonth } from "../../constants/app-constants";

class DocumentView extends React.Component {
  render() {
    const {
      Id,
      title,
      categoryDetail,
      companyDetail,
      projectDetail,
      createdByDetail,
      createdOn,
      modifiedByDetail,
      lastModifiedOn,
      description,
      comments,
      status,
      statusDetail
    } = this.props.document;
    return (
      <>
        <h1 className="heading m-b-25">Info Details - {Id}</h1>
        {Id ? (
          <div className="row">
            <div className="col-md-12">
              <div className="box-card" style={{ height: "400px" }}>
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label>Title</label>
                      {/* <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={title}
                      /> */}
                      <div className="form-control-plaintext word-break">{title}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label>Category</label>
                      {/* <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={
                          categoryDetail && categoryDetail.description
                            ? categoryDetail.description
                            : ""
                        }
                      /> */}
                      <div className="form-control-plaintext word-break">{
                          categoryDetail && categoryDetail.description
                            ? categoryDetail.description
                            : ""
                        }</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label>Company</label>
                      {/* <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={
                          companyDetail && companyDetail.description
                            ? companyDetail.description
                            : ""
                        }
                      /> */}
                      <div className="form-control-plaintext word-break">{
                          companyDetail && companyDetail.description
                            ? companyDetail.description
                            : ""
                        }</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label>Project</label>
                      {/* <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={
                          projectDetail && projectDetail.description
                            ? projectDetail.description
                            : ""
                        }
                      /> */}
                      <div className="form-control-plaintext word-break">{
                          projectDetail && projectDetail.description
                            ? projectDetail.description
                            : ""
                        }</div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3 col-lg-3">
                    <div className="form-group">
                      <label>Created By </label>
                      {/* <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={
                          createdByDetail && createdByDetail.loginId
                            ? createdByDetail.loginId
                            : ""
                        }
                      /> */}
                      <div className="form-control-plaintext word-break">{
                          createdByDetail && createdByDetail.loginId
                            ? createdByDetail.loginId
                            : ""
                        }</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <div className="form-group">
                      <label>Created On</label>
                      {/* <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={
                          createdOn ? format(createdOn, dateFormatMonth) : ""
                        }
                      /> */}
                      <div className="form-control-plaintext word-break">{
                          createdOn ? format(createdOn, dateFormatMonth) : ""
                        }</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <div className="form-group">
                      <label>Last Modified By</label>
                      {/* <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={
                          modifiedByDetail && modifiedByDetail.loginId
                            ? modifiedByDetail.loginId
                            : ""
                        }
                      /> */}
                      <div className="form-control-plaintext word-break">{
                          modifiedByDetail && modifiedByDetail.loginId
                            ? modifiedByDetail.loginId
                            : ""
                        }</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <div className="form-group">
                      <label>Last Modified On </label>
                      {/* <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={
                          lastModifiedOn
                            ? format(lastModifiedOn, dateFormatMonth)
                            : ""
                        }
                      /> */}
                      <div className="form-control-plaintext word-break">{
                          lastModifiedOn
                            ? format(lastModifiedOn, dateFormatMonth)
                            : ""
                        }</div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <div className="form-group">
                      <label>Description</label>
                      {/* <textarea
                        className="form-control-plaintext text-justify"
                        readOnly
                        value={description}
                      /> */}
                      <div className="form-control-plaintext word-break">{description}</div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-16">
                    <div className="form-group">
                      <label>Status</label>
                      {/* <input
                        type="text"
                        readOnly
                        className="form-control-plaintext"
                        value={
                          statusDetail && statusDetail[0].name
                            ? statusDetail[0].name
                            : ""
                        }
                      /> */}
                      <div className="form-control-plaintext word-break">{
                          statusDetail && statusDetail[0].name
                            ? statusDetail[0].name
                            : ""
                        }</div>
                    </div>
                  </div>
                </div>
                  {/* <div className="row">
                    <div className="col-md-5">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={this.props.toggleEditMode}
                      >
                        Edit
                      </button>
                    </div>
                  </div> */}
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

export default DocumentView;
