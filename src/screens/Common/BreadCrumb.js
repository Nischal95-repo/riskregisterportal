import React from "react";
import { Link } from "react-router-dom";

const BreadCrumb = props => {
  const { data } = props;

  const arrayLength = data.length;

  const liJSX = data.map((element, i) => {
    if (arrayLength === i + 1) {
      // last element
      return (
        <li className="breadcrumb-item active" aria-current="page" key={i}>
          <a>{element.name}</a>
        </li>
      );
    } else {
      // not last element
      return (
        <li className="breadcrumb-item" key={i}>
          <Link to={element.link}>
            <a>{element.name}</a>
          </Link>
        </li>
      );
    }
  });
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item" key={100}>
          <Link to="/home">
            <a>Home</a>
          </Link>
        </li>
        {liJSX}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
