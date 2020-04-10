import React from "react";
import ReactModal from "../../Common/ReactModal";
import DisplayErrors from "../../Common/DisplayErrors";

import { withApollo } from "react-apollo";

import { getListOfInfoAttachmentsQuery, createInfoAttachmentQuery, deleteAttachmentQuery, downloadInfoAttachmentQuery } from "../../../services/graphql/queries/document-upload";

import { SET_TIMEOUT_VALUE } from "../../../constants/app-constants";

import { errorMessage } from "../../../miscellaneous/error-messages";

const FileSaver = require("file-saver");
const mime = require("mime-types");

class Version extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loading:false,
            errors:[],
            document: props.document,
            attachmentDetail:{
                fileData: "",
                fileName: "",
                fileType: ""
            },
            attachments:[],
            tempAttachmentsArr:[],
            fileinput: null,
            deleteId:'',
            reactModalVisible: false,
            requireCancel: false,
            modalMessage: "",
            attachmentId:"",
        }
        this.submitModal = this.submitModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    submitModal() {
        if(!this.state.deleteId)
            this.setState({ reactModalVisible: false, modalMessage: "" });
        else{
            this.setState({reactModalVisible: false, modalMessage: "", requireCancel: false,});
            this.props.client
                .mutate({
                    mutation: deleteAttachmentQuery,
                    variables: {
                        attachmentId: this.state.deleteId,
                        versionNo : this.state.versionDetail.versionNo
                    },
                    fetchPolicy: "no-cache"
                })
                .then(result => {
                    // alert("Deleted successfully");
                    this.setState({ deleteId: '' });
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

    closeModal(){
        this.setState({ reactModalVisible: false, requireCancel:false, modalMessage: "", deleteId: ''});
    }



    isAcceptedFile(file){
        let fileName = file.name;
        if(fileName.includes(".xlsx") ||fileName.includes(".xls") ||fileName.includes(".csv") || fileName.includes(".doc") || fileName.includes(".docx") || fileName.includes(".ppt") || fileName.includes(".pptx") || fileName.includes(".pdf")){
            return true;
        }else{
            this.setState({errors: ["Please upload only these file types .xlsx, .xls, .csv, .doc, .docx, .ppt, .pptx, .pdf"]});
            this.timer = setTimeout(() => {
                this.setState({ errors: [] });
            }, SET_TIMEOUT_VALUE);
            return false;
        }
    }

    validateSize = file => {
        var FileSize = file.size / 1024; // in KB
        console.log("img size", FileSize, file.size);
        if (FileSize > 2048) {
          this.setState({ errors: ["Max file upload size is 2 MB"] });
          setTimeout(() => {
            this.setState({ errors: [] });
          }, SET_TIMEOUT_VALUE);
          return false;
        } else {
          return true;
        }
    }

    uploadFile(fileData, fileName, fileType) {
        // console.log("filenaM",fileName)
        var imgName = fileName;
        var imgData = fileData;
        var imgType = fileType;
        let attachmentDetail = {
            fileData: imgData,
            fileName: imgName,
            fileType: imgType,
        }
        this.setState(prev => {
          return {
            attachmentDetail: {
              ...prev.attachmentDetail,
              fileData: imgData,
              fileName: imgName,
              fileType: imgType
            }
          };
        },
        ()=>{
            console.log("fileData", this.state.attachmentDetail);
            this.uploadFileApollo();
        });
    }

    uploadFileApollo() {
        this.props.client
          .mutate({
            mutation: createInfoAttachmentQuery,
            variables: {
                documentId: this.state.document.Id,
                data: [this.state.attachmentDetail]
            }
          })
          .then(result => {
            // alert("Document Created successfully");
            this.setState({ reactModalVisible: true, modalMessage: "Attachment Added Successfully" });
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

    getListOfAttachments(){
        this.setState({loading:true});
        this.props.client
            .query({
                query: getListOfInfoAttachmentsQuery,
                variables: { 
                    documentId: parseInt(this.props.document.Id),
                },
                fetchPolicy: "network-only"
            })
            .then(result => {
                const attachments = result.data.getListOfInfoAttachmentsByDocumentId;

                this.initialState = {
                    attachments: attachments
                };
                this.setState({ ...this.initialState, attachments: attachments, loading: false, error: "" });
            })
            .catch(error => {
                console.log("~~~error: ", error);
                this.setState({ loading: false, errors: [errorMessage(error)] });
                this.timer = setTimeout(() => {
                    this.setState({ errors: [] });
                    }, SET_TIMEOUT_VALUE);
            });
    }

    deleteAttachment(id){
        this.setState({reactModalVisible: true, requireCancel: true, modalMessage: "Are you sure, you want to delete this attachment?", deleteId: id});
    }

    downloadAttachment(id) {
        this.setState({loading: true});
        this.props.client
          .mutate({
            mutation: downloadInfoAttachmentQuery,
            variables: {
                attachmentId: id,
            },
            fetchPolicy: "no-cache"
          })
          .then(result => {
            let document = result.data.downloadInfoAttachment;
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

    componentDidMount(){
        this.getListOfAttachments();
    }

    
    componentDidUpdate(prevProps){
        if(prevProps.document !== this.props.document ){
            this.setState({document: this.props.document},()=>{
                this.getListOfAttachments();
            });
        }
    }
    
    render() {
        const { loading, errors, attachments,reactModalVisible, requireCancel, modalMessage } = this.state;
        return (
            <div className="tab-pane fade show active" id="doc" role="tabpanel" aria-labelledby="doc-tab">
                <ReactModal
                    reactModalVisible={reactModalVisible}
                    submitModal={this.submitModal}
                    modalMessage={modalMessage}
                    requireCancel={requireCancel}
                    closeModal={this.closeModal}
                />
                <div className="box-card" id="exist-version">
                <div className="row">
                    <div className="col-md-12">
                    <div className="row align-items-center">
                        <div className="col-md-10">
                            <h1 className="heading">Attachments</h1>
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
                    {/* <div className="text-right">
                        <div className="upload-btn-wrapper">
                            <a className="link-click" href="#" data-toggle="tooltip" data-placement="bottom" title="Upload" style={{fontSize: "16px"}} onClick={() => {
                                        this.state.fileinput.click();
                                    }}>
                            <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enableBackground="new 0 0 16 16" xmlSpace="preserve">
                                <g>
                                <circle fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" cx={8} cy={8} r="7.5" />
                                <g>
                                    <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="2.5" y1={8} x2="13.5" y2={8} />
                                    <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1={8} y1="2.5" x2={8} y2="13.5" />
                                </g>
                                </g>
                            </svg>{" Add Attachments"}
                            </a>
                            <input 
                                type="file" 
                                id="uploadAttachments"
                                hidden
                                name="attachments"
                                // accept="image/gif,image/jpeg,image/png"
                                accept=".xlsx, .xls, .csv, .doc, .docx, .ppt, .pptx, .pdf"
                                ref={fileinput => {
                                    this.state.fileinput = fileinput;
                                }}
                                onChange={e => {
                                if(this.isAcceptedFile(e.target.files[0])){
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
                    </div> */}
                    {loading?
                    <div
                        className="loadersmall"
                        style={{ marginLeft: "50%" }}
                    />
                    :
                    <div className="table-responsive">
                        <table className="table table-style-1 ">
                            <thead>
                                <tr>
                                    <th scope="col" width={400}>FILE NAME</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attachments.length?
                                    attachments.map((attachment, index)=>{
                                        return(
                                            <tr key={index}>
                                                <td>
                                                    <a
                                                        href="#"
                                                        data-toggle="tooltip" data-placement="bottom" title="Download"
                                                        style={{textDecoration:"underline"}}
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
                                                </td>
                                            </tr>
                                        )
                                    })
                                :null}
                            </tbody>
                        </table>
                    </div>}
                    {!attachments.length && !errors.length && !loading ? (
                        <div style={{ textAlign: "center" }}>No Data</div>
                        ) 
                    : null}
                    </div>
                </div>
                </div>
            </div>
        );
    }
  }
  
  export default withApollo(Version);