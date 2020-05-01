import React from "react";
import InputComponent from "../Common/form-component/InputComponent";
import ButtonComponent from "../Common/form-component/ButtonComponent";
import TextAreaComponent from "../Common/form-component/TextAreComponent";
import SelectComponent from "../Common/form-component/SelectComponent";
import SimpleReactValidator from "simple-react-validator";
import { getListofGenericMasterQuery } from "../../services/graphql/queries/user";
import { getListofProjectsByCompanyId } from "../../services/graphql/queries/document-upload";
import {
  UPDATE_RISK_REGISTER,
  CREATE_RISK_ATTACHMENT,
  DELETE_RISK_ATTACHMENT,
  RISK_ATTACHMENTS,
  DOWNLOAD_RISK_ATTACHMENT,
} from "../../services/graphql/queries/riskRegister";
import ReactModal from "../Common/ReactModal";
import { format } from "date-fns";
import CloseSvg from "../../static/images/svg/Close.svg";

import { withApollo } from "react-apollo";

import {
  SET_TIMEOUT_VALUE,
  dateInputFormat,
  MAX_DOC_UPLOAD_SIZE,
} from "../../constants/app-constants";
import { errorMessage } from "../../miscellaneous/error-messages";
import { toast } from "react-toastify";
import { errorMsg, successMsg } from "../Common/alert";

// import "react-toastify/dist/ReactToastify.min.css";
const FileSaver = require("file-saver");
const mime = require("mime-types");

const impAndProbOptions = [
  { Id: 1, label: "Low" },
  { Id: 2, label: "Medium" },
  { Id: 3, label: "High" },
];
const statusOptions = [
  { Id: 2, label: "Open" },
  { Id: 1, label: "Closed" },
];
// toast.configure({
//   autoClose: 8000,
//   draggable: false,
//   //etc you get the idea
// });
class EditRiskRegister extends React.Component {
  constructor() {
    super();
    this.state = {
      riskDetail: {
        company: null,
        project: null,
        riskCategory: null,
        name: "",
        description: "",
        impact: "",
        probability: "",
        severity: "",
        id: null,
        status: null,
        currentControls: "",
        upsidePotential: "",
        riskregisterattachmentSet: [],
        residualImpact: "",
        residualProbability: "",
        residualSeverity: "",
      },
      fileinput: null,
      attachmentDetail: {
        fileData: "",
        fileName: "",
        fileType: "",
      },
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: "Updated Successfully",
      companyOptions: [],

      projectOptions: [],

      riskOptions: [],
    };

    this.validator = new SimpleReactValidator({
      autoForceUpdate: this,
      element: (message) => <div style={{ color: "red" }}>{message}</div>,
    });
  }
  handleInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    if (
      name !== "name" &&
      name !== "description" &&
      name !== "upsidePotential" &&
      name !== "currentControls" &&
      value !== ""
    )
      value = parseInt(value);
    this.setState(
      (prevState) => {
        return {
          riskDetail: {
            ...prevState.riskDetail,
            [name]: value,
          },
        };
      },
      () => {
        if (name == "impact" || name == "probability") {
          console.log(
            this.state.riskDetail.probability,
            this.state.riskDetail.impact
          );
          let severity = this.state.riskDetail.probability;
          if (
            this.state.riskDetail.impact > this.state.riskDetail.probability
          ) {
            severity = this.state.riskDetail.impact;
          }
          this.setState((prevstate) => {
            return {
              riskDetail: {
                ...prevstate.riskDetail,
                severity: severity,
              },
            };
          });
        }
        if (name == "residualImpact" || name == "residualProbability") {
          console.log(
            this.state.riskDetail.residualProbability,
            this.state.riskDetail.residualImpact
          );
          let severity = this.state.riskDetail.residualProbability;
          if (
            this.state.riskDetail.residualImpact >
            this.state.riskDetail.residualProbability
          ) {
            severity = this.state.riskDetail.residualImpact;
          }
          this.setState((prevstate) => {
            return {
              riskDetail: {
                ...prevstate.riskDetail,
                residualSeverity: severity,
              },
            };
          });
        }
      }
    );
  };

  handleCompany = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    this.setState((prevState) => {
      return {
        riskDetail: {
          ...prevState.riskDetail,
          [name]: value != "" ? parseInt(value) : value,
        },
      };
    });
    this.setState({ project: "" });
    this.getProjectOptions(value);
  };
  getProjectOptions(value) {
    this.props.client
      .query({
        query: getListofProjectsByCompanyId,
        variables: {
          companyId: parseInt(value),
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var projectList = result.data.getListOfProjectsByCompanyId;
        let projArr = [];
        projectList.forEach((element) => {
          let obj = {
            Id: element.projectDetail.Id,
            label: element.projectDetail.description,
          };
          projArr.push(obj);
        });
        this.initialState = {
          projectOptions: projArr,
          project: "",
        };
        this.setState({
          ...this.initialState,
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  }
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
            riskOptions: OptionArr,
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
        mutation: CREATE_RISK_ATTACHMENT,
        variables: {
          riskId: this.state.riskDetail.id,
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
        this.getListOfAttachments();
        successMsg("Attachment uploaded successfully");
      })
      .catch((error) => {
        console.log("~~~error: ", error);
        this.setState({ loading: false });
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
        query: RISK_ATTACHMENTS,
        variables: {
          riskId: this.state.riskDetail.id,
        },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        var attachmentlist = result.data.getListOfAttachmentsByRiskId;
        this.setState((prevState) => {
          return {
            riskDetail: {
              ...prevState.riskDetail,
              riskregisterattachmentSet: attachmentlist,
            },
          };
        });
      })
      .catch((error) => {
        this.setState({ loading: false, error: error.message });
      });
  }
  deleteAttachment = (id) => {
    // this.state.riskDetail.companyId = parseInt(this.state.riskDetail.companyId);
    // this.state.riskDetail.categoryId = parseInt(this.state.riskDetail.categoryId);
    // this.state.riskDetail.projectId = parseInt(this.state.riskDetail.projectId);
    this.props.client
      .mutate({
        mutation: DELETE_RISK_ATTACHMENT,
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
        errorMsg([errorMessage(error)][0][0]);
      });
  };

  downloadAttachment = (id) => {
    this.setState({ loading: true });
    this.props.client
      .mutate({
        mutation: DOWNLOAD_RISK_ATTACHMENT,
        variables: {
          attachmentId: id,
        },
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        let document = result.data.downloadRiskAttachment;
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
        // this.setState({
        //   loading: false,
        //   errors: [errorMessage(error)],
        // });
        // this.timer = setTimeout(() => {
        //   this.setState({ errors: [] });
        // }, SET_TIMEOUT_VALUE);
        errorMsg([errorMessage(error)][0][0]);
      });
  };
  submitRisk = () => {
    // this.state.riskDetail.companyId = parseInt(this.state.riskDetail.companyId);
    // this.state.riskDetail.categoryId = parseInt(this.state.riskDetail.categoryId);
    // this.state.riskDetail.projectId = parseInt(this.state.riskDetail.projectId);
    this.props.client
      .mutate({
        mutation: UPDATE_RISK_REGISTER,
        variables: this.state.riskDetail,
        fetchPolicy: "no-cache",
      })
      .then((result) => {
        console.log("result", result);
        // toast.success("Updated successfully", {
        //   className: "success",
        //   hideProgressBar: false,
        // });
        // this.setState({ reactModalVisible: true });
        successMsg("Updated successfully");
        this.props.riskUpdate();
        this.props.changeMode();
      })
      .catch((error) => {
        console.log("error", error);

        errorMsg([errorMessage(error)][0][0]);
      });
  };

  reset() {
    this.updateData();
    this.validator.hideMessages();
  }
  updateData() {
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
      status,
      currentControls,
      upsidePotential,
      residualImpact,
      residualProbability,
      residualSeverity,
      createdBy,
      createdOn,
      lastModifiedBy,
      lastModifiedOn,
    } = this.props.riskDetails;

    const riskDetail = {
      name: name,
      riskCategory: categoryId.Id,
      project: projectId.Id,
      company: companyId.Id,
      impact: impact,
      probability: probability,
      severity: severity,
      description: description,
      id: id,
      status: status,
      currentControls: currentControls,
      upsidePotential: upsidePotential,
      residualSeverity: residualSeverity,
      residualProbability: residualProbability,
      residualImpact: residualImpact,
    };
    this.setState({ riskDetail: riskDetail }, () => {
      this.getListOfAttachments();
    });
    this.getProjectOptions(companyId.Id);
  }
  submitModal = () => {
    const modalMessage = this.state.modalMessage;
    this.setState({ reactModalVisible: false }, () => {
      if ("Attachment Added Successfully" !== modalMessage) {
        this.props.riskUpdate();
        this.props.changeMode();
      } else {
        this.getListOfAttachments();
      }
    });
    // this.props.onUpdateUser();
  };
  componentDidMount() {
    this.getListOfOptions(18);
    this.getListOfOptions(3);
    this.updateData();
  }

  render() {
    const {
      riskDetail,
      riskOptions,
      companyOptions,
      projectOptions,
      reactModalVisible,
      requireCancel,
      modalMessage,
    } = this.state;
    return (
      <div>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
        />
        <h1 className="heading m-b-10">Risk Updation</h1>
        <div className="row">
          <div className="col-md-12">
            {/* Form Section start */}
            <div className="box-card">
              <div className="row">
                <div className="col-md-4 col-lg-3">
                  <InputComponent
                    label="Risk"
                    required
                    title="Risk"
                    name="name"
                    value={riskDetail.name}
                    placeholder="Enter Name"
                    validator={this.validator}
                    handleChange={(e) => {
                      this.handleInput(e);
                    }}
                    validation="required"
                  ></InputComponent>
                </div>
                <div className="col-md-4 col-lg-3">
                  <SelectComponent
                    required
                    label="Risk Category"
                    title={"risk category"}
                    name="riskCategory"
                    options={riskOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    default={false}
                    value={riskDetail.riskCategory}
                    placeholder={"Select Risk Category"}
                    handleChange={(e) => {
                      this.handleInput(e);
                    }}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
                <div className="col-md-3">
                  <SelectComponent
                    required
                    label="Company"
                    title={"company"}
                    name="company"
                    options={companyOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={riskDetail.company}
                    placeholder={"Select Company"}
                    handleChange={(e) => {
                      this.handleCompany(e);
                    }}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
                <div className="col-md-3">
                  <SelectComponent
                    required
                    label="Project"
                    title={"project"}
                    name="project"
                    options={projectOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={riskDetail.project}
                    placeholder={"Select Project"}
                    handleChange={this.handleInput}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <SelectComponent
                    required
                    label="Impact"
                    title={"impact"}
                    name="impact"
                    options={impAndProbOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={riskDetail.impact}
                    placeholder={"Select Impact"}
                    handleChange={this.handleInput}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <SelectComponent
                    required
                    label="Probability"
                    title={"probability"}
                    name="probability"
                    options={impAndProbOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={riskDetail.probability}
                    placeholder={"Select Probability"}
                    handleChange={this.handleInput}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Severity</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={
                        riskDetail.severity == 1
                          ? "Low"
                          : riskDetail.severity == 2
                          ? "Medium"
                          : riskDetail.severity == 3
                          ? "High"
                          : ""
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <SelectComponent
                    required
                    label="Status"
                    title={"status"}
                    name="status"
                    options={statusOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={riskDetail.status}
                    placeholder={"Select Status"}
                    handleChange={this.handleInput}
                    validator={this.validator}
                    validation="required"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <SelectComponent
                    label="Residual Impact"
                    title={"impact"}
                    name="residualImpact"
                    options={impAndProbOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={riskDetail.residualImpact}
                    placeholder={"Select Impact"}
                    handleChange={this.handleInput}
                    // validator={this.validator}
                    // validation="required"
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <SelectComponent
                    label="Residual Probability"
                    title={"residual probability"}
                    name="residualProbability"
                    options={impAndProbOptions}
                    optionKey={"label"}
                    valueKey={"Id"}
                    value={riskDetail.residualProbability}
                    placeholder={"Select Probability"}
                    handleChange={this.handleInput}
                    // validator={this.validator}
                    // validation="required"
                  />
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="form-group">
                    <label>Residual Severity</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={
                        riskDetail.residualSeverity == 1
                          ? "Low"
                          : riskDetail.residualSeverity == 2
                          ? "Medium"
                          : riskDetail.residualSeverity == 3
                          ? "High"
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-lg-3">
                  <InputComponent
                    label="Upside Potential"
                    title="Upside Potential"
                    name="upsidePotential"
                    value={riskDetail.upsidePotential}
                    placeholder="Enter Upside Potential"
                    handleChange={(e) => {
                      this.handleInput(e);
                    }}
                  ></InputComponent>
                </div>
                <div className="col-md-4 col-lg-3">
                  <InputComponent
                    label="Current Controls"
                    title="Current Controls"
                    name="currentControls"
                    value={riskDetail.currentControls}
                    placeholder="Enter Current Controls"
                    handleChange={(e) => {
                      this.handleInput(e);
                    }}
                  ></InputComponent>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <div className="form-group">
                    <TextAreaComponent
                      required
                      label="Impact/Description"
                      title="description"
                      name="description"
                      value={riskDetail.description}
                      placeholder="Enter description"
                      handleChange={this.handleInput}
                      validation="required"
                      validator={this.validator}
                    ></TextAreaComponent>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 ">
                  <div className="row" style={{ paddingLeft: "10px" }}>
                    <label />
                    <div
                      className="upload-btn-wrapper"
                      style={{ marginTop: "25px" }}
                    >
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
                      {riskDetail.riskregisterattachmentSet &&
                      riskDetail.riskregisterattachmentSet.length
                        ? riskDetail.riskregisterattachmentSet.map(
                            (data, index) => {
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
                                        .substring(
                                          data.url.lastIndexOf("/") + 1
                                        )
                                        .substr(32)
                                    ).substring(0, 30)}
                                  </span>
                                  <img
                                    src={CloseSvg}
                                    title="Delete"
                                    onClick={() =>
                                      this.deleteAttachment(data.id)
                                    }
                                  />
                                </li>
                              );
                            }
                          )
                        : null}
                    </ol>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-8">
                  <ButtonComponent
                    className="btn-danger"
                    type="button"
                    title="Submit"
                    onClick={() => {
                      if (this.validator.allValid()) {
                        // this.validator.hideMessages();
                        this.submitRisk();
                      } else {
                        this.validator.showMessages();
                        // rerender to show messages for the first time
                        // you can use the autoForceUpdate option to do this automatically`
                        this.forceUpdate();
                      }
                    }}
                  ></ButtonComponent>

                  <ButtonComponent
                    className="btn-light  ml-3"
                    type="button"
                    title="Reset"
                    onClick={() => {
                      this.reset();
                    }}
                  ></ButtonComponent>
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

export default withApollo(EditRiskRegister);
