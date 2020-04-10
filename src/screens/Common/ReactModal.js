import Modal from "react-awesome-modal";
import React from "react";
import success from "../../static/images/svg/Success.svg";
class ReactModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Modal
          visible={this.props.reactModalVisible}
          effect="fadeInDown"
          width="440"
        >
          <div className="react-modal-alignment">
            <div className="row">
              <div className="col">
                <h4>Alert</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="alert alert-success" role="alert">
                  <img src={success} /> &nbsp;
                  <span
                    className="success-link"
                    style={
                      this.props.notif
                        ? {
                            fontSize: "small",
                            marginTop: "5px",
                            marginLeft: "6px"
                          }
                        : {}
                    }
                  >
                    {this.props.modalMessage}
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12" style={{ textAlign: "center" }}>
                <button
                  className="btn btn-danger"
                  onClick={this.props.submitModal}
                >
                  Ok
                </button>
                &nbsp;&nbsp;
                {this.props.requireCancel ? (
                  <button
                    className="btn btn-light m-l-45"
                    onClick={this.props.closeModal}
                    style={this.props.notif ? { marginLeft: "6px" } : {}}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default ReactModal;
