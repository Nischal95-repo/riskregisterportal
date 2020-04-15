import React from "react";
import { withApollo } from "react-apollo";
import { format } from "date-fns";
// import {
//   getListofGenericMasterQuery,
//   ALL_EMPLOYEE_LIST
// } from "../../services/graphql/queries/user";
import {
  GET_MITIGATION_PLAN_BY_ID,
  CREATE_MITIGATION_ATTACHMENT,
  DELETE_MITIGATION_ATTACHMENT,
  DOWNLOAD_MITIGATION_ATTACHMENT,
  MITIGATION_ATTACHMENTS,
} from "../../services/graphql/queries/riskRegister";

import ButtonComponent from "../Common/form-component/ButtonComponent";
import TextAreaComponent from "../Common/form-component/TextAreComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import { compareValues } from "../Common/customSort";
import CloseSvg from "../../static/images/svg/Close.svg";
import Select from "react-select";
import InputComponent from "../Common/form-component/InputComponent";
import ReactModal from "../Common/ReactModal";
import {
  SET_TIMEOUT_VALUE,
  dateFormatMonth,
  dateFormat,
  MAX_DOC_UPLOAD_SIZE,
} from "../../constants/app-constants";
import { errorMessage } from "../../miscellaneous/error-messages";
const FileSaver = require("file-saver");
const mime = require("mime-types");
class MitigationView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mitigationDetails: {},
      mitigationplanId: "",
      loading: false,
      error: "",
      attachmentDetail: {},
      attachmentlist: [],
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: "",
    };
  }
  getMitigationDetails = () => {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: GET_MITIGATION_PLAN_BY_ID,
        variables: { id: parseInt(this.state.mitigationplanId) },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        console.log("result", result);
        let data = result.data.getMitigationPlanById;
        this.setState({ mitigationDetails: data, loading: false });
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  isAcceptedFile(file) {
    let fileName = file.name;
    if (
      fileName.includes(".xlsx") ||
      fileName.includes(".xls") ||
      fileName.includes(".doc") ||
      fileName.includes(".docx") ||
      fileName.includes(".ppt") ||
      fileName.includes(".pptx") ||
      fileName.includes(".pdf") ||
      fileName.includes(".XLSX") ||
      fileName.includes(".XLS") ||
      fileName.includes(".DOC") ||
      fileName.includes(".DOCX") ||
      fileName.includes(".PPT") ||
      fileName.includes(".PPTX") ||
      fileName.includes(".PDF")
    ) {
      return true;
    } else {
      this.setState({
        errors: [
          "Please upload only these file types .xlsx, .xls, .doc, .docx, .ppt, .pptx, .pdf",
        ],
      });
      this.timer = setTimeout(() => {
        this.setState({ errors: [] });
      }, SET_TIMEOUT_VALUE);
      return false;
    }
  }

  validateSize = (file) => {
    var FileSize = file.size / 1024; // in KB
    console.log("img size", FileSize, file.size);
    if (FileSize > MAX_DOC_UPLOAD_SIZE * 1024) {
      this.setState({
        errors: ["Max file upload size is " + MAX_DOC_UPLOAD_SIZE + " MB"],
      });
      setTimeout(() => {
        this.setState({ errors: [] });
      }, SET_TIMEOUT_VALUE);
      return false;
    } else {
      return true;
    }
  };

  uploadFile(fileData, fileName, fileType) {
    // console.log("filenaM",fileName)
    var imgName = fileName;
    var imgData = fileData;
    var imgType = fileType;
    let attachmentDetail = {
      fileData: imgData,
      fileName: imgName,
      fileType: imgType,
    };
    this.setState(
      (prev) => {
        return {
          attachmentDetail: {
            ...prev.attachmentDetail,
            fileData: imgData,
            fileName: imgName,
            fileType: imgType,
          },
        };
      },
      () => {
        console.log("fileData", this.state.attachmentDetail);
        this.uploadFileApollo();
      }
    );
  }

  uploadFileApollo() {
    this.setState({ loading: true });
    this.props.client
      .mutate({
        mutation: CREATE_MITIGATION_ATTACHMENT,
        variables: {
          mitigationPlanId: this.state.mitigationDetails.id,
          data: [this.state.attachmentDetail],
        },
      })
      .then((result) => {
        // alert("Document Created successfully");
        this.setState({
          loading: false,
          reactModalVisible: true,
          modalMessage: "Attachment Added Successfully",
        });
        this.getListOfAttachments();
      })
      .catch((error) => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, errors: [errorMessage(error)] });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  }

  convertFileToBase64(file, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      callback(null, reader.result, file);
    };

    reader.onerror = function(error) {
      callback(error);
    };
  }
  getListOfAttachments() {
    this.props.client
      .query({
        query: MITIGATION_ATTACHMENTS,
        variables: {
          mitigationPlanId: this.state.mitigationplanId,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var attachmentlist = result.data.getListOfAttachmentsByMitigationPlanId;
        this.setState({ attachmentlist: attachmentlist });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  }
  deleteAttachment = (id) => {
    this.props.client
      .mutate({
        mutation: DELETE_MITIGATION_ATTACHMENT,
        variables: { attachmentId: id },
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        console.log("result", result);
        this.getListOfAttachments();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  submitModal = () => {
    this.setState({ reactModalVisible: false }, () => {
      this.getListOfAttachments();
    });
    // this.props.onUpdateUser();
  };
  componentDidMount() {
    this.setState(
      { mitigationplanId: parseInt(this.props.mitigationPlanId) },
      () => {
        this.getMitigationDetails();
        this.getListOfAttachments();
      }
    );
  }
  render() {
    const {
      mitigationDetails,
      attachmentlist,
      reactModalVisible,
      requireCancel,
      modalMessage,
    } = this.state;
    return (
      <>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
        />
        <div
          className="row align-items-center "
          style={{ marginBottom: "10px" }}
        >
          <div className="col-md-10">
            <h1 className="heading m-b-0">
              Mitigation Plan Details -{mitigationDetails.id}
            </h1>
          </div>
          <div className="col-md-2">
            <div className="text-right">
              <a
                className="link-click"
                href="#"
                data-placement="bottom"
                title="Add"
                onClick={() => this.props.toggleMode()}
              >
                <img src={CloseSvg} />
                &nbsp; Close
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-lg-3">
            <div className="form-group">
              <label>Mitigation Plan </label>

              <div className="form-control-plaintext word-break">
                {mitigationDetails.name}
              </div>
            </div>
          </div>
          <div className="col-md-3 col-lg-3">
            <div className="form-group">
              <label>Responsible</label>
              <div className="form-control-plaintext word-break">
                {mitigationDetails.responsible
                  ? mitigationDetails.responsible.loginId
                  : ""}
              </div>
            </div>
          </div>
          <div className="col-md-3 col-lg-3">
            <div className="form-group">
              <label>Due/Completion Date</label>
              <div className="form-control-plaintext word-break">
                {format(mitigationDetails.completionDate, dateFormat)}
              </div>
            </div>
          </div>
          <div className="col-md-3 col-lg-3">
            <div className="form-group">
              <label>Forecast Date</label>
              <div className="form-control-plaintext word-break">
                {format(mitigationDetails.forecastDate, dateFormat)}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-3">
            <div className="form-group">
              <label>Created By</label>
              <div className="form-control-plaintext word-break">
                {mitigationDetails.createdBy
                  ? mitigationDetails.createdBy.loginId
                  : ""}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="form-group">
              <label>Created On</label>
              <div className="form-control-plaintext word-break">
                {format(mitigationDetails.createdOn, dateFormatMonth)}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="form-group">
              <label>Last Modified By</label>
              <div className="form-control-plaintext word-break">
                {mitigationDetails.lastModifiedBy
                  ? mitigationDetails.lastModifiedBy.loginId
                  : ""}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="form-group">
              <label>Last Modified On</label>
              <div className="form-control-plaintext word-break">
                {format(mitigationDetails.lastModifiedOn, dateFormatMonth)}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-lg-3">
            <div className="form-group">
              <label>Approved By</label>
              <div className="form-control-plaintext word-break">
                {mitigationDetails.createdBy
                  ? mitigationDetails.createdBy.loginId
                  : ""}
              </div>
            </div>
          </div>
          <div className="col-md-3 col-lg-3">
            <div className="form-group">
              <label>Approved On</label>
              <div className="form-control-plaintext word-break">
                {format(mitigationDetails.lastModifiedOn, dateFormatMonth)}
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-6 ">
            <div className="row" style={{ paddingLeft: "10px" }}>
              <label />
              <div className="upload-btn-wrapper" style={{ marginTop: "" }}>
                <button
                  className="btn btn-light"
                  onClick={() => {
                    this.state.fileinput.click();
                  }}
                >
                  Upload Attachment
                  {/* <input type="file" name="myfile" /> */}
                  <input
                    type="file"
                    id="uploadAttachments"
                    hidden
                    name="attachments"
                    // accept="image/gif,image/jpeg,image/png"
                    accept=".xlsx, .xls, .doc, .docx, .ppt, .pptx, .pdf"
                    ref={(fileinput) => {
                      this.state.fileinput = fileinput;
                    }}
                    onChange={(e) => {
                      if (this.isAcceptedFile(e.target.files[0])) {
                        if (this.validateSize(e.target.files[0])) {
                          this.convertFileToBase64(
                            e.target.files[0],
                            (err, fileData, file) => {
                              if (err) {
                                console.log(err);
                              }
                              this.setState(
                                {
                                  uploading: true,
                                },
                                () => {
                                  this.uploadFile(
                                    fileData,
                                    file.name,
                                    file.type
                                  );
                                }
                              );
                            }
                          );
                        }
                      }
                    }}
                  />
                </button>
              </div>
            </div>
            <label className="mt-2">Attachment List</label>
            <div className="row attachment-list">
              <ol>
                {attachmentlist && attachmentlist.length
                  ? attachmentlist.map((data, index) => {
                      return (
                        <li
                          title={decodeURI(
                            data.url
                              .substring(data.url.lastIndexOf("/") + 1)
                              .substr(32)
                          )}
                        >
                          {decodeURI(
                            data.url
                              .substring(data.url.lastIndexOf("/") + 1)
                              .substr(32)
                          ).substring(0, 30)}
                          <img
                            src={CloseSvg}
                            title="Delete"
                            onClick={() => this.deleteAttachment(data.id)}
                          />
                        </li>
                      );
                    })
                  : null}
              </ol>
            </div>
          </div>
        </div>
        {/* <div className="row">
            <div className="col-md-12 col-lg-8">
              <ButtonComponent
                className="btn-danger"
                type="button"
                title="Approve"
                onClick={() => {
                  // this.validator.hideMessages();
                  this.submitMitigationActivity();
                }}
              ></ButtonComponent>

              <ButtonComponent
                className="btn-light  ml-3"
                type="button"
                title="Reassign"
                onClick={() => {
                  this.clear();
                }}
              ></ButtonComponent>
            </div>
          </div> */}
      </>
    );
  }
}
export default withApollo(MitigationView);
