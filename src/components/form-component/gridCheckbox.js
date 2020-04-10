import React from "react";

const GridCheckbox = (props) => (
  <>
    <div className="row">
      <div className="col-xl-2 col-md-4 col-sm-6 col-lg-3">
        <div className="form-group mt-2">
          <label>
            {props.label ? (
              <label htmlFor={props.name} className={"form-check-label"}>
                {props.label}
                {/* {props.required ? <span stylse={{ color: "red" }}>*</span> : null} */}
              </label>
            ) : null}
          </label>
        </div>
      </div>
      <div className="col-md-1 col-lg-1">
        <div className="form-group mt-2">
          <label>: </label>
        </div>
      </div>
      <div className="col-xl-3 col-md-7 col-lg-7 col-sm-6">
        <div className="checkbox-style-1">
          <div className="form-check" style={{ marginLeft: "-20px" }}>
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
              ? props.validator.message(
                  props.title,
                  props.value,
                  props.validation
                )
              : null}
            <label
              className="form-check-label"
              htmlFor={props.name}
              style={{ color: "white" }}
            >
              .
            </label>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default GridCheckbox;
