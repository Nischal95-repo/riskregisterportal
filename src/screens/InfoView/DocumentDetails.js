import React from "react";
import Version from "./Versions/Version";

import { withApollo } from "react-apollo";

import { getListOfVersionsQuery } from "../../services/graphql/queries/document-upload";

const DOCUMENT_VERSION_FEATURE_ID = 112;

class DocumentDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        document: props.document,
        versions:[],
        activeMenu: "Attachments",
        selectedVersion: 1,
        versionLength: 0
    };
    this.changeMenu = this.changeMenu.bind(this);
    this.updateVersion = this.updateVersion.bind(this);
    this.reviewCompleted = this.reviewCompleted.bind(this);
  }

  changeMenu(e, menu, selectedVersion) {
    e.preventDefault();
    if(selectedVersion){
      this.setState({ activeMenu: menu, selectedVersion: selectedVersion });
    }else
    this.setState({ activeMenu: menu });
  }

  updateVersion(){
    this.props.onUpdateDocument();
    this.getListofVersions();
  }

  reviewCompleted(){
    this.props.client
      .query({
        query: getListOfVersionsQuery,
        variables: { documentId: parseInt(this.props.document.Id) },
        fetchPolicy: "network-only"
      })
      .then(result => {
        const versions = result.data.getListOfVersionsByDocumentId;

        this.initialState = {
          versions: versions
        };
        this.setState({ ...this.initialState, selectedVersion: versions.length, versionLength: versions.length, activeMenu: "Attachments", loading: false, error: "" });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, error: error.message });
      });
  }

  getListofVersions(){
    this.props.client
      .query({
        query: getListOfVersionsQuery,
        variables: { documentId: parseInt(this.props.document.Id) },
        fetchPolicy: "network-only"
      })
      .then(result => {
        const versions = result.data.getListOfVersionsByDocumentId;

        this.initialState = {
          versions: versions
        };
        this.setState({ ...this.initialState, activeMenu: "Attachments", selectedVersion: versions.length, versionLength: versions.length, loading: false, error: "" });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, error: error.message });
      });
  }
  
  componentDidUpdate(prevProps){
    if(prevProps.document !== this.props.document){
        this.setState({document: this.props.document});
        this.getListofVersions();
    }
    if(prevProps.accessSpecifier !== this.props.accessSpecifier){
      if (
        this.props &&
        this.props.accessSpecifier &&
        this.props.accessSpecifier[DOCUMENT_VERSION_FEATURE_ID]
      ) {
        if (
          !this.props.accessSpecifier[DOCUMENT_VERSION_FEATURE_ID]
            .viewP
        )
          this.setState({ activeMenu: "Reviewer" });
      }
    }
  }

  render() {
    const { document, activeMenu, selectedVersion, versionLength } = this.state;
    const { accessSpecifier } = this.props;
    return (
        <div className="tab-style-1">
            {Object.keys(this.props.document).length?
            <>
            <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <a 
                  className={activeMenu === "Attachments" ? "nav-link active": "nav-link"} 
                  id="Attachments" data-toggle="pill" href="#doc" role="tab" aria-controls="doc" aria-selected="false" 
                  >
                    <span>Attachments</span>
                </a>
            </div>
            <div className="tab-content" id="v-pills-tabContent">
              <Version 
                document={document} 
                selectedVersion={selectedVersion} 
                versionLength={versionLength} 
                updateVersion={this.updateVersion} 
                reviewCompleted={this.reviewCompleted} 
                accessSpecifier={accessSpecifier[DOCUMENT_VERSION_FEATURE_ID]}
              />
            </div>
            </>
            :null}
        </div>
    );
  }
}

export default withApollo(DocumentDetails);