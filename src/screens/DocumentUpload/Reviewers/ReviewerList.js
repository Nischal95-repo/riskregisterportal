import React from "react";

import { withApollo } from "react-apollo";

import { getReviewersListQuery, removeReviewers } from "../../../services/graphql/queries/document-upload";

import ReactModal from "../../Common/ReactModal";
import DisplayErrors from "../../Common/DisplayErrors";


import { SET_TIMEOUT_VALUE } from "../../../constants/app-constants";

import { errorMessage } from "../../../miscellaneous/error-messages";



class ReviewerList extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loading:false,
            errors:[],
            reviewers:[],
            deleteId:'',
            reactModalVisible: false,
            requireCancel: false,
            modalMessage: "",
            requireCancel:true
        }
        this.submitModal = this.submitModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    submitModal() {
        this.props.client
            .mutate({
                mutation: removeReviewers,
                variables: {
                    id: this.state.deleteId
                },
                fetchPolicy: "no-cache"
            })
            .then(result => {
                this.setState({ reactModalVisible: false });
                this.getListOfReviewers();
            })
            .catch(error => {
                console.log("~~~error: ", error);
                this.setState({ loading: false, errors: [errorMessage(error)] });
                this.timer = setTimeout(() => {
                this.setState({ errors: [] });
                }, SET_TIMEOUT_VALUE);
            });
    }
    
    closeModal(){
        this.setState({ reactModalVisible: false, deleteId: ''});
    }

    onRemoveReviewer(id){
        this.setState({ reactModalVisible: true, modalMessage:"Are you sure, you want to delete this reviewer?", deleteId: id });
        
    }

    compare(a, b) {
        const bandA = a.userDetail.name.toUpperCase();
        const bandB = b.userDetail.name.toUpperCase();
        let comparison = 0;
        if (bandA > bandB) {
          comparison = 1;
        } else if (bandA < bandB) {
          comparison = -1;
        }
        return comparison;
    }

    getListOfReviewers(){
        this.setState({ loading: true });
        this.props.client
        .query({
            query: getReviewersListQuery,
            variables: {
                documentId: this.props.document.Id
            },
            fetchPolicy: "network-only"
        })
        .then(result => {
            var reviewers = result.data.getListOfReviewers;
            reviewers = reviewers.sort((a,b)=>this.compare(a,b));

            this.initialState = {
                reviewers: reviewers
            };
            this.setState({ ...this.initialState, loading: false, error: "" });
        })
        .catch(error => {
            this.setState({ loading: false, error: error.message });
        });
    }

    componentDidMount(){
        this.getListOfReviewers();
    }

    render() {
        const { loading, errors, reviewers, reactModalVisible, requireCancel,   modalMessage, } = this.state;
        const { document } = this.props;
        return (
            <div className="p-t-0" id="showlistDiv">
                <ReactModal
                    reactModalVisible={reactModalVisible}
                    submitModal={this.submitModal}
                    modalMessage={modalMessage}
                    requireCancel={requireCancel}
                    closeModal={this.closeModal}
                />
                <div className="row align-items-center">
                    <div className="col-md-10">
                        <h1 className="heading m-b-0">
                        Reviewer List View
                        </h1>
                        <div
                            className="row"
                            style={{
                                display: errors.length === 0 ? "none" : "block"
                            }}
                            >
                            <div className="col-md-6">
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
                    <div className="col-md-2 text-right">
                        {document && document.status && (document.status == 4 ||document.status == 1 || document.status == 2)?<a href="#" onClick={this.props.toggleMode} className="link-click ">
                        <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enableBackground="new 0 0 16 16" xmlSpace="preserve">
                            <g>
                            <circle fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" cx={8} cy={8} r="7.5" />
                            <g>
                                <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="2.5" y1={8} x2="13.5" y2={8} />
                                <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1={8} y1="2.5" x2={8} y2="13.5" />
                            </g>
                            </g>
                        </svg>
                        Add</a>:null}
                    </div>
                </div>
                {/* <div className="alert alert-success p-0 m-t-10 m-b-0" role="alert">
                    <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16">
                        <g transform="translate(0, 0)">
                        <path fill="none" stroke="#8dc43f" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M13.423,6.999 C13.474,7.325,13.5,7.66,13.5,8c0,3.59-2.91,6.5-6.5,6.5S0.5,11.59,0.5,8S3.41,1.5,7,1.5c1.082,0,2.102,0.264,3,0.732" data-cap="butt" />
                        <polyline fill="none" stroke="#8dc43f" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="4,6.5 7,9.5 15,1.5 " data-cap="butt" data-color="color-2" />
                        </g>
                    </svg>
                    <span className="success-link">Success</span>
                </div> */}
                {/* Table Section Start */}
                <div className="table-responsive" style={{maxHeight: '52vh'}}>
                    <table className="table table-style-1 m-t-35">
                        <thead>
                            <tr>
                                <th scope="col" width={400}>
                                NAME
                                </th>
                                <th scope="col" width={400}>EMAIL ID</th>
                                <th scope="col" width={420}>ACTION(s)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviewers.length?reviewers.map((reviewer,index)=>{
                                return(
                                    <tr>
                                        <td>{reviewer.userDetail && reviewer.userDetail.name?reviewer.userDetail.name:""}</td>
                                        <td>{reviewer.userDetail && reviewer.userDetail.emailId?reviewer.userDetail.emailId:""}</td>
                                        <td>
                                        {document && document.status && (document.status == 4 ||document.status == 1 || document.status == 2)?<a href="#" className="link-delete m-l-45" data-toggle="tooltip" data-placement="bottom" title="Delete">
                                            <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" onClick={()=>this.onRemoveReviewer(reviewer.Id)}>
                                            <g transform="translate(0, 0)">
                                                <path fill="none" stroke="#61951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} d="M2.5,6.5v7 c0,1.105,0.895,2,2,2h8c1.105,0,2-0.895,2-2v-7" />
                                                <line data-color="color-2" fill="none" stroke="#61951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="1.5" y1="3.5" x2="15.5" y2="3.5" />
                                                <polyline data-color="color-2" fill="none" stroke="#61951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points=" 6.5,3.5 6.5,0.5 10.5,0.5 10.5,3.5 " />
                                                <line fill="none" stroke="#61951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="8.5" y1="7.5" x2="8.5" y2="12.5" />
                                                <line fill="none" stroke="#61951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="11.5" y1="7.5" x2="11.5" y2="12.5" />
                                                <line fill="none" stroke="#61951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="5.5" y1="7.5" x2="5.5" y2="12.5" />
                                            </g>
                                            </svg>
                                        </a>:null}
                                        </td>
                                    </tr>
                                )
                            }):null}
                        </tbody>
                    </table>
                    {!reviewers.length && !loading ? (
                                <div style={{ textAlign: "center" }}>No Data</div>) : null}
                </div>
                {/* Table Section End */}
            </div>
        );
    }
  }
  
  export default withApollo(ReviewerList);  