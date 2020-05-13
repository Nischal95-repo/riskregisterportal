import React from "react";
const SelectComponent = (props) => (
  <>
    <div className="form-group" style={props.style ? props.style : {}}>
      {props.label ? (
        <label>
          {props.label}
          {props.required ? <span style={{ color: "red" }}>*</span> : null}
        </label>
      ) : null}
      <select
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        disabled={props.disabled}
        className="form-control"
      >
        {props.placeholder ? (
          <option value="">{props.placeholder}</option>
        ) : null}
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
        ? props.validator.message(props.title, props.value, props.validation)
        : null}
    </div>
  </>
);

export default SelectComponent;
