import React from "react";
import Reviewer from "./Reviewers/Reviewer";
import Version from "./Versions/Version";

import { withApollo } from "react-apollo";

import { getListOfVersionsQuery } from "../../services/graphql/queries/document-upload";


class DocumentDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      document: props.document,
      versions: [],
      activeMenu: "Version1",
      selectedVersion: 1,
      versionLength: 0
    };
    this.changeMenu = this.changeMenu.bind(this);
    this.updateVersion = this.updateVersion.bind(this);
    this.reviewCompleted = this.reviewCompleted.bind(this);
  }

  changeMenu(e, menu, selectedVersion) {
    e.preventDefault();
    if (selectedVersion) {
      this.setState({ activeMenu: menu, selectedVersion: selectedVersion });
    } else this.setState({ activeMenu: menu });
  }

  updateVersion() {
    this.props.onUpdateDocument();
    this.getListofVersions();
  }

  reviewCompleted() {
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
        this.setState({
          ...this.initialState,
          selectedVersion: versions.length,
          versionLength: versions.length,
          activeMenu: "Version" + versions.length,
          loading: false,
          error: ""
        });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, error: error.message });
      });
  }

  getListofVersions() {
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
        this.setState({
          ...this.initialState,
          activeMenu: "Version" + versions.length,
          selectedVersion: versions.length,
          versionLength: versions.length,
          loading: false,
          error: ""
        });
      })
      .catch(error => {
        console.log("~~~error: ", error);
        this.setState({ loading: false, error: error.message });
      });
      if(this.props.isCreate){
        var objDiv = document.getElementsByClassName("main-section ");
        objDiv[0].scrollTop = objDiv[0].scrollHeight;
      }
  }

  componentDidMount(){
    this.getListofVersions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.document !== this.props.document) {
      this.setState({ document: this.props.document });
      this.getListofVersions();
    }
  }

  render() {
    const {
      document,
      versions,
      activeMenu,
      selectedVersion,
      versionLength
    } = this.state;
    return (
      <div className="tab-style-1">
        {Object.keys(this.props.document).length?<div
          className="nav flex-column nav-pills"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          {/* <a 
                    className={activeMenu === "Version1"? "nav-link active": "nav-link"} 
                    id="doc-tab" data-toggle="pill" href="#doc" role="tab" aria-controls="doc" aria-selected="false" 
                    onClick={e => {
                        this.changeMenu(e, "Version1");
                    }}>
                    <span>Version 1</span>
                </a> */}
            <div>
              {versions.map((version, index) => {
                return (
                  <a
                    key={index}
                    className={
                      activeMenu === "Version" + version.versionNo
                        ? "nav-link active"
                        : "nav-link"
                    }
                    id={"doc-tab" + index}
                    data-toggle="pill"
                    href="#doc"
                    role="tab"
                    aria-controls="doc"
                    aria-selected="false"
                    onClick={e => {
                      this.changeMenu(
                        e,
                        "Version" + version.versionNo,
                        index + 1
                      );
                    }}
                  >
                    <span>Version {version.versionNo}</span>
                  </a>
                );
              })}
            </div>
          
            <a
              className={
                activeMenu === "Reviewer" ? "nav-link active" : "nav-link"
              }
              id="serv-tab"
              data-toggle="pill"
              href="#serv"
              role="tab"
              aria-controls="serv"
              aria-selected="true"
              style={{ marginTop: "5px" }}
              onClick={e => {
                this.changeMenu(e, "Reviewer");
              }}
            >
              <span>Reviewers</span>
            </a>
        </div>:null}
        <div className="tab-content" id="v-pills-tabContent">
          {activeMenu === "Reviewer"  ? (
            <Reviewer
              document={document}
            />
          ) : null}
            <>
              {versions.map((version, index) => {
                return (
                  <div key={index}>
                    {activeMenu === "Version" + version.versionNo ? (
                      <Version
                        document={document}
                        version={version}
                        selectedVersion={selectedVersion}
                        versionLength={versionLength}
                        updateVersion={this.updateVersion}
                        reviewCompleted={this.reviewCompleted}
                        
                      />
                    ) : null}
                  </div>
                );
              })}
            </>
        </div>
      </div>
    );
  }
}

export default withApollo(DocumentDetails);
