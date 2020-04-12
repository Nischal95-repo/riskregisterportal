import React from "react";

import ReviewerList from "./ReviewerList";
import ReviewerAdd from "./ReviewerAdd";

class Reviewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: props.document,
      addMode: false
    };
    this.toggleMode = this.toggleMode.bind(this);
  }

  toggleMode() {
    this.setState({ addMode: !this.state.addMode });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.document !== this.props.document) {
      this.setState({ document: this.props.document });
    }
  }
  render() {
    const { document, addMode } = this.state;
    return (
      <div
        className="tab-pane fade show active"
        id="serv"
        role="tabpanel"
        aria-labelledby="serv-tab"
      >
        <div className="box-card">
          <div className="row">
            <div className="col-md-12">
              {addMode ? (
                <ReviewerAdd document={document} toggleMode={this.toggleMode} />
              ) : (
                <ReviewerList
                  document={document}
                  toggleMode={this.toggleMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reviewer;
