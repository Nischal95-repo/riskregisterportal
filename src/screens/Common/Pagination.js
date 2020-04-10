import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  items: PropTypes.array.isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
};

const defaultProps = {
  initialPage: 1,
  pageSize: 10,
};

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pager: {} };
  }

  prevPage(page) {
    const { initialPage } = this.props;

    if (initialPage <= 1) return;
    // call change page function in parent component
    this.props.onChangePage(page);
  }

  nextPage(page) {
    const { items, pageSize } = this.props;

    if (items.length < pageSize || items.length === 0) return;
    // call change page function in parent component
    this.props.onChangePage(page);
  }

  render() {
    const { loading, items, initialPage, pageSize } = this.props;
    return (
      <>
        {initialPage == 1 && !items.length ? null : (
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center pagination-style-1">
              <li className="page-item">
                <a
                  className={
                    initialPage === 1 || loading
                      ? "page-link disabled"
                      : "page-link "
                  }
                  href="#"
                  aria-label="Previous"
                  id="pageP"
                  onClick={() => {
                    !loading && this.prevPage(initialPage - 1);
                  }}
                >
                  « Previous
                </a>
              </li>
              <li className="page-item">
                <a
                  className={
                    items.length < pageSize || items.length === 0 || loading
                      ? "page-link disabled"
                      : "page-link "
                  }
                  href="#"
                  aria-label="Next"
                  id="pageN"
                  onClick={() => {
                    !loading && this.nextPage(initialPage + 1);
                  }}
                >
                  Next »
                </a>
              </li>
            </ul>
          </nav>
        )}
      </>
    );
  }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;
export default Pagination;
