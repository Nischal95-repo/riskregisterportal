import React from "react";

const ButtonComponent = props => (
  <>
    <button type={props.type} className={`btn ${props.className}`} onClick={props.onClick} style={props.style}>
      {props.title}
    </button>
  </>
);

export default ButtonComponent;
