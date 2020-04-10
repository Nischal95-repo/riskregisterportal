import React from "react";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";

import { getListofInfoForViewQuery } from "../../services/graphql/queries/document-upload";
import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import { getListofGenericMasterQuery } from "../../services/graphql/queries/user";

import Pagination from "../Common/Pagination";
import NotAccessible from "../Common/NotAccessible";
import ReactModal from "../Common/ReactModal";

import { PAGINATION_OFFSET_VALUE, DO_NOT_ACCESS_MESSAGE }  from "../../constants/app-constants";
import DocumentFilter from "./DocumentFilter";

const INFO_UPLOAD_MODULE_ID = 7;
const INFO_UPLOAD_FEATURE_ID = 191;

const INFO_UPLOAD_MASTER_FOR_CATEGORY_ID = 16;

class DocumentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error:"",
      pageOfItems:[],
      currentPage: 1,
      offset: PAGINATION_OFFSET_VALUE,

      categoryOption:[],
      showFilter: false,
      isFilterApply: false,
      filterData: {},
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: DO_NOT_ACCESS_MESSAGE,
      accessSpecifier: {}
    };
    this.submitModal = this.submitModal.bind(this);
    this.filterAction = this.filterAction.bind(this);
    this.onFilterData = this.onFilterData.bind(this);
  }

  submitModal() {
    this.setState({ reactModalVisible: false });
  }

  onAddDocument() {
    if (this.state.accessSpecifier.createP) {
      // redirectTo("/document-add");
      this.props.history.push("/info-add");
    } else {
      this.setState({ reactModalVisible: true });
    }
  }

  onFilterData(data, isFilterApply) {
    this.setState({
      isFilterApply: isFilterApply,
      filterData: data,
      currentPage: 1
    });
    if (isFilterApply) {
      this.getListOfDocuments(this.state.offset, 1, data);
    } else {
      this.setState({
        filterData: {}
      });
      this.getListOfDocuments(this.state.offset, 1);
    }
  }

  filterAction() {
    this.setState(prevState => {
      return {
        showFilter: !prevState.showFilter
      };
    });
  }

  onChangePage(currentPage) {
    // update state with new page of items
        this.setState({
      currentPage: currentPage,
      loading: true,
    },()=>{
      if (this.state.isFilterApply) {
        this.getListOfDocuments(
          this.state.offset,
          currentPage,
          this.state.filterData
        );
      } else {
        this.getListOfDocuments(this.state.offset, currentPage);
      }
    });
  }

  getListOfCategory(id){
    this.props.client
      .query({
        query: getListofGenericMasterQuery,
        variables: {
          masterFor: id
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var option = result.data.getListofGenericMaster;

        this.initialState = {
          categoryOption: option
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  getListOfDocuments(offset, pageNo, data){
    this.props.client
      .query({
        query: getListofInfoForViewQuery,
        variables: {
          offset: offset,
          pageNo: pageNo,
          documentId: data && data.documentId ? data.documentId : null,
          status: 1,
          categoryId: data && data.categoryId ? data.categoryId : null,
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        var document = result.data.getListOfInfoDocumentsForReview;
        
        this.initialState = {
          pageOfItems: document
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        this.setState({ loading: false, error: error.message });
      });
  }

  componentDidMount(){
    this.setState({
      loading: true
    });

    this.props.client
      .query({
        query: getAccessPermisionQuery,
        variables: {
          moduleId: INFO_UPLOAD_MODULE_ID
        },
        fetchPolicy: "network-only"
      })
      .then(result => {
        let response = result.data.getFunctionByModuleId;
        response = JSON.parse(response);
        this.setState({
          accessSpecifier: response[INFO_UPLOAD_FEATURE_ID]
        });
        this.getListOfCategory(INFO_UPLOAD_MASTER_FOR_CATEGORY_ID);
        this.getListOfDocuments(this.state.offset, this.state.currentPage);   
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error.message
        });
      });
  }

  render() {
    const {
      loading,
      error,
      accessSpecifier,
      reactModalVisible,
      requireCancel,
      modalMessage,
      pageOfItems,
      categoryOption,
    } = this.state;
    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    return (
        <>
          {accessSpecifier && accessSpecifier.viewP ? (
          <div>
            <ReactModal
              reactModalVisible={reactModalVisible}
              submitModal={this.submitModal}
              modalMessage={modalMessage}
              requireCancel={requireCancel}
            />
            <div className="row align-items-center no-gutters">
                <div className="col-md-8">
                    <h1 className="heading m-b-0">Info List </h1>
                </div>
                <div className="col-md-4 text-right">
                    <button className="btn btn-primary filter-btn  m-l-10" onClick={this.filterAction}>Filter</button>
                    <DocumentFilter 
                        showFilter={this.state.showFilter}
                        filterData={this.state.filterData}
                        listData={this.onFilterData}
                        filterAction={this.filterAction}
                        categoryOption={categoryOption}
                    />
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-style-1 m-t-35">
                    <thead>
                        <tr>
                            <th scope="col">INFO ID</th>
                            <th scope="col">TITLE</th>
                            <th scope="col">CATEGORY</th>
                            <th scope="col">COMPANY</th>
                            <th scope="col">PROJECT</th>
                            <th scope="col">STATUS</th>
                            <th scope="col">ACTION(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageOfItems.length ?
                          pageOfItems.map((data,index)=>{
                            return(
                              <tr key={index}>
                                <td>{data.Id}</td>
                                <td>{data.title}</td>
                                <td>{data.categoryDetail && data.categoryDetail.description ? data.categoryDetail.description : ""}</td>
                                <td>{data.companyDetail && data.companyDetail.description ? data.companyDetail.description : ""}</td>
                                <td>{data.projectDetail && data.projectDetail.description ? data.projectDetail.description : ""}</td>
                                <td>{data.statusDetail.length ? data.statusDetail[0].name : ""}</td>
                                <td><a href={"/view-info-detail?id="+data.Id} className="link-primary" data-toggle="tooltip" data-placement="bottom" title="View">
                                    <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16">
                                    <g transform="translate(0, 0)">
                                        <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="4.5" y1="11.5" x2="11.5" y2="11.5" data-color="color-2" />
                                        <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="4.5" y1="8.5" x2="11.5" y2="8.5" data-color="color-2" />
                                        <line fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} x1="4.5" y1="5.5" x2="6.5" y2="5.5" data-color="color-2" />
                                        <polygon fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="9.5,0.5 1.5,0.5 1.5,15.5 14.5,15.5 14.5,5.5 " />
                                        <polyline fill="none" stroke="#69951a" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} points="9.5,0.5 9.5,5.5 14.5,5.5 " />
                                    </g>
                                    </svg>
                                  </a>
                                </td>
                              </tr>
                            )
                          })
                          :null}
                    </tbody>
                </table>
            </div>
            {!pageOfItems.length && error ? <div>{error}</div> : null}
            {!pageOfItems.length && loading ? <div>Fetching...</div> : null}
            {!pageOfItems.length && !error && !loading ? (
            <div style={{ textAlign: "center" }}>No Data</div>
            ) : null}
            <Pagination
                loading={loading}
                items={pageOfItems}
                pageSize={this.state.offset}
                initialPage={this.state.currentPage}
                onChangePage={this.onChangePage.bind(this)}
            />
          </div>
        ) : (
          <NotAccessible />
        )}
        </>
    );
  }
}
export default withRouter(withApollo(DocumentsList));