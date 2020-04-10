import React from "react";

const InputComponent = (props) => (
  <>
    <div className={props.optionTextbox ? "" : "form-group"}>
      {props.children}
      {props.label ? (
        <label>
          {props.label}
          {props.required ? <span style={{ color: "red" }}>*</span> : null}
        </label>
      ) : null}
      <input
        autoFocus={props.autoFocus ? true : false}
        className={`${
          props.readOnly
            ? "form-control-plaintext"
            : props.className
            ? props.className
            : "form-control"
        } ${
          props.validator &&
          props.validator.messageWhenPresent("message") &&
          !props.validator.fieldValid(props.title)
            ? "is-invalid"
            : ""
        }`}
        id={props.name}
        readOnly={props.readOnly}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.handleChange}
        onKeyUp={props.handleKeyUpChange}
        placeholder={props.placeholder}
        // onBlur={() => props.validator.showMessageFor(props.title)}
        disabled={props.disabled}
        autoComplete="off"
        min={props.min}
        max={props.max}
      />
      {props.validator && props.validation
        ? props.validator.message(props.title, props.value, props.validation)
        : null}
      {/* TODO: Remove This */}
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
