import React from "react";
const InputComponent = props => (
  <>
    <div className={props.optionTextbox ? "" : "form-group"}>
      {props.children}
      {props.label ? (
        <label style={{ width: "100%" }}>
          {props.label}
          {props.required ? <span style={{ color: "red" }}>*</span> : null}
        </label>
      ) : null}
      {console.log()}

      {props.readOnly ? (
        <span style={{ wordBreak: "break-all" }}>{props.value}</span>
      ) : (
        <input
          className={`${
            props.readOnly ? "form-control-plaintext" : props.className ? props.className : "form-control"
          } ${
            props.validator && props.validator.messageWhenPresent("message") && !props.validator.fieldValid(props.title)
              ? "is-invalid"
              : ""
          }`}
          id={props.name}
          readOnly={props.readOnly}
          name={props.name}
          type={props.type}
          value={props.value}
          onChange={props.handleChange}
          placeholder={props.placeholder}
          // onBlur={() => props.validator.showMessageFor(props.title)}
          disabled={props.disabled}
          autoComplete="off"
          min={props.min}
          max={props.max}
        />
      )}
      {props.validator && props.validation ? props.validator.message(props.title, props.value, props.validation) : null}
      {props.DateErrMsg ? (
        <span classname="errorColor" style={{ color: "red" }}>
          {props.DateErrMsg}
        </span>
      ) : (
        ""
      )}
    </div>
  </>
);

export default InputComponent;
