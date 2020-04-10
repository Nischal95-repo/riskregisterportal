export function validateEmail(email) {
  //REGEX used by jquery
  const REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return REGEX.test(String(email).toLowerCase());
}

export function validateInteger(val) {
  //Only Integers (no decimal values)
  const REGEX = /^\d+$/;
  return REGEX.test(String(val));
}

export function validateDecimal(val) {
  //Numbers including Integers and decimal values
  const REGEX = /^\d+\.?\d*$|^\d*\.?\d+$/;
  return REGEX.test(String(val));
}

export function validateRequired(val) {
  return val.trim() === "" ? false : true;
}
