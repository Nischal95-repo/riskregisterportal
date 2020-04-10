import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { withApollo } from "react-apollo";
import queryString from "query-string";

import { getAccessPermisionQuery } from "../../services/graphql/queries/accessPermission";
import { getInfoById } from "../../services/graphql/queries/document-upload";

import ReactModal from "../Common/ReactModal";
import NotAccessible from "../Common/NotAccessible";

import { DO_NOT_ACCESS_MESSAGE } from "../../constants/app-constants";

import DocumentView from "./DocumentView";
import DocumentEdit from "./DocumentEdit";
import DocumentDetails from "./DocumentDetails";

const INFO_UPLOAD_MODULE_ID = 7;

const INFO_UPLOAD_FEATURE_ID = 191;

class DocumentProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: "",
      editMode: false,
      document: {},
      reactModalVisible: false,
      requireCancel: false,
      modalMessage: DO_NOT_ACCESS_MESSAGE,
      accessSpecifier: {}
    };
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.onUpdateDocument = this.onUpdateDocument.bind(this);

  }

  toggleEditMode(mode) {
    this.setState({ editMode: !this.state.editMode });
  }

  onUpdateDocument(){
    this.getDocumentById();
  }

  getDocumentById(){
    this.props.client
      .query({
        query: getInfoById,
        variables: { id: parseInt(queryString.parse(this.props.location.search).id) },
        fetchPolicy: "network-only"
      })
      .then(result => {
        const document = result.data.getInfoDocumentById;

        this.initialState = {
          document: document
        };
        this.setState({ ...this.initialState, loading: false, error: "" });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, error: error.message });
      });
  }

  componentDidMount(){
    
    this.setState({ loading: true });
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
          accessSpecifier: response
        });
        this.getDocumentById();
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
      editMode, 
      document, 
      reactModalVisible,
      requireCancel,
      modalMessage 
    } = this.state;
    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>{error}</div>;
    }
    return (
      <>
      {accessSpecifier  &&
        accessSpecifier[INFO_UPLOAD_FEATURE_ID] && accessSpecifier[INFO_UPLOAD_FEATURE_ID].viewP ? (
      <div>
        <ReactModal
          reactModalVisible={reactModalVisible}
          submitModal={this.submitModal}
          modalMessage={modalMessage}
          requireCancel={requireCancel}
        />
        {editMode ? (
            <DocumentEdit
              document={document}
              toggleEditMode={this.toggleEditMode}
              onUpdateDocument={this.onUpdateDocument}
            />
            ) : (
            <DocumentView 
              document={document}              
              toggleEditMode={this.toggleEditMode} 
            />
          )
        }
          <DocumentDetails 
            document={document} 
            accessSpecifier={accessSpecifier}
            onUpdateDocument={this.onUpdateDocument}/>
      </div>
      ) : (
        <NotAccessible />
      )}
      </>
    );
  }
}

DocumentProfile.getInitialProps = ({ router }) => {
  return { router };
};

export default withRouter(connect()(withApollo(DocumentProfile)));
