import React from "react";
import equal from "fast-deep-equal";

import { withApollo } from "react-apollo";

class UserFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeId: "",
      name: "",
      emailId: "",
      errors: []
    };

    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentDidMount() {
    var filterData = this.props.filterData;
    this.setState({
      employeeId:
        filterData && filterData.employeeId ? filterData.employeeId : "",
      name: filterData && filterData.name ? filterData.name : "",
      emailId: filterData && filterData.emailId ? filterData.emailId : ""
    });
  }

  resetForm() {
    this.setState({ ...this.initialState, errors: [] });
    this.props.filterAction();
    this.props.listData({}, false);
  }

  submitForm() {
    //Use below variables to Update DB via GraphQL after all validations pass
    const { employeeId, name, emailId } = this.state;

    this.setState({ errors: [] });
    let data = {
      employeeId: employeeId,
      name: name,
      emailId: emailId
    };
    this.props.filterAction();
    this.props.listData(data, true);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps && nextProps.filterData) {
  //     var filterData = nextProps.filterData;
  //     this.setState({
  //       employeeId: filterData && filterData.employeeId ? filterData.employeeId : "",
  //       name: filterData && filterData.name ? filterData.name : "",
  //       emailId: filterData && filterData.emailId ? filterData.emailId : ""
  //     });
  //   }
  // }
  componentDidUpdate(prevProps) {
    if (!equal(this.props.filterData, prevProps.filterData)) {
      let filterData = this.props.filterData;
      this.setState({
        employeeId:
          filterData && filterData.employeeId ? filterData.employeeId : "",
        name: filterData && filterData.name ? filterData.name : "",
        emailId: filterData && filterData.emailId ? filterData.emailId : ""
      });
    }
  }

  render() {
    const { showFilter } = this.props;
    const { employeeId, name, emailId } = this.state;

    return (
      <div
        className="filter-popup"
        style={
          showFilter
            ? {
                display: "block"
              }
            : { display: "none" }
        }
      >
        <form className="m-t-15">
          {/* <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Employee ID to Search"
              value={employeeId}
              onChange={e => {
                this.setState({ employeeId: e.target.value });
              }}
            />
          </div> */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name to Search"
              value={name}
              onChange={e => {
                this.setState({ name: e.target.value.toUpperCase() });
              }}
            />
          </div>
          <div className="form-group">
            <label>EMAIL ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Email id to Search"
              value={emailId}
              onChange={e => {
                this.setState({ emailId: e.target.value });
              }}
            />
          </div>

          <div className="row">
            <div className="col-md-6 text-center">
              <button
                type="button"
                className="btn btn-light btn-block"
                onClick={this.resetForm}
              >
                Clear
              </button>
            </div>
            <div className="col-md-6 text-center">
              <button
                type="button"
                className="btn btn-danger btn-block"
                onClick={this.submitForm}
              >
                Apply
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withApollo(UserFilter);
