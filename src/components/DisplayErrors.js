import React from "react";

const DisplayErrors = props => {
  const { errors } = props;

  const jsx = errors.map(error => {
    return (
      <span className="danger-link" style={{ fontSize: "12px" }} key={error}>
        <img src="/static/images/svg/error.svg" /> &nbsp;
        {error}
      </span>
    );
  });

  return <>{jsx}</>;
};

export default DisplayErrors;
