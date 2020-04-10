import React from "react";
import errorImg from "../../static/images/svg/error.svg";
const DisplayErrors = props => {
  const { errors } = props;

  const jsx = errors.map(error => {
    return (
      <span className="danger-link" style={{ fontSize: "12px" }} key={error}>
        <img src={errorImg} /> &nbsp;
        {error}
      </span>
    );
  });

  return <>{jsx}</>;
};

export default DisplayErrors;
