import React from "react";
const TextAreComponent = props => (
  <>
    <div className="form-group">
      {props.children}
      {props.label ? (
        <label>
          {props.label}
          {props.required ? <span style={{ color: "red" }}>*</span> : null}
        </label>
      ) : null}
      {console.log()}

      <textarea
        className={`${
          props.readOnly ? "form-control-plaintext" : "form-control"
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
        // type={props.type}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder}
        // onBlur={() => props.validator.showMessageFor(props.title)}
        disabled={props.disabled}
        autoComplete="off"
      >
        {/* {props.value} */}
      </textarea>
      {props.validator && props.validation
        ? props.validator.message(props.title, props.value, props.validation)
        : null}
    </div>
  </>
);

export default TextAreComponent;
