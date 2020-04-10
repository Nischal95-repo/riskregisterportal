import React from "react";

const GridSelectInput = (props) => (
  <>
    <div className="row">
      <div className="col-xl-2 col-md-4 col-sm-6 col-lg-3">
        <div className="form-group mt-2">
          <label>
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
        <div className="form-group mt-2">
          <label>: </label>
        </div>
      </div>
      <div className="col-xl-3 col-md-7 col-lg-7 col-sm-6">
        <div className="form-group">
          <select
            name={props.name}
            value={props.value}
            onChange={props.handleChange}
            disabled={props.disabled}
            className="form-control"
          >
            <option value="">{props.placeholder}</option>
            {props.optionKey
              ? props.options.map((option) => {
                  return (
                    <option
                      key={option[props.optionKey]}
                      value={option[props.valueKey]}
                      label={option[props.optionKey]}
                    >
                      {option[props.optionKey]}
                    </option>
                  );
                })
              : props.options.map((option) => {
                  return (
                    <option key={option} value={option} label={option}>
                      {option}
                    </option>
                  );
                })}
          </select>
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

export default GridSelectInput;
