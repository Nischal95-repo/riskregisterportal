import { MAX_UPLOAD_SIZE } from "../constants/app-constants";

/*
  Views :
    1. Document List

*/
export const errorMessage = (error, view) => {
  console.error(error);

  const DEFAULT_MESSAGE =
    "An error has occurred. Please contact your system administrator";

  const UPLOAD_ERROR_MESSAGE =
    "Cannot upload files more than " + MAX_UPLOAD_SIZE + " MB";

  // Network Error
  if (error.graphQLErrors.length == 0) {
    console.error(error.message);
    if (error.message.toUpperCase().includes("INPUT/OUTPUT ERROR")) {
      return DEFAULT_MESSAGE;
    }

    if (error.message.toUpperCase().includes("PAYLOAD TOO LARGE")) {
      return UPLOAD_ERROR_MESSAGE;
    }

    if (error.message.toUpperCase().includes("NETWORK ERROR") && view === 1) {
      return (
        "File cannot exceed " +
        MAX_UPLOAD_SIZE +
        " MB. Please contact your system administrator"
      );
    }

    if (error.message.toUpperCase().includes("NETWORK ERROR")) {
      return DEFAULT_MESSAGE;
    }

    return DEFAULT_MESSAGE;
  }

  // GraphQL Error
  return error.graphQLErrors.map(({ message, extensions }) => {
    console.error(message);

    if (message.toUpperCase().includes("ECONNREFUSED")) {
      return DEFAULT_MESSAGE;
    }

    if (message.toUpperCase().includes("STATUS CODE 401")) {
      let error = extensions.exception.result.errors[0];
      console.error(error);

      if (error.toUpperCase().includes("TOKEN")) {
        return error;
      }

      if (error.toUpperCase().includes("INACTIVITY")) {
        return error;
      }

      if (error.toUpperCase().includes("EXPIRED")) {
        return error;
      }

      if (error.toUpperCase().includes("SESSION")) {
        return DEFAULT_MESSAGE;
      }

      return error;
    }

    if (message.toUpperCase().includes("STATUS CODE 400")) {
      let error = extensions.exception.result.errors[0].message;
      console.error(error);

      if (error.toUpperCase().includes("DATA_UPLOAD_MAX_MEMORY_SIZE"))
        return UPLOAD_ERROR_MESSAGE;

      return error;
    }

    return message;
  });
};
