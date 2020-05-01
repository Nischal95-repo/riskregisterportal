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
  CREATE_MITIGATION_ACTIVITY,
  UPDATE_MITIGATION,
} from "../../services/graphql/queries/riskRegister";
import {
  getListofGenericMasterQuery,
  ALL_EMPLOYEE_LIST,
} from "../../services/graphql/queries/user";
import ButtonComponent from "../Common/form-component/ButtonComponent";
import TextAreaComponent from "../Common/form-component/TextAreComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import { compareValues } from "../Common/customSort";

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
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-awesome-modal";
import popupLogo from "../../static/images/popup-logo.png";
import CloseSvg from "../../static/images/svg/Close.svg";

import { errorMsg, successMsg } from "../Common/alert";
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
      name: "",
      activityDetail: {
        responsible: null,

        department: null,
        status: null,
        reassignRemarks: "",
      },
      departmentOptions: [],
      userOptions: [],
      options: [],
      loading: true,
      errors: [],
      error: "",
      showReassign: false,
    };
    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: (message) => <div style={{ color: "red" }}>{message}</div>,
    });
  }
  handleInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    if (value !== "" && (name == "department" || name == "responsible")) {
      value = parseInt(value);
    }
    this.setState((prevState) => {
      return {
        activityDetail: {
          ...prevState.activityDetail,
          [name]: value,
        },
      };
    });
    if (name == "department") {
      debugger;
      let users = [];

      this.state.options.forEach((element) => {
        console.log("department", element, value);
        if (element.department.includes(parseInt(value))) {
          let obj = {
            Id: element.Id,
            label: element.name,
          };

          users.push(obj);
        }
      });
      users = users.sort(compareValues("label"));
      this.setState({ userOptions: users });
    }
    // if (name == "forecastDate") {
    //   this.state.documentDetail.reviewEndDate = "";
    //   this.setState({ minReviewEndDate: format(value, dateInputFormat) });
    // }
  };
  getListOfOptions(id) {
    this.props.client
      .query({
        query: getListofGenericMasterQuery,
        variables: {
          masterFor: id,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var user = result.data.getListofGenericMaster;
        let OptionArr = [];
        user.forEach((element) => {
          OptionArr.push({
            Id: element.Id,
            label: element.description,
          });
        });
        if (id == 3) {
          this.initialState = {
            companyOptions: OptionArr,
          };
        } else if (id == 4) {
          this.initialState = {
            projectOptions: OptionArr,
          };
        } else if (id == 18)
          this.initialState = {
            riskOptions: OptionArr.sort(compareValues("label")),
          };
        else if (id == 2)
          this.initialState = {
            departmentOptions: OptionArr,
          };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  }
  getUserList() {
    this.setState({ loading: true });
    this.props.client
      .query({
        query: ALL_EMPLOYEE_LIST,
        variables: {
          // employeeId: this.state.employeeId ? this.state.employeeId : null,
          // name: this.state.name ? this.state.name : "",
          status: 1,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var users = result.data.getListOfAyanaEmployees;

        this.setState({
          ...this.initialState,
          loading: false,
          error: "",
          options: users,
        });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
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
        this.setState({
          mitigationDetails: data,
          loading: false,
          name: data.name,
        });
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
        // this.setState({
        //   loading: false,
        //   reactModalVisible: true,
        //   modalMessage: "Attachment Added Successfully",
        // });
        successMsg("Attachment uploaded successfully");
        this.getListOfAttachments();
      })
      .catch((error) => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, errors: [errorMessage(error)] });
        // this.timer = setTimeout(() => {
        //   this.setState({ errors: [] });
        // }, SET_TIMEOUT_VALUE);
        errorMsg([errorMessage(error)][0][0]);
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
        successMsg("Attachment deleted successfully");
        this.getListOfAttachments();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  downloadAttachment = (id) => {
    this.setState({ loading: true });
    this.props.client
      .mutate({
        mutation: DOWNLOAD_MITIGATION_ATTACHMENT,
        variables: {
          attachmentId: id,
        },
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        let document = result.data.downloadMitigationAttachment;
        var byteCharacters = atob(document.fileData);

        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        const contentType = mime.lookup(document.fileName.split(".")[1]);

        var blob = new Blob([byteArray], {
          type: contentType,
        });

        FileSaver.saveAs(blob, document.fileName.substr(32));

        this.setState({
          errors: [],
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          errors: [errorMessage(error)],
        });
        this.timer = setTimeout(() => {
          this.setState({ errors: [] });
        }, SET_TIMEOUT_VALUE);
      });
  };
  submitModal = () => {
    this.setState({ reactModalVisible: false }, () => {
      this.getListOfAttachments();
    });
    // this.props.onUpdateUser();
  };
  submitMitigationActivity = () => {
    const { showReassign, activityDetail } = this.state;
    let variables = {};

    variables = {
      name: activityDetail.reassignRemarks,

      mitigationPlanId: parseInt(this.state.mitigationplanId),
      department: activityDetail.department,
      responsible: activityDetail.responsible,
      status: 1,
    };

    this.props.client
      .mutate({
        mutation: CREATE_MITIGATION_ACTIVITY,
        variables: variables,
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        console.log("result", result);
        // this.getListOfActivities();
        successMsg("Mitigation reassigned successfully");

        // this.props.history.push("risk-detail");
        this.props.updateList();
        this.props.toggleMode();
      })
      .catch((error) => {
        console.log("error", error);
        errorMsg([errorMessage(error)][0][0]);
      });
  };

  updataMitigationPlan = () => {
    const { mitigationDetails, name } = this.state;
    console.log("mitiga", mitigationDetails);

    let details = {
      id: mitigationDetails.id,
      name: name,
      responsible: mitigationDetails.responsible.Id,
      status: mitigationDetails.status.statusId,
      department: mitigationDetails.departmentId.Id,
      completionDate: mitigationDetails.completionDate,
    };
    this.props.client
      .mutate({
        mutation: UPDATE_MITIGATION,
        variables: details,
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        console.log(result);
        successMsg("Mitigation plan updated successfully");
        this.props.updateList();
        this.props.toggleMode();
      })
      .catch((error) => {
        errorMsg([errorMessage(error)][0][0]);
      });
  };
  reassign() {
    const {
      activityDetail,
      departmentOptions,
      userOptions,
      showReassign,
      loading,
      activities,
      mitigationDetails,
    } = this.state;
    return (
      <Modal visible={showReassign} effect="fadeInDown" width="900px">
        <div style={{ padding: "15px" }}>
          <div className="modal-content" style={{ border: "none" }}>
            <div
              className="modal-header "
              style={{ display: "-webkit-box", padding: 0, border: "none" }}
            >
              <div className="col-10" style={{ display: "-webkit-box" }}>
                <img src={popupLogo} />

                <h1 className="heading m-l-45 m-b-35">
                  Mitigation Plan Reassign
                </h1>
              </div>
              <div className="col-2 text-right ">
                <a
                  className="link-click"
                  href="#"
                  data-placement="bottom"
                  title="Close"
                  data-toggle="modal"
                  onClick={() => {
                    this.toggleReassign();
                  }}
                >
                  <img src={CloseSvg} />
                  Close
                </a>
              </div>
            </div>
            <div className="modal-body" style={{ paddingTop: 0 }}>
              <div className="row">
                <div className="col-md-6">
                  <TextAreaComponent
                    required
                    label="Remarks"
                    title="remarks"
                    name="reassignRemarks"
                    value={activityDetail.reassignRemarks}
                    placeholder="Enter remarks"
                    handleChange={(e) => {
                      this.handleInput(e);
                    }}
                    validation="required"
                    validator={this.validator}
                  ></TextAreaComponent>
                </div>
                <div className="col-md-3 col-lg-3">
                  <SelectComponent
                    required
                    label="Department"
                    title="department"
                    name="department"
                    options={departmentOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={activityDetail.department}
                    placeholder={"Select Department"}
                    handleChange={(e) => {
                      this.handleInput(e);
                    }}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
                <div className="col-md-3 col-lg-3">
                  <SelectComponent
                    required
                    label="Responsible"
                    title="responsible"
                    name="responsible"
                    options={userOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={activityDetail.responsible}
                    placeholder={"Select Responsible"}
                    handleChange={(e) => {
                      this.handleInput(e);
                    }}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
              </div>
            </div>
            <div className="row" style={{ marginLeft: "15px" }}>
              <ButtonComponent
                className="btn-danger"
                type="button"
                title="Submit"
                onClick={() => {
                  if (this.validator.allValid()) {
                    // this.validator.hideMessages();
                    this.submitMitigationActivity();
                  } else {
                    this.validator.showMessages();
                  }
                }}
              ></ButtonComponent>

              <ButtonComponent
                className="btn-light  ml-3"
                type="button"
                title="Clear"
                onClick={() => {
                  this.clear();
                }}
              ></ButtonComponent>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  toggleReassign() {
    this.setState((prevState) => {
      return {
        showReassign: !prevState.showReassign,
      };
    });
  }
  clear() {
    let activityDetail = {
      reassignRemarks: "",
      responsible: null,
      department: null,
    };
    this.setState({ activityDetail: activityDetail, userOptions: [] });
    this.validator.hideMessages();
    this.getListOfOptions(2);
  }
  componentDidMount() {
    this.getListOfOptions(2);
    this.getUserList();
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
      showReassign,
      name,
    } = this.state;
    return (
      <>
        {showReassign ? this.reassign() : ""}
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
              {/* <label>Mitigation Plan </label>

              <div className="form-control-plaintext word-break">
                {mitigationDetails.name}
              </div> */}
              <TextAreaComponent
                required
                label="Mitigation Plan"
                title="mitigationPlan"
                name="name"
                value={name}
                placeholder="Enter remarks"
                handleChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
                validation="required"
                validator={this.validator}
              ></TextAreaComponent>
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
                  disabled={
                    mitigationDetails &&
                    mitigationDetails.canEdit &&
                    mitigationDetails.canEdit.canEdit
                      ? false
                      : true
                  }
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
                          <span
                            onClick={() => {
                              this.downloadAttachment(data.id);
                            }}
                          >
                            {decodeURI(
                              data.url
                                .substring(data.url.lastIndexOf("/") + 1)
                                .substr(32)
                            ).substring(0, 30)}
                          </span>
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
        {mitigationDetails &&
        mitigationDetails.canEdit &&
        mitigationDetails.canEdit.canEdit ? (
          <div className="row">
            <div className="col-md-12 col-lg-8">
              <ButtonComponent
                className="btn-danger"
                type="button"
                title="Submit"
                onClick={() => {
                  // this.validator.hideMessages();
                  debugger;
                  if (this.validator.fields.mitigationPlan) {
                    this.updataMitigationPlan();
                    this.validator.hideMessages();
                  } else {
                    this.validator.showMessages();
                  }
                }}
              ></ButtonComponent>

              <ButtonComponent
                className="btn-light  ml-3"
                type="button"
                title="Reset"
                onClick={() => {
                  this.setState({ name: mitigationDetails.name });
                }}
              ></ButtonComponent>
              <ButtonComponent
                className="btn-light  ml-3"
                type="button"
                title="Reassign"
                onClick={() => {
                  this.toggleReassign();
                }}
              ></ButtonComponent>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}
export default withApollo(MitigationView);
