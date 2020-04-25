// export const errorAlert = function(msg) {
//   toast.error(msg, {
//     className: "toast-error-container",
//     hideProgressBar: false,
//     closeButton: <img src={CloseSvg} />,
//     onClose: console.log("check"),
//   });
// };

import React from "react";
import { toast } from "react-toastify";
import CloseSvg from "../../static/images/svg/Close.svg";
import { SET_TIMEOUT_VALUE } from "../../constants/app-constants";

export const errorMsg = function(msg, timeout = SET_TIMEOUT_VALUE) {
  return toast.error(msg, {
    className: "toast-error-container",
    autoClose: timeout,
    // progressClassName: "error-progress-bar",
    // hideProgressBar: false,
    closeButton: <img src={CloseSvg} />,
  });
};

export const successMsg = function(msg, timeout = SET_TIMEOUT_VALUE) {
  return toast.error(msg, {
    className: "toast-success-container",
    // progressClassName: "success-progress-bar",
    autoClose: timeout,
    // hideProgressBar: false,
    closeButton: <img src={CloseSvg} />,
  });
};
