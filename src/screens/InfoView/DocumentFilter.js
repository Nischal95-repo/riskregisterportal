import React from "react";
import { withApollo } from "react-apollo";

class DocumentFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      documentId: "",
      status: "",
      categoryId:"",
      categoryOption:[],
      errors: []
    };

    this.submitForm = this.submitForm.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  componentDidMount() {
    var filterData = this.props.filterData;
    this.setState({
      documentId: filterData && filterData.documentId ? filterData.documentId : "",
      status: filterData && filterData.status ? filterData.status : "",
      categoryId: filterData && filterData.categoryId ? filterData.categoryId : "",
      categoryOption: this.props.categoryOption
    });
  }

  resetForm() {
    this.setState({ ...this.initialState, errors: [] });
    this.props.filterAction();
    this.props.listData({}, false);
  }

  submitForm() {
    //Use below variables to Update DB via GraphQL after all validations pass
    const { documentId, status, categoryId, emailId } = this.state;

    this.setState({ errors: [] });
    let data = {
      documentId: parseInt(documentId),
      status: status,
      categoryId: categoryId
    };
    this.props.filterAction();
    this.props.listData(data, true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.filterData) {
      var filterData = nextProps.filterData;
      this.setState({
        documentId: filterData && filterData.documentId ? filterData.documentId : "",
        status: filterData && filterData.status ? filterData.status : "",
        categoryId: filterData && filterData.categoryId ? filterData.categoryId : "",
        categoryOption: nextProps.categoryOption
      });
    }
  }

  render() {
    const { showFilter } = this.props;
    const { documentId, status, categoryId, categoryOption } = this.state;

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
          <div className="form-group">
            <label>Info ID</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Task ID to Search"
              maxLength="6"
              value={documentId}
              onChange={e => {
                this.setState({ documentId: e.target.value });
              }}
            />
          </div>
          {/* <div className="form-group">
            <label>Status</label>
            <select className="form-control" value={status} onChange={e => {
                this.setState({ status: parseInt(e.target.value) });
              }}>
                <option value="" disabled>Select</option>
                <option value={1}>Active</option>
                <option value={2}>Pending for Activation</option>
                <option value={3}>Inactive</option>
            </select>
          </div> */}
          <div className="form-group">
            <label>Category</label>
            <select className="form-control" value={categoryId} onChange={e => {
                this.setState({ categoryId: parseInt(e.target.value) });
              }}>
                <option value="" disabled>Select</option>
                {categoryOption.map((option,i)=>{
                  return(
                    <option key={i} value={option.Id}>{option.description}</option>
                  )
                })}
            </select>
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

export default withApollo(DocumentFilter);