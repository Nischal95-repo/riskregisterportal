import React from "react";

const GridTextBoxForInput = (props) => (
  <>
    <div className="row">
      <div className="col-md-4">
        <div className="form-group bottomMargin mt-2">
          <label>
            {props.children}
            {props.label ? (
              <label>
                {props.label}
                {props.required ? (
                  <span style={{ color: "red" }}>*</span>
                ) : null}
              </label>
            ) : null}
          </label>
        </div>
      </div>
      <div className="col-md-1 col-lg-1">
        <div className="form-group bottomMargin mt-2">
          <label>: </label>
        </div>
      </div>
      <div className="col-md-6 ">
        <div className="form-group bottomMargin">
          <input
            autoFocus={props.autoFocus ? true : false}
            className={`${
              props.readOnly
                ? "form-control-plaintext"
                : props.className
                ? props.className
                : "form-control height-css"
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
          {props.DateErrMsg ? (
            <span classname="errorColor" style={{ color: "red" }}>
              {props.DateErrMsg}
            </span>
          ) : (
            ""
          )}
          {props.validator && props.validation
            ? props.validator.message(
                props.title,
                props.value,
                props.validation
              )
            : null}
        </div>
      </div>
    </div>
  </>
);

export default GridTextBoxForInput;
