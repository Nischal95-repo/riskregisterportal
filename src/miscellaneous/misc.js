import { NAME_VALIDATION } from "../constants/app-constants";

export const nameValidation = name => {
  let valid = false;

  const FORMAT_REGEX = new RegExp(
    "^[A-Za-z]([a-zA-Z0-9-_]|[" + NAME_VALIDATION + "])*$"
  );
  console.log("regex", FORMAT_REGEX);
  if (FORMAT_REGEX.test(name)) {
    valid = true;
  }

  return valid;
};

export const alphabetAcceptanceValidation = (name, format) => {
  let valid = false;
  let format1 = format ? format: "";
  const FORMAT_REGEX = new RegExp(
    "^[A-Za-z]([a-zA-Z]|[" + format1 + "])*$"
  );
  console.log("regex", FORMAT_REGEX);
  if (FORMAT_REGEX.test(name)) {
    valid = true;
  }

  return valid;
};

export const alphanumericAcceptanceValidation = (name, format) => {
  let valid = false;
  let format1 = format ? format: "";
  const FORMAT_REGEX = new RegExp(
    "^[A-Za-z]([a-zA-Z0-9_]|[" + format1 + "])*$"
  );
  console.log("regex", FORMAT_REGEX);
  if (FORMAT_REGEX.test(name)) {
    valid = true;
  }

  return valid;
};

export const alphanumericOnlyValidation = (name, format) => {
  let valid = false;
  let format1 = format ? format: "";
  const FORMAT_REGEX = new RegExp(
    "^([a-zA-Z0-9]|[" + format1 + "])*$"
  );
  console.log("regex", FORMAT_REGEX);
  if (FORMAT_REGEX.test(name)) {
    valid = true;
  }

  return valid;
};
