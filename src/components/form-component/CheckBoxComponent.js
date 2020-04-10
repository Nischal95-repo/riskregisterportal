import React from "react";

const CheckboxComponent = (props) => (
  <>
    <div className="checkbox-style-1">
      <div className="form-check">
        {props.children}

        <input
          className={`${
            props.readOnly ? "form-control-plaintext" : "form-check-input"
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
          type="checkbox"
          checked={props.value}
          onChange={props.handleChange}
          // placeholder={props.placeholder}
          onBlur={() => props.validator.showMessageFor(props.title)}
          disabled={props.disabled}
          // autocomplete="off"
        />
        {props.validator && props.validation
          ? props.validator.message(props.title, props.value, props.validation)
          : null}
        {props.label ? (
          <label htmlFor={props.name} className={"form-check-label"}>
            {props.label}
            {/* {props.required ? <span stylse={{ color: "red" }}>*</span> : null} */}
          </label>
        ) : null}
      </div>
    </div>
  </>
);

export default CheckboxComponent;
