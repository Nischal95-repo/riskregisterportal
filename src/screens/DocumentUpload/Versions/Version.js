import React from "react";

import Modal from "react-awesome-modal";
import SimpleReactValidator from "simple-react-validator";
import { format, isWithinRange } from "date-fns";

import ReactModal from "../../Common/ReactModal";
import DisplayErrors from "../../Common/DisplayErrors";
import InputComponent from "../../Common/form-component/InputComponent";
import SelectComponent from "../../Common/form-component/SelectComponent";
import { getDocumentVersionStatus } from "../../Common/ListOfStatus";

import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";
import {
  updateVersionQuery,
  changeDocumentStatusQuery,
  getListOfAttachmentsQuery,
  createAttachmentQuery,
  deleteAttachmentQuery,
  downloadAttachmentQuery,
  reviewCompletedQuery,
  getAttachmentReviewDetail,
  updateMsgRead,
  updateIsDownloadable,
  getVersionReviewDetail
} from "../../../services/graphql/queries/document-upload";

import {
  SET_TIMEOUT_VALUE,
  dateInputFormat,
  dateFormatMonth,
  MAX_DOC_UPLOAD_SIZE
} from "../../../constants/app-constants";

import { errorMessage } from "../../../miscellaneous/error-messages";

import popupLogo from "../../../static/images/popup-logo.png";
import preview from "../../../static/images/preview.png";
import TextAreComponent from "../../Common/form-component/TextAreComponent";
import ButtonComponent from "../../Common/form-component/ButtonComponent";
import TaskReport from "../../Reports/taskReport";

const FileSaver = require("file-saver");
const mime = require("mime-types");

class Version extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errors: [],
      document: props.document,
      version: props.version,
      newVersionNo: props.versionLength + 1,
      versionReviewMinStartDate: "",
      versionReviewMaxStartDate: "",
      versionReviewMinEndDate: "",
      versionReviewMaxEndDate: "",
      reviewStartDate: "",
      reviewEndDate: "",
      attachmentDetail: {
        fileData: "",
        fileName: "",
        fileType: ""
      },
      versionDetail: {
        versionNo: "",
        reviewStartDate: "",
        reviewEndDate: "",
        status: ""
      },
      attachments: [],
      tempAttachmentsArr: [],
      fileinput: null,
      deleteId: "",
      createModalVisible: false,
      reviewCompletedModalVisible: false,
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: "",
      seekAdditionalInfoModalVisible: false,
      attachmentId: "",
      seekAditionalInfoArray: [],
      reviewerDetailModalVisible: false,
      reviewerDetails: [],
      isDownloadReactModalVisible: false,
      isDownload: {},
      isCommentAble: false,
      versionCompleted: false,
      displayReport: false
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: message => <div style={{ color: "red" }}>{message}</div>
    });
    this.handleInput = this.handleInput.bind(this);
    this.submitModal = this.submitModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateIsDownloadable = this.updateIsDownloadable.bind(this);
    this.isDownloadCloseModal = this.isDownloadCloseModal.bind(this);
  }

  submitModal() {
    if (!this.state.deleteId)
      this.setState({ reactModalVisible: false, modalMessage: "" });
    else {
      this.setState({
        reactModalVisible: false,
        modalMessage: "",
        requireCancel: false
      });
      this.props.client
        .mutate({
          mutation: deleteAttachmentQuery,
          variables: {
            attachmentId: this.state.deleteId,
            versionNo: this.state.versionDetail.versionNo
          },
          fetchPolicy: "no-cache"
        })
        .then(result => {
          // alert("Deleted successfully");
          this.setState({ deleteId: "" });
          this.getListOfAttachments();
        })
        .catch(error => {
          console.log("~~~error: ", error);
          this.setState({ loading: false, errors: [errorMessage(error)] });
          this.timer = setTimeout(() => {
            this.setState({ errors: [] });
          }, SET_TIMEOUT_VALUE);
        });
    }
  }

  closeModal() {
    this.setState({
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: "",
      deleteId: ""
    });
  }

  onReviewCompletedModalVisible() {
    this.setState({ reviewCompletedModalVisible: false });
  }

  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => {
      return {
        versionDetail: {
          ...prevState.versionDetail,
          [name]: value
        }
      };
    });
    if (name == "reviewStartDate") {
      //   this.state.versionDetail.reviewEndDate = ''
      this.setState({
        versionReviewMinEndDate: format(value, dateInputFormat)
      });
    }
  }

  onCreateModalVisible() {
    this.setState({ createModalVisible: !this.state.createModalVisible });
  }

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
          "Please upload only these file types .xlsx, .xls, .doc, .docx, .ppt, .pptx, .pdf"
        ]
      });
      this.timer = setTimeout(() => {
        this.setState({ errors: [] });
      }, SET_TIMEOUT_VALUE);
      return false;
    }
  }

  validateSize = file => {
    var FileSize = file.size / 1024; // in KB
    console.log("img size", FileSize, file.size);
    if (FileSize > (MAX_DOC_UPLOAD_SIZE * 1024)) {
      this.setState({ errors: ["Max file upload size is "+MAX_DOC_UPLOAD_SIZE+ " MB"] });
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
      fileType: imgType
    };
    this.setState(
      prev => {
        return {
          attachmentDetail: {
            ...prev.attachmentDetail,
            fileData: imgData,
            fileName: imgName,
            fileType: imgType
          }
        };
      },
      () => {
        console.log("fileData", this.state.attachmentDetail);
        this.uploadFileApollo();
      }
    );
  }

  uploadFileApollo() {
    this.state.attachmentDetail.versionNo = this.state.versionDetail.versionNo;
    this.setState({ loading: true });
    this.props.client
      .mutate({
        mutation: createAttachmentQuery,
        variables: {
          documentId: this.state.document.Id,
          versionId: this.state.version.Id,
          data: [this.state.attachmentDetail]
        }
      })
      .then(result => {
        // alert("Document Created successfully");
        this.setState({
          loading: false,
          reactModalVisible: true,
          modalMessage: "Attachment Added Successfully"
        });
        this.getListOfAttachments();
      })
      .catch(error => {
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

  onVersionUpdate() {
    if (this.validator.allValid()) {
      this.props.client
        .mutate({
          mutation: updateVersionQuery,
          variables: {
            id: this.state.version.Id,
            reviewStartDate: this.state.versionDetail.reviewStartDate,
            reviewEndDate: this.state.versionDetail.reviewEndDate,
            status: parseInt(this.state.versionDetail.status),
            final: this.state.version.final
          },
          fetchPolicy: "no-cache"
        })
        .then(result => {
          // alert("Updated successfully");
          this.setState({
            reactModalVisible: true,
            modalMessage: "Updated Successfully"
          });
          this.getListOfAttachments();
          this.props.updateVersion();
        })
        .catch(error => {
          console.log("~~~error: ", error);
          this.setState({ loading: false, errors: [errorMessage(error)] });
          this.timer = setTimeout(() => {
            this.setState({ errors: [] });
          }, SET_TIMEOUT_VALUE);
        });
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  }

  onSubmitForApproval() {
    if (this.validator.allValid()) {
      this.props.client
        .mutate({
          mutation: changeDocumentStatusQuery,
          variables: {
            id: this.props.document.Id,
            status: 1,
            comments: " "
          },
          fetchPolicy: "no-cache"
        })
        .then(result => {
          // alert("Submited successfully");
          this.setState({
            reactModalVisible: true,
            modalMessage: "Submited successfully"
          });
          this.props.updateVersion();
        })
        .catch(error => {
          console.log("~~~error: ", error);
          this.setState({ loading: false, errors: [errorMessage(error)] });
          this.timer = setTimeout(() => {
            this.setState({ errors: [] });
          }, SET_TIMEOUT_VALUE);
        });
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  }

  getListOfAttachments() {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: getListOfAttachmentsQuery,
        variables: {
          documentId: parseInt(this.props.document.Id),
          versionId: this.props.version.Id
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        const attachments = result.data.getListOfAttachmentsByVersionId;

        this.initialState = {
          attachments: attachments
        };
        this.setState({
          ...this.initialState,
          attachments: attachments,
          loading: false,
          error: ""
        });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, errors: [errorMessage(error)] });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  }
  getVersionReview = () => {
    this.props.client
      .query({
        query: getVersionReviewDetail,
        variables: {
          versionId: this.props.version.Id
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        const details = result.data.getVersionReviewDetail;

        this.setState({
          reviewerDetails: details,
          reviewerDetailModalVisible: true
        });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, errors: [errorMessage(error)] });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  };

  deleteAttachment(id) {
    this.setState({
      reactModalVisible: true,
      requireCancel: true,
      modalMessage: "Are you sure, you want to delete this attachment?",
      deleteId: id
    });
  }

  downloadAttachment(id) {
    this.setState({ loading: true });
    this.props.client
      .mutate({
        mutation: downloadAttachmentQuery,
        variables: {
          attachmentId: id,
          versionNo: this.state.versionDetail.versionNo
        },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        let document = result.data.downloadAttachment;
        var byteCharacters = atob(document.fileData);

        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        const contentType = mime.lookup(document.fileName.split(".")[1]);

        var blob = new Blob([byteArray], {
          type: contentType
        });

        FileSaver.saveAs(blob, document.fileName.substr(32));

        this.setState({
          errors: [],
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          errors: [errorMessage(error)]
        });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  }

  onSubmitReviewCompleted() {
    let isFinal = document.getElementById("isFinalVersion").checked;
    this.setState({ versionCompleted: true });
    this.props.client
      .mutate({
        mutation: reviewCompletedQuery,
        variables: {
          versionId: this.state.version.Id,
          versionNo: this.state.versionDetail.versionNo,
          isFinal: isFinal
        },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        this.onReviewCompletedModalVisible();
        this.setState({ versionCompleted: false });
        this.setState({
          reactModalVisible: true,
          modalMessage: "Submited Successfully."
        });
        this.props.reviewCompleted();
      })
      .catch(error => {
        this.setState({
          versionCompleted: false,
          loading: false,
          errors: [errorMessage(error)]
        });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  }

  goToCommentSection(document, attachment) {
    localStorage.setItem("document", JSON.stringify(document));
    localStorage.setItem(
      "attachment-" + attachment.Id,
      JSON.stringify(attachment)
    );
    // this.props.history.push("/pdf-viewer", target="_blank");
  }

  getUrl(attachment) {
    let url = decodeURI(
      attachment.attachmentURL.signedUrl
        .substring(attachment.attachmentURL.signedUrl.lastIndexOf("/") + 1)
        .substr(32)
    ).includes(".pdf")
      ? "/pdf-viewer?id=" + attachment.Id
      : "/xls-viewer?id=" + attachment.Id;
    return url;
  }
  getAttchmentReviewDetail = attachmentId => {
    this.props.client
      .query({
        query: getAttachmentReviewDetail,
        variables: {
          attachmentId: attachmentId,
          reviewer: false
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        const attachments = result.data.getAttachmentReviewDetail;
        this.setState(prevState => {
          return {
            seekAdditionalInfoModalVisible: !prevState.seekAdditionalInfoModalVisible
          };
        });
        this.updateMsgRead(attachmentId);
        console.log(attachments);

        this.setState({ seekAditionalInfoArray: attachments });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, errors: [errorMessage(error)] });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  };

  updateMsgRead = attachmentId => {
    this.props.client
      .mutate({
        mutation: updateMsgRead,
        variables: {
          attachmentId: attachmentId
        },
        fetchPolicy: "no-cache"
      })
      .then(result => {})
      .catch(error => {
        this.setState({
          loading: false,
          errors: [errorMessage(error)]
        });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  };

  isChangeDownload(e, attachment) {
    let isDownloadable = {
      attachmentId: attachment.Id,
      isDownload: e.target.checked
    };
    let modalMessage = e.target.checked
      ? "Are you sure, you want to enable download option?"
      : "Are you sure, you want to disable download option?";
    this.setState({
      isDownloadReactModalVisible: true,
      requireCancel: true,
      modalMessage: modalMessage,
      isDownload: isDownloadable
    });
  }

  isDownloadCloseModal() {
    this.setState({
      isDownloadReactModalVisible: false,
      requireCancel: false,
      modalMessage: "",
      isDownload: {}
    });
  }

  updateIsDownloadable() {
    this.setState({
      isDownloadReactModalVisible: false,
      modalMessage: "",
      requireCancel: false
    });
    this.props.client
      .mutate({
        mutation: updateIsDownloadable,
        variables: {
          attachmentId: this.state.isDownload.attachmentId,
          isDownload: this.state.isDownload.isDownload
        },
        fetchPolicy: "no-cache"
      })
      .then(result => {
        this.setState({
          reactModalVisible: true,
          modalMessage: "Updated Successfully"
        });
        this.getListOfAttachments();
      })
      .catch(error => {
        this.setState({
          loading: false,
          errors: [errorMessage(error)]
        });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  }

  componentDidMount() {
    let todayDate = format(new Date(), dateInputFormat);
    let revStartDate = format(
      this.props.version.reviewStartDate,
      dateInputFormat
    );
    let revEndDate = format(this.props.version.reviewEndDate, dateInputFormat);
    let res = isWithinRange(todayDate, revStartDate, revEndDate);
    let versionDetail = {
      versionNo: this.props.version.versionNo,
      reviewStartDate: this.props.version.reviewStartDate,
      reviewEndDate: this.props.version.reviewEndDate,
      status: this.props.version.status
    };
    this.setState({
      version: this.props.version,
      versionDetail: versionDetail,
      versionReviewMinStartDate: format(new Date(), dateInputFormat),
      versionReviewMinEndDate: format(new Date(), dateInputFormat),
      versionReviewMaxStartDate: this.props.document.reviewEndDate,
      versionReviewMaxEndDate: this.props.document.reviewEndDate,
      isCommentAble: res
    });
    localStorage.setItem("version", JSON.stringify(this.props.version));
    this.getListOfAttachments();
  }
  showReport = () => {
    this.setState(prevState => {
      return { displayReport: !prevState.displayReport };
    });
  };
  componentDidUpdate(prevProps) {
    if (
      prevProps.document !== this.props.document ||
      prevProps.version !== this.props.version
    ) {
      let versionDetail = {
        versionNo: this.props.version.versionNo,
        reviewStartDate: this.props.version.reviewStartDate,
        reviewEndDate: this.props.version.reviewEndDate,
        status: this.props.version.status
      };
      this.setState({
        document: this.props.document,
        version: this.props.version,
        versionDetail: versionDetail,
        versionReviewMaxStartDate: this.props.document.reviewEndDate,
        versionReviewMaxEndDate: this.props.document.reviewEndDate,
        newVersionNo: this.props.versionLength + 1
      });
      localStorage.setItem("version", JSON.stringify(this.props.version));
    }
  }

  render() {
    const {
      loading,
      errors,
      document,
      versionDetail,
      attachments,
      newVersionNo,
      versionReviewMinStartDate,
      versionReviewMaxStartDate,
      versionReviewMinEndDate,
      versionReviewMaxEndDate,
      reviewStartDate,
      reviewEndDate,
      createModalVisible,
      reviewCompletedModalVisible,
      reactModalVisible,
      requireCancel,
      modalMessage,
      seekAdditionalInfoModalVisible,
      isDownloadReactModalVisible,
      isCommentAble,
      versionCompleted,
      displayReport
    } = this.state;
    const { status, final, statusDetail } = this.props.version;
    const statusOptions = getDocumentVersionStatus(status);
    return (
      <>
        {displayReport ? (
          <TaskReport showReport={this.showReport} visible={displayReport} />
        ) : null}
        <div
          className="tab-pane fade show active"
          id="doc"
          role="tabpanel"
          aria-labelledby="doc-tab"
        >
          <ReactModal
            reactModalVisible={reactModalVisible}
            submitModal={this.submitModal}
            modalMessage={modalMessage}
            requireCancel={requireCancel}
            closeModal={this.closeModal}
          />
          {/* isDownload  */}
          <ReactModal
            reactModalVisible={isDownloadReactModalVisible}
            submitModal={this.updateIsDownloadable}
            modalMessage={modalMessage}
            requireCancel={requireCancel}
            closeModal={this.isDownloadCloseModal}
          />
          {/* Seek Aditional Information modal start */}
          <Modal
            visible={seekAdditionalInfoModalVisible}
            effect="fadeInDown"
            width="850"
          >
            <div style={{ padding: "40px 40px" }}>
              <div className="modal-content" style={{ border: "none" }}>
                <div
                  className="modal-header"
                  style={{ display: "-webkit-box", padding: 0 }}
                >
                  <div className="col-10" style={{ display: "-webkit-box" }}>
                    <figure style={{ marginRight: "20px" }}>
                      <img src={popupLogo} />
                    </figure>
                    <h1 className="heading m-l-28">
                      Seek Additional Information
                    </h1>
                  </div>
                  <div className="col-2 text-right">
                    <a
                      href="#"
                      onClick={() => {
                        this.setState(
                          prevState => {
                            return {
                              seekAdditionalInfoModalVisible: !prevState.seekAdditionalInfoModalVisible
                            };
                          },
                          () => {
                            this.getListOfAttachments();
                          }
                        );
                      }}
                      className="link-click "
                    >
                      <svg
                        x="0px"
                        y="0px"
                        width="16px"
                        height="16px"
                        viewBox="0 0 16 16"
                        enableBackground="new 0 0 16 16"
                        xmlSpace="preserve"
                      >
                        <g>
                          <line
                            fill="none"
                            stroke="#69951a"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit={10}
                            x1="3.25"
                            y1="3.25"
                            x2="12.75"
                            y2="12.75"
                          />
                          <line
                            fill="none"
                            stroke="#69951a"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit={10}
                            x1="12.75"
                            y1="3.25"
                            x2="3.25"
                            y2="12.75"
                          />
                        </g>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="modal-body">
                  {/* <div className="row">
                        <div className="col-md-6 col-lg-12">
                        <div className="form-group">
                        <TextAreComponent 
                                required
                                title="seekAdditionalInfo"
                                name="seekAdditionalInfo"
                                label="Additional Info Required"
                                value={this.state.seekAdditionalInfo}
                                placeholder="Enter query"
                                handleChange={this.handleAdditionalInfo}
                                validator={this.validator}
                                validation="required"
                            />
                        </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-4 col-lg-4">

                            <ButtonComponent type="Submit" title="Submit"className=" btn-danger" onClick={()=>{this.addInfo()}}/>
                        </div>
                        </div> */}
                </div>

                <div
                  className="table-responsive"
                  style={{ maxHeight: "270px" }}
                >
                  <table className="table table-style-1 ">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          width={180}
                          style={{ fontSize: "15px" }}
                        >
                          Employee Name
                        </th>
                        <th
                          scope="col"
                          width={420}
                          style={{ fontSize: "15px" }}
                        >
                          Information Requested
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.seekAditionalInfoArray.length
                        ? this.state.seekAditionalInfoArray.map(
                            (detail, index) => {
                              console.log(detail);
                              return (
                                <tr key={index}>
                                  <td
                                    style={{
                                      fontSize: "14px",
                                      verticalAlign: "top"
                                    }}
                                  >
                                    {detail && detail.userDetail
                                      ? detail.userDetail.name
                                      : ""}
                                    <br />
                                    <span style={{ fontSize: "10px" }}>
                                      {detail
                                        ? format(
                                            detail.createdOn,
                                            dateFormatMonth
                                          )
                                        : ""}
                                    </span>
                                  </td>
                                  <td style={{ wordWrap: "break-word" }}>
                                    <textarea
                                      className="form-control-plaintext"
                                      style={{ minHeight: "70px" }}
                                      readOnly
                                      value={
                                        detail ? detail.seekInformation : ""
                                      }
                                    ></textarea>
                                  </td>
                                </tr>
                              );
                            }
                          )
                        : null}
                    </tbody>
                  </table>
                </div>
                {!this.state.seekAditionalInfoArray.length ? (
                  <div className="text-center">No Data</div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Modal>
          {/* Seek Additional Information Model end */}

          {/*  */}
          <Modal
            visible={this.state.reviewerDetailModalVisible}
            effect="fadeInDown"
            width="700"
          >
            <div style={{ padding: "40px 40px" }}>
              <div className="modal-content" style={{ border: "none" }}>
                <div
                  className="modal-header"
                  style={{ display: "-webkit-box", padding: 0 }}
                >
                  <div className="col-10" style={{ display: "-webkit-box" }}>
                    <figure style={{ marginRight: "20px" }}>
                      <img src={popupLogo} />
                    </figure>
                    <h1 className="heading m-l-28">
                      Review Completion Details
                    </h1>
                  </div>
                  <div className="col-2 text-right">
                    <a
                      href="#"
                      onClick={() => {
                        this.setState(prevState => {
                          return {
                            reviewerDetailModalVisible: !prevState.reviewerDetailModalVisible
                          };
                        });
                      }}
                      className="link-click "
                    >
                      <svg
                        x="0px"
                        y="0px"
                        width="16px"
                        height="16px"
                        viewBox="0 0 16 16"
                        enableBackground="new 0 0 16 16"
                        xmlSpace="preserve"
                      >
                        <g>
                          <line
                            fill="none"
                            stroke="#69951a"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit={10}
                            x1="3.25"
                            y1="3.25"
                            x2="12.75"
                            y2="12.75"
                          />
                          <line
                            fill="none"
                            stroke="#69951a"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit={10}
                            x1="12.75"
                            y1="3.25"
                            x2="3.25"
                            y2="12.75"
                          />
                        </g>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="modal-body">
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "500px" }}
                  >
                    <table className="table table-style-1 ">
                      <thead>
                        <tr>
                          {/* <th
                          scope="col"
                          width={170}
                          style={{ fontSize: "15px" }}
                        >
                          Employee ID
                        </th> */}
                          <th
                            scope="col"
                            width={270}
                            style={{ fontSize: "15px" }}
                          >
                            Employee Name
                          </th>
                          <th
                            scope="col"
                            width={225}
                            style={{ fontSize: "15px" }}
                          >
                            Review Completed On
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.reviewerDetails.length
                          ? this.state.reviewerDetails.map((data, index) => {
                              return (
                                <tr key={index}>
                                  {/* <td>
                                  {data.userDetail
                                    ? data.userDetail.employeeId
                                    : ""}
                                </td> */}
                                  <td>
                                    {data.userDetail
                                      ? data.userDetail.name
                                      : ""}
                                  </td>
                                  <td>
                                    {format(data.modifiedOn, dateFormatMonth)}
                                  </td>
                                </tr>
                              );
                            })
                          : ""}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Modal>

          {/*  */}
          {/* Review Completed Modal Start */}
          <Modal
            visible={reviewCompletedModalVisible}
            effect="fadeInDown"
            width="600"
          >
            <div style={{ padding: "40px 40px" }}>
              <div className="modal-content" style={{ border: "none" }}>
                <div
                  className="modal-header"
                  style={{ display: "-webkit-box", padding: 0 }}
                >
                  <figure style={{ marginRight: "20px" }}>
                    <img src={popupLogo} />
                  </figure>
                  <h1 className="heading m-l-28">Review Completed</h1>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12" style={{ fontWeight: "bold" }}>
                      <b style={{ fontSize: "16px" }}>Note: </b>On selection of{" "}
                      <span style={{ color: "red" }}>"Is Final Version"</span>,
                      It is assumed that Review of documents by reviewers
                      completed. Final documents with reviewer comments shall be
                      uploaded.
                    </div>
                    <div className="col-md-12 m-t-30">
                      <div className="form-group">
                        <div className="checkbox-style-1">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="isFinalVersion"
                              value="option1"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="isFinalVersion"
                            >
                              {" "}
                              Is Final Version
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default popup-button-default text-w-light"
                    data-dismiss="modal"
                    onClick={() => this.onReviewCompletedModalVisible()}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={versionCompleted}
                    type="button"
                    className="btn btn-danger popup-button-danger"
                    onClick={() => this.onSubmitReviewCompleted()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          {/* Review Completed Modal End */}
          <div className="box-card" id="exist-version">
            <div className="row">
              <div className="col-md-12">
                <div className="row align-items-center">
                  <div className="col-md-10">
                    <h1 className="heading">
                      Upload Attachments{" "}
                      <span style={{ color: "red", fontSize: "18px" }}>
                        <sup>{final ? "(Final)" : null}</sup>
                      </span>
                    </h1>
                    <div
                      className="row"
                      style={{
                        display: errors.length === 0 ? "none" : "block"
                      }}
                    >
                      <div className="col-md-12">
                        <div className="alert alert-success" role="alert">
                          <div className="row">
                            <span className="danger-link">
                              <DisplayErrors errors={errors} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table Section Start */}
                <div className="row">
                  <div className="col-md-6 col-lg-3">
                    <InputComponent
                      readOnly
                      type="text"
                      title="versionNo"
                      name="versionNo"
                      label="Version No"
                      value={versionDetail.versionNo}
                      placeholder="Version No"
                      handleChange={this.handleInput}
                      validator={this.validator}
                      validation="required"
                    />
                  </div>
                  <div className="col-md-6 col-lg-3">
                    {!final &&
                    (document.status == 4 ||
                      document.status == 1 ||
                      document.status == 2) ? (
                      <InputComponent
                        readOnly={
                          this.props.selectedVersion != this.props.versionLength
                            ? true
                            : false
                        }
                        required
                        type="date"
                        title="reviewStartDate"
                        name="reviewStartDate"
                        label="Review Start Date"
                        value={versionDetail.reviewStartDate}
                        placeholder="Version No"
                        handleChange={this.handleInput}
                        validator={this.validator}
                        validation="required"
                        min={versionReviewMinStartDate}
                        max={versionReviewMaxStartDate}
                      />
                    ) : (
                      <InputComponent
                        // readOnly={true}
                        required
                        type="date"
                        title="reviewStartDate"
                        name="reviewStartDate"
                        label="Review Start Date"
                        value={versionDetail.reviewStartDate}
                        placeholder="Version No"
                        handleChange={this.handleInput}
                        validator={this.validator}
                        validation="required"
                        min={versionReviewMinStartDate}
                        max={versionReviewMaxStartDate}
                      />
                    )}
                  </div>
                  <div className="col-md-6 col-lg-3">
                    {!final &&
                    (document.status == 4 ||
                      document.status == 1 ||
                      document.status == 2) ? (
                      <InputComponent
                        readOnly={
                          this.props.selectedVersion != this.props.versionLength
                            ? true
                            : false
                        }
                        required
                        type="date"
                        title="reviewEndDate"
                        name="reviewEndDate"
                        label="Review End Date"
                        value={versionDetail.reviewEndDate}
                        placeholder="Version No"
                        handleChange={this.handleInput}
                        validator={this.validator}
                        validation="required"
                        min={versionReviewMinEndDate}
                        max={versionReviewMaxEndDate}
                      />
                    ) : (
                      <InputComponent
                        // readOnly={true}
                        required
                        type="date"
                        title="reviewEndDate"
                        name="reviewEndDate"
                        label="Review End Date"
                        value={versionDetail.reviewEndDate}
                        placeholder="Version No"
                        handleChange={this.handleInput}
                        validator={this.validator}
                        validation="required"
                        min={versionReviewMinEndDate}
                        max={versionReviewMaxEndDate}
                      />
                    )}
                  </div>
                  {document.status != 4 && document.status != 1 ? (
                    <div className="col-md-6 col-lg-3">
                      {!final && document.status == 2 ? (
                        this.props.selectedVersion ==
                        this.props.versionLength ? (
                          <SelectComponent
                            disabled={attachments.length ? false : true}
                            required
                            label={"Status"}
                            title={"status"}
                            name={"status"}
                            options={statusOptions}
                            optionKey={"name"}
                            valueKey={"id"}
                            value={versionDetail.status}
                            placeholder={"Select Status"}
                            handleChange={this.handleInput}
                            validator={this.validator}
                            validation="required"
                          />
                        ) : (
                          <InputComponent
                            readOnly={true}
                            required
                            type="text"
                            title="status"
                            name="status"
                            label="Status"
                            value={
                              statusDetail && statusDetail[0].name
                                ? statusDetail[0].name
                                : versionDetail.status
                            }
                            placeholder="Enter Project"
                            handleChange={this.handleInput}
                            validator={this.validator}
                            validation="required"
                          />
                        )
                      ) : (
                        // <InputComponent
                        //     readOnly={true}
                        //     required
                        //     type="text"
                        //     title="status"
                        //     name="status"
                        //     label="Status"
                        //     value={statusDetail && statusDetail[0].name ? statusDetail[0].name : versionDetail.status}
                        //     placeholder="Enter Project"
                        //     handleChange={this.handleInput}
                        //     validator={this.validator}
                        //     validation="required"
                        // />
                        <SelectComponent
                          required
                          label={"Status"}
                          title={"status"}
                          name={"status"}
                          options={statusOptions}
                          optionKey={"name"}
                          valueKey={"id"}
                          value={versionDetail.status}
                          placeholder={"Select Status"}
                          handleChange={this.handleInput}
                          validator={this.validator}
                          validation="required"
                        />
                      )}
                    </div>
                  ) : null}
                </div>
                {!final ? (
                  document.status == 4 ||
                  document.status == 1 ||
                  document.status == 2 ? (
                    this.props.selectedVersion == this.props.versionLength ? (
                      <div className="row">
                        <div className="col-md-12 text-right">
                          <button
                            disabled={
                              final && !attachments.length ? true : false
                            }
                            type="button"
                            className="btn btn-danger"
                            onClick={() => this.onVersionUpdate()}
                          >
                            Update
                          </button>
                          <hr />
                        </div>
                      </div>
                    ) : null
                  ) : null
                ) : status == 3 ? (
                  <div className="row">
                    <div className="col-md-12 text-right">
                      <button
                        disabled={final && !attachments.length ? true : false}
                        type="button"
                        className="btn btn-danger"
                        onClick={() => this.onVersionUpdate()}
                      >
                        Update
                      </button>
                      <hr />
                    </div>
                  </div>
                ) : null}
                {!final ? (
                  document.status == 4 ||
                  document.status == 1 ||
                  document.status == 2 ? (
                    this.props.selectedVersion == this.props.versionLength ? (
                      <div className="text-right">
                        <div className="upload-btn-wrapper">
                          <a
                            className="link-click"
                            href="#"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Upload"
                            style={{ fontSize: "16px" }}
                            onClick={() => {
                              this.state.fileinput.click();
                            }}
                          >
                            <svg
                              x="0px"
                              y="0px"
                              width="16px"
                              height="16px"
                              viewBox="0 0 16 16"
                              enableBackground="new 0 0 16 16"
                              xmlSpace="preserve"
                            >
                              <g>
                                <circle
                                  fill="none"
                                  stroke="#69951a"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  cx={8}
                                  cy={8}
                                  r="7.5"
                                />
                                <g>
                                  <line
                                    fill="none"
                                    stroke="#69951a"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit={10}
                                    x1="2.5"
                                    y1={8}
                                    x2="13.5"
                                    y2={8}
                                  />
                                  <line
                                    fill="none"
                                    stroke="#69951a"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeMiterlimit={10}
                                    x1={8}
                                    y1="2.5"
                                    x2={8}
                                    y2="13.5"
                                  />
                                </g>
                              </g>
                            </svg>
                            {" Add Attachments"}
                          </a>
                          <input
                            type="file"
                            id="uploadAttachments"
                            hidden
                            name="attachments"
                            // accept="image/gif,image/jpeg,image/png"
                            accept=".xlsx, .xls, .doc, .docx, .ppt, .pptx, .pdf"
                            ref={fileinput => {
                              this.state.fileinput = fileinput;
                            }}
                            onChange={e => {
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
                                          uploading: true
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
                        </div>
                      </div>
                    ) : null
                  ) : null
                ) : status == 3 ? (
                  <div className="text-right">
                    <div className="upload-btn-wrapper">
                      <a
                        className="link-click"
                        href="#"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Upload"
                        style={{ fontSize: "16px" }}
                        onClick={() => {
                          this.state.fileinput.click();
                        }}
                      >
                        <svg
                          x="0px"
                          y="0px"
                          width="16px"
                          height="16px"
                          viewBox="0 0 16 16"
                          enableBackground="new 0 0 16 16"
                          xmlSpace="preserve"
                        >
                          <g>
                            <circle
                              fill="none"
                              stroke="#69951a"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              cx={8}
                              cy={8}
                              r="7.5"
                            />
                            <g>
                              <line
                                fill="none"
                                stroke="#69951a"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit={10}
                                x1="2.5"
                                y1={8}
                                x2="13.5"
                                y2={8}
                              />
                              <line
                                fill="none"
                                stroke="#69951a"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeMiterlimit={10}
                                x1={8}
                                y1="2.5"
                                x2={8}
                                y2="13.5"
                              />
                            </g>
                          </g>
                        </svg>
                        {" Add Attachments"}
                      </a>
                      <input
                        type="file"
                        id="uploadAttachments"
                        hidden
                        name="attachments"
                        // accept="image/gif,image/jpeg,image/png"
                        accept=".doc, .docx, .ppt, .pptx, .pdf"
                        ref={fileinput => {
                          this.state.fileinput = fileinput;
                        }}
                        onChange={e => {
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
                                      uploading: true
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
                    </div>
                  </div>
                ) : null}

                {loading ? (
                  <div className="loadersmall" style={{ marginLeft: "50%" }} />
                ) : (
                  <div className="table-responsive">
                    <table className="table table-style-1 ">
                      <thead>
                        <tr>
                          <th scope="col" width={400}>
                            FILE NAME
                          </th>
                          <th scope="col" width={50}>
                            DOWNLOADABLE
                          </th>
                          <th scope="col" width={250}>
                            ACTION(s)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {attachments.length
                          ? attachments.map((attachment, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    {/* {attachment.isDownloadable? */}
                                    <a
                                      href="#"
                                      data-toggle="tooltip"
                                      data-placement="bottom"
                                      title="Download"
                                      style={{ textDecoration: "underline" }}
                                      onClick={() =>
                                        this.downloadAttachment(attachment.Id)
                                      }
                                    >
                                      {decodeURI(
                                        attachment.url
                                          .substring(
                                            attachment.url.lastIndexOf("/") + 1
                                          )
                                          .substr(32)
                                      )}
                                    </a>
                                    {/* :
                                <a>{decodeURI(
                                  attachment.url
                                    .substring(
                                      attachment.url.lastIndexOf("/") + 1
                                    )
                                    .substr(32)
                                )}</a>
                                } */}
                                  </td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      style={{ marginLeft: "30px" }}
                                      checked={attachment.isDownloadable}
                                      onClick={e =>
                                        this.isChangeDownload(e, attachment)
                                      }
                                    />
                                  </td>
                                  <td>
                                    {final ? (
                                      <a
                                        href={
                                          attachment.attachmentURL &&
                                          attachment.attachmentURL.signedUrl
                                            ? attachment.attachmentURL.signedUrl
                                            : ""
                                        }
                                        className="link-primary"
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title="Preview"
                                        target="_blank"
                                      >
                                        <img src={preview} />
                                      </a>
                                    ) : status == 3 &&
                                      (document.status == 4 ||
                                        document.status == 1 ||
                                        document.status == 2) ? (
                                      <>
                                        {decodeURI(
                                          attachment.url
                                            .substring(
                                              attachment.url.lastIndexOf("/") +
                                                1
                                            )
                                            .substr(32)
                                        ).includes(".xls") ||
                                        decodeURI(
                                          attachment.url
                                            .substring(
                                              attachment.url.lastIndexOf("/") +
                                                1
                                            )
                                            .substr(32)
                                        ).includes(".xlsx") ? null : (
                                          <a
                                            href={
                                              attachment.attachmentURL &&
                                              attachment.attachmentURL.signedUrl
                                                ? attachment.attachmentURL
                                                    .signedUrl
                                                : ""
                                            }
                                            className="link-primary"
                                            data-toggle="tooltip"
                                            data-placement="bottom"
                                            title="Preview"
                                            target="_blank"
                                          >
                                            <img src={preview} />
                                          </a>
                                        )}
                                      </>
                                    ) : null}

                                    {/* {status != 3 && !final ? (
                                  <a
                                    href={this.getUrl(attachment)}
                                    className="link-primary m-l-45"
                                    data-toggle="tooltip"
                                    data-placement="bottom"
                                    target="_blank"
                                    title="Review"
                                    onClick={() =>
                                      this.goToCommentSection(
                                        document,
                                        attachment
                                      )
                                    }
                                  >
                                    <svg
                                      x="0px"
                                      y="0px"
                                      width="16px"
                                      height="16px"
                                      viewBox="0 0 16 16"
                                    >
                                      <g transform="translate(0, 0)">
                                        <line
                                          fill="none"
                                          stroke="#69951a"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeMiterlimit={10}
                                          x1="4.5"
                                          y1="11.5"
                                          x2="11.5"
                                          y2="11.5"
                                          data-color="color-2"
                                        />
                                        <line
                                          fill="none"
                                          stroke="#69951a"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeMiterlimit={10}
                                          x1="4.5"
                                          y1="8.5"
                                          x2="11.5"
                                          y2="8.5"
                                          data-color="color-2"
                                        />
                                        <line
                                          fill="none"
                                          stroke="#69951a"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeMiterlimit={10}
                                          x1="4.5"
                                          y1="5.5"
                                          x2="6.5"
                                          y2="5.5"
                                          data-color="color-2"
                                        />
                                        <polygon
                                          fill="none"
                                          stroke="#69951a"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeMiterlimit={10}
                                          points="9.5,0.5 1.5,0.5 1.5,15.5 14.5,15.5 14.5,5.5 "
                                        />
                                        <polyline
                                          fill="none"
                                          stroke="#69951a"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeMiterlimit={10}
                                          points="9.5,0.5 9.5,5.5 14.5,5.5 "
                                        />
                                      </g>
                                    </svg>
                                  </a>
                                ) : null} */}

                                    {status != 3 && !final ? (
                                      <>
                                        {/* {status == 1 ? (
                                        <>
                                          {isCommentAble ? (
                                            <a
                                              href={this.getUrl(attachment)}
                                              className={
                                                document.status == 1 &&
                                                document.isReportingManager
                                                  ? "link-primary m-l-45"
                                                  : "link-primary"
                                              }
                                              data-toggle="tooltip"
                                              data-placement="bottom"
                                              target="_blank"
                                              title="Review"
                                              onClick={() =>
                                                this.goToCommentSection(
                                                  document,
                                                  attachment
                                                )
                                              }
                                            >
                                              <svg
                                                x="0px"
                                                y="0px"
                                                width="16px"
                                                height="16px"
                                                viewBox="0 0 16 16"
                                              >
                                                <g transform="translate(0, 0)">
                                                  <line
                                                    fill="none"
                                                    stroke="#69951a"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeMiterlimit={10}
                                                    x1="4.5"
                                                    y1="11.5"
                                                    x2="11.5"
                                                    y2="11.5"
                                                    data-color="color-2"
                                                  />
                                                  <line
                                                    fill="none"
                                                    stroke="#69951a"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeMiterlimit={10}
                                                    x1="4.5"
                                                    y1="8.5"
                                                    x2="11.5"
                                                    y2="8.5"
                                                    data-color="color-2"
                                                  />
                                                  <line
                                                    fill="none"
                                                    stroke="#69951a"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeMiterlimit={10}
                                                    x1="4.5"
                                                    y1="5.5"
                                                    x2="6.5"
                                                    y2="5.5"
                                                    data-color="color-2"
                                                  />
                                                  <polygon
                                                    fill="none"
                                                    stroke="#69951a"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeMiterlimit={10}
                                                    points="9.5,0.5 1.5,0.5 1.5,15.5 14.5,15.5 14.5,5.5 "
                                                  />
                                                  <polyline
                                                    fill="none"
                                                    stroke="#69951a"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeMiterlimit={10}
                                                    points="9.5,0.5 9.5,5.5 14.5,5.5 "
                                                  />
                                                </g>
                                              </svg>
                                            </a>
                                          ) : null}
                                        </>
                                      ) : ( */}
                                        <a
                                          href={this.getUrl(attachment)}
                                          className={
                                            document.status == 1 &&
                                            document.isReportingManager
                                              ? "link-primary m-l-45"
                                              : "link-primary"
                                          }
                                          data-toggle="tooltip"
                                          data-placement="bottom"
                                          target="_blank"
                                          title="Review"
                                          onClick={() =>
                                            this.goToCommentSection(
                                              document,
                                              attachment
                                            )
                                          }
                                        >
                                          <svg
                                            x="0px"
                                            y="0px"
                                            width="16px"
                                            height="16px"
                                            viewBox="0 0 16 16"
                                          >
                                            <g transform="translate(0, 0)">
                                              <line
                                                fill="none"
                                                stroke="#69951a"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeMiterlimit={10}
                                                x1="4.5"
                                                y1="11.5"
                                                x2="11.5"
                                                y2="11.5"
                                                data-color="color-2"
                                              />
                                              <line
                                                fill="none"
                                                stroke="#69951a"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeMiterlimit={10}
                                                x1="4.5"
                                                y1="8.5"
                                                x2="11.5"
                                                y2="8.5"
                                                data-color="color-2"
                                              />
                                              <line
                                                fill="none"
                                                stroke="#69951a"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeMiterlimit={10}
                                                x1="4.5"
                                                y1="5.5"
                                                x2="6.5"
                                                y2="5.5"
                                                data-color="color-2"
                                              />
                                              <polygon
                                                fill="none"
                                                stroke="#69951a"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeMiterlimit={10}
                                                points="9.5,0.5 1.5,0.5 1.5,15.5 14.5,15.5 14.5,5.5 "
                                              />
                                              <polyline
                                                fill="none"
                                                stroke="#69951a"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeMiterlimit={10}
                                                points="9.5,0.5 9.5,5.5 14.5,5.5 "
                                              />
                                            </g>
                                          </svg>
                                        </a>
                                        {/* )} */}
                                      </>
                                    ) : null}

                                    {status == 3 ? (
                                      <a
                                        href="#"
                                        className="link-delete m-l-45"
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title="Delete"
                                        onClick={() =>
                                          this.deleteAttachment(attachment.Id)
                                        }
                                      >
                                        <svg
                                          x="0px"
                                          y="0px"
                                          width="16px"
                                          height="16px"
                                          viewBox="0 0 16 16"
                                        >
                                          <g transform="translate(0, 0)">
                                            <path
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              d="M2.5,6.5v7 c0,1.105,0.895,2,2,2h8c1.105,0,2-0.895,2-2v-7"
                                            />
                                            <line
                                              data-color="color-2"
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              x1="1.5"
                                              y1="3.5"
                                              x2="15.5"
                                              y2="3.5"
                                            />
                                            <polyline
                                              data-color="color-2"
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              points=" 6.5,3.5 6.5,0.5 10.5,0.5 10.5,3.5 "
                                            />
                                            <line
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              x1="8.5"
                                              y1="7.5"
                                              x2="8.5"
                                              y2="12.5"
                                            />
                                            <line
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              x1="11.5"
                                              y1="7.5"
                                              x2="11.5"
                                              y2="12.5"
                                            />
                                            <line
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              x1="5.5"
                                              y1="7.5"
                                              x2="5.5"
                                              y2="12.5"
                                            />
                                          </g>
                                        </svg>
                                      </a>
                                    ) : null}
                                    <a
                                      href="#"
                                      className="link-primary m-l-45"
                                      data-toggle="tooltip"
                                      data-placement="bottom"
                                      title="Additional Info"
                                      // onClick={()=>{this.setState(prevState=>{return {seekAdditionalInfoModalVisible:!prevState.seekAdditionalInfoModalVisible}},()=>{
                                      //     this.getAttchmentReviewDetail(attachment.Id)
                                      // })}}
                                      onClick={() => {
                                        this.getAttchmentReviewDetail(
                                          attachment.Id
                                        );
                                      }}
                                    >
                                      {attachment.msgRead ? (
                                        <svg
                                          x="0px"
                                          y="0px"
                                          width="16px"
                                          height="16px"
                                          viewBox="0 0 16 16"
                                        >
                                          <g transform="translate(0, 0)">
                                            <line
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              x1="4.5"
                                              y1="11.5"
                                              x2="11.5"
                                              y2="11.5"
                                              data-color="color-2"
                                            />
                                            <line
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              x1="4.5"
                                              y1="8.5"
                                              x2="11.5"
                                              y2="8.5"
                                              data-color="color-2"
                                            />
                                            <line
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              x1="4.5"
                                              y1="5.5"
                                              x2="6.5"
                                              y2="5.5"
                                              data-color="color-2"
                                            />
                                            <polygon
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              points="9.5,0.5 1.5,0.5 1.5,15.5 14.5,15.5 14.5,5.5 "
                                            />
                                            <polyline
                                              fill="none"
                                              stroke="#69951a"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              points="9.5,0.5 9.5,5.5 14.5,5.5 "
                                            />
                                          </g>
                                        </svg>
                                      ) : (
                                        <svg
                                          x="0px"
                                          y="0px"
                                          width="16px"
                                          height="16px"
                                          viewBox="0 0 16 16"
                                        >
                                          <g transform="translate(0, 0)">
                                            <line
                                              fill="none"
                                              stroke="#0087D5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              x1="4.5"
                                              y1="11.5"
                                              x2="11.5"
                                              y2="11.5"
                                              data-color="color-2"
                                            />
                                            <line
                                              fill="none"
                                              stroke="#0087D5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              x1="4.5"
                                              y1="8.5"
                                              x2="11.5"
                                              y2="8.5"
                                              data-color="color-2"
                                            />
                                            <line
                                              fill="none"
                                              stroke="#0087D5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              x1="4.5"
                                              y1="5.5"
                                              x2="6.5"
                                              y2="5.5"
                                              data-color="color-2"
                                            />
                                            <polygon
                                              fill="none"
                                              stroke="#0087D5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              points="9.5,0.5 1.5,0.5 1.5,15.5 14.5,15.5 14.5,5.5 "
                                            />
                                            <polyline
                                              fill="none"
                                              stroke="#0087D5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeMiterlimit={10}
                                              points="9.5,0.5 9.5,5.5 14.5,5.5 "
                                            />
                                          </g>
                                        </svg>
                                      )}
                                    </a>
                                    <a
                                      // href="/task-report"
                                      onClick={() => {
                                        localStorage.setItem(
                                          "document",
                                          JSON.stringify(document)
                                        );
                                        localStorage.setItem(
                                          "attachment",
                                          JSON.stringify(attachment)
                                        );
                                        localStorage.setItem(
                                          "attachmentName",
                                          decodeURI(
                                            attachment.url
                                              .substring(
                                                attachment.url.lastIndexOf(
                                                  "/"
                                                ) + 1
                                              )
                                              .substr(32)
                                          )
                                        );
                                        this.showReport();
                                      }}
                                      className="link-primary  m-l-45"
                                      data-toggle="tooltip"
                                      data-placement="bottom"
                                      title="Report"
                                    >
                                      {/* <img src={preview} /> */}
                                      <svg
                                        x="0px"
                                        y="0px"
                                        width="16px"
                                        height="16px"
                                        viewBox="0 0 16 16"
                                      >
                                        <g transform="translate(0, 0)">
                                          <line
                                            fill="none"
                                            stroke="#69951a"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeMiterlimit={10}
                                            x1="4.5"
                                            y1="11.5"
                                            x2="11.5"
                                            y2="11.5"
                                            data-color="color-2"
                                          />
                                          <line
                                            fill="none"
                                            stroke="#69951a"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeMiterlimit={10}
                                            x1="4.5"
                                            y1="8.5"
                                            x2="11.5"
                                            y2="8.5"
                                            data-color="color-2"
                                          />
                                          <line
                                            fill="none"
                                            stroke="#69951a"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeMiterlimit={10}
                                            x1="4.5"
                                            y1="5.5"
                                            x2="6.5"
                                            y2="5.5"
                                            data-color="color-2"
                                          />
                                          <polygon
                                            fill="none"
                                            stroke="#69951a"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeMiterlimit={10}
                                            points="9.5,0.5 1.5,0.5 1.5,15.5 14.5,15.5 14.5,5.5 "
                                          />
                                          <polyline
                                            fill="none"
                                            stroke="#69951a"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeMiterlimit={10}
                                            points="9.5,0.5 9.5,5.5 14.5,5.5 "
                                          />
                                        </g>
                                      </svg>
                                    </a>
                                  </td>
                                </tr>
                              );
                            })
                          : null}
                      </tbody>
                    </table>
                  </div>
                )}
                {!attachments.length && !errors.length && !loading ? (
                  <div style={{ textAlign: "center" }}>No Data</div>
                ) : null}
                <div className="text-center" style={{ marginTop: "8px" }}>
                  {document &&
                  document.status == 4 &&
                  this.props.versionLength == 1 &&
                  attachments.length ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => this.onSubmitForApproval()}
                    >
                      Submit for Approval
                    </button>
                  ) : null}
                  <>
                    <div className="row">
                      <div className="col-md-12">
                        {document.status == 2 &&
                        status == 1 &&
                        !final &&
                        attachments.length ? (
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              this.setState({
                                reviewCompletedModalVisible: true
                              })
                            }
                          >
                            Review Completed
                          </button>
                        ) : null}
                        {status != 3 && attachments.length ? (
                          <button
                            className="btn btn-danger m-l-45"
                            onClick={() => {
                              this.getVersionReview();
                            }}
                          >
                            Review Status
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </>
                  {/* :null} */}
                </div>
              </div>
              {/* Table Section End */}
              {/* Sales Section End */}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withApollo(Version);
