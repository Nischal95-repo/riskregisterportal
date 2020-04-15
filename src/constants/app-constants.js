import chifSign from "../../src/static/certificateImage/sign.png";
import CeoSign from "../../src/static/certificateImage/sign2.png";

export const PAGINATION_OFFSET_VALUE = 10;
// export const NOTIFICATION_OFFSET_VALUE = 10;
export const SET_TIMEOUT_VALUE = 10000;
export const dateInputFormat = "YYYY-MM-DD";
// export const dateTimeFormat = "DD-MMM-YYYY h:mm:ss";
export const dateFormat = "DD-MM-YYYY";
// export const dateTimeFormatMonth = "DD-MM-YYYY h:mm:ss";
export const dateFormatMonth = "DD-MM-YYYY HH:mm";
export const testDateFormat = "DD-MMM-YYYY";
// export const TOKEN_VERIFICATION_CHECK = 600000;
// export const descriptionMaxLength = 30;
export const SUCCESS_TIME = 10000;
// export const userMaxLength = 10;
export const IMAGE_TYPE = ["png", "jpg", "gif", "jpeg"];
export const PASSWORD_REGEX = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);
// export const MAX_ADDRESS_LENGTH = 80;

//size in mb
export const MAX_UPLOAD_SIZE = 10;

//size in mb
export const MAX_DOC_UPLOAD_SIZE = 50;

export const DESCRIPTION_MAX_LENGTH = "40";
export const LIST_DESCRIPTION_MAXLENGTH = 40;
export const NAME_VALIDATION = "- @&_";
export const ALPHANUMERIC_NAME_VALIDATION = "&_/ ";
export const ALPHABET_NAME_VALIDATION = " '";
export const IPHEN = "-";
export const SPACE = " ";
// export const CUSTOMER_USER_COUNT = 5;
export const UNDERSCORE = " _";
export const ALPHABET_NAME_SPECIAL_CHAR = "_& ";
export const CERTIFICATE_NAME = "Shivanand Nimbargi";
export const CERTTIFCATE_POSITION_FIRST = "MD & CEO";
export const CERTTIFCATE_POSITION_SECOND = "Chief Compliance Officer";
export const CHIF_SIGN = chifSign;
export const CEO_SIGN = CeoSign;
export const DO_NOT_ACCESS_MESSAGE =
  "Sorry, you do not have access rights to do this Action";
