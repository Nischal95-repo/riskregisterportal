// 1--> UnAssigned
// 2-> Atria User Assigned
// 3-> Installing Company Assigned
// 4-> Installer Assigned
// 5-> In Progress
// 6-> Resolved

// 8-> Rejected
// 9-> On Hold
// 10-> Resume

export const statusObject = {
  1: [
    {
      id: 1,
      name: "UnAssigned"
    },
    {
      id: 3,
      name: "Installing Company Assigned"
    },
    {
      id: 9,
      name: "On Hold"
    }
  ],
  3: [
    {
      id: 3,
      name: "Installing Company Assigned"
    },
    {
      id: 4,
      name: "Installer Assigned"
    },
    {
      id: 5,
      name: "In Progress"
    },
    { id: 9, name: "On Hold" },
    {
      id: 8,
      name: "Rejected"
    }
  ],
  4: [
    {
      id: 4,
      name: "Installer Assigned"
    },
    {
      id: 5,
      name: "In Progress"
    },
    { id: 9, name: "On Hold" },
    {
      id: 8,
      name: "Rejected"
    }
  ],
  5: [
    {
      id: 5,
      name: "In Progress"
    },
    {
      id: 6,
      name: "Resolved"
    },
    { id: 9, name: "On Hold" },
    {
      id: 8,
      name: "Rejected"
    }
  ],
  6: [
    {
      id: 6,
      name: "Resolved"
    },
    {
      id: 5,
      name: "In Progress"
    }
    // {
    //   id: 7,
    //   name: "Closed"
    // }
  ],
  9: [
    {
      id: 9,
      name: "On Hold"
    },
    {
      id: 10,
      name: "Resume"
    }
  ],
  8: [
    {
      id: 8,
      name: "Rejected"
    }
  ],
  10: [
    {
      id: 10,
      name: "Resume"
    }
  ]
};

export const getMappedStatus = function(initialStatus) {
  if (statusObject.hasOwnProperty(initialStatus)) {
    return statusObject[initialStatus];
  } else {
    return [];
  }
};
//Product Status
// 1	Active
// 2	Suspended
// 3	Terminated
// 4	Pending for Activation

const productStatus = {
  1: [
    {
      id: 1,
      name: "Active"
    },
    {
      id: 2,
      name: "Suspended"
    },
    {
      id: 3,
      name: "Terminated"
    }
  ],
  2: [
    {
      id: 2,
      name: "Suspended"
    },
    {
      id: 1,
      name: "Active"
    },

    {
      id: 3,
      name: "Terminated"
    }
  ],
  3: [
    {
      id: 3,
      name: "Terminated"
    }
  ],
  4: [
    {
      id: 4,
      name: "Pending for Activation"
    },
    {
      id: 1,
      name: "Active"
    }
  ]
};
export const getProductStatus = function(initialStatus) {
  if (productStatus.hasOwnProperty(initialStatus)) {
    return productStatus[initialStatus];
  } else {
    return [];
  }
};
//Ticket Category
//1	Active
//3	Terminated
//4	Pending for Activation

const masterStatus = {
  1: [
    {
      id: 1,
      name: "Active"
    },
    {
      id: 2,
      name: "Suspended"
    },
    {
      id: 3,
      name: "Terminated"
    }
  ],
  2: [
    {
      id: 2,
      name: "Suspended"
    },
    {
      id: 1,
      name: "Active"
    },

    {
      id: 3,
      name: "Terminated"
    }
  ],
  3: [
    {
      id: 3,
      name: "Terminated"
    }
  ],
  4: [
    {
      id: 4,
      name: "Pending for Activation"
    },
    {
      id: 1,
      name: "Active"
    }
  ]
};
export const getMasterStatus = function(initialStatus) {
  if (masterStatus.hasOwnProperty(initialStatus)) {
    return masterStatus[initialStatus];
  } else {
    return [];
  }
};

const InstallingCompanyStatus = {
  1: [
    {
      id: 1,
      name: "Active"
    },
    {
      id: 2,
      name: "Suspended"
    },
    {
      id: 3,
      name: "Terminated"
    }
  ],
  2: [
    {
      id: 2,
      name: "Suspended"
    },
    {
      id: 1,
      name: "Active"
    },

    {
      id: 3,
      name: "Terminated"
    }
  ],
  3: [
    {
      id: 3,
      name: "Terminated"
    }
  ],
  4: [
    {
      id: 4,
      name: "Pending for Activation"
    },

    {
      id: 5,
      name: "Ready for Activation"
    }
  ],
  5: [{ id: 5, name: "Ready for Activation" }]
};

export const getInstallingCompanyStatus = function(initialStatus) {
  if (InstallingCompanyStatus.hasOwnProperty(initialStatus)) {
    return InstallingCompanyStatus[initialStatus];
  } else {
    return [];
  }
};

//User
// 1	Active
// 2	Suspended
// 3	Terminated
// 4	Pending for Activation

const userStatus = {
  1: [
    {
      id: 1,
      name: "Active"
    },
    {
      id: 2,
      name: "Suspended"
    },
    {
      id: 3,
      name: "Terminated"
    }
  ],
  2: [
    {
      id: 2,
      name: "Suspended"
    },
    {
      id: 1,
      name: "Active"
    },

    {
      id: 3,
      name: "Terminated"
    }
  ],
  3: [
    {
      id: 3,
      name: "Terminated"
    }
  ],
  4: [
    {
      id: 4,
      name: "Pending for Activation"
    },

    {
      id: 5,
      name: "Ready for Activation"
    }
  ],
  5: [{ id: 5, name: "Ready for Activation" }]
};
export const getUserStatus = function(initialStatus) {
  if (userStatus.hasOwnProperty(initialStatus)) {
    return userStatus[initialStatus];
  } else {
    return [];
  }
};
//Document Upload
// 1	Waiting For Approval
// 2	Active
// 3	Rejected
// 4	Pending
// 5  Closed
// 6  Suspended

const documentUploadStatus = {
  1: [
    {
      id: 1,
      name: "Waiting For Approval"
    },
  ],
  2: [
    {
      id: 2,
      name: "Active"
    },
    {
      id: 5,
      name: "Closed"
    },
    {
      id: 6,
      name: "Suspended"
    },
  ],
  3: [
    {
      id: 3,
      name: "Rejected"
    }
  ],
  4: [
    {
      id: 4,
      name: "Pending"
    },
  ],
  5: [
    {
      id: 5,
      name: "Closed"
    },
  ],
  6: [
    {
      id: 6,
      name: "Suspended"
    },
    {
      id: 2,
      name: "Active"
    },
    {
      id: 5,
      name: "Closed"
    },
  ],
};
export const getDocumentUploadStatus = function(initialStatus) {
  if (documentUploadStatus.hasOwnProperty(initialStatus)) {
    return documentUploadStatus[initialStatus];
  } else {
    return [];
  }
};

//Document Review
// 1	Waiting For Approval
// 2	Approved
// 3	Rejected
// 4	Pending
// 5  Closed

const documentReviewStatus = {
  1: [
    {
      id: 1,
      name: "Waiting For Approval"
    },
    {
      id: 2,
      name: "Approved"
    },
    {
      id: 3,
      name: "Rejected"
    }
  ],
  2: [
    {
      id: 2,
      name: "Approved"
    },
  ],
  3: [
    {
      id: 3,
      name: "Rejected"
    }
  ],
  4: [
    {
      id: 4,
      name: "Pending"
    },
  ],
  5: [
    {
      id: 5,
      name: "Closed"
    },
  ],
};
export const getDocumentReviewStatus = function(initialStatus) {
  if (documentReviewStatus.hasOwnProperty(initialStatus)) {
    return documentReviewStatus[initialStatus];
  } else {
    return [];
  }
};

//Document Version
// 1	Active
// 2	Closed
// 3	Pending

const documentVersionStatus = {
  1: [
    {
      id: 1,
      name: "Active"
    },
  ],
  2: [
    {
      id: 2,
      name: "Closed"
    },
  ],
  3: [
    {
      id: 3,
      name: "Pending"
    },
    {
      id: 1,
      name: "Active"
    },
  ],
};
export const getDocumentVersionStatus = function(initialStatus) {
  if (documentVersionStatus.hasOwnProperty(initialStatus)) {
    return documentVersionStatus[initialStatus];
  } else {
    return [];
  }
};

//Info Upload
// 1	Active
// 2	Pending For Activation
// 3	Inactive

const infoUploadStatus = {
  1: [
    {
      id: 1,
      name: "Active"
    },
    {
      id: 3,
      name: "In Active"
    }
  ],
  2: [
    {
      id: 2,
      name: "Pending For Activation"
    },
    {
      id: 1,
      name: "Active"
    },
  ],
  3: [
    {
      id: 3,
      name: "Inactive"
    },
    {
      id: 1,
      name: "Active"
    },
  ],
};
export const getInfoUploadStatus = function(initialStatus) {
  if (infoUploadStatus.hasOwnProperty(initialStatus)) {
    return infoUploadStatus[initialStatus];
  } else {
    return [];
  }
};

const customerStatus = {
  1: [
    {
      id: 1,
      name: "Pending"
    },
    {
      id: 3,
      name: "Ready For Activation"
    }
  ],
  2: [
    {
      id: 2,
      name: "Active"
    }
  ],
  3: [
    {
      id: 3,
      name: "Ready For Activation"
    }
  ]
};
export const getCustomerStatus = function(status) {
  if (customerStatus.hasOwnProperty(status)) {
    return customerStatus[status];
  } else {
    return [];
  }
};

//PriorityType
//1	Low(amc : False)
//2	High(amc : True)

const priorityType = {
  0: [
    {
      id: 1,
      name: "Low(Non-AMC)"
    },
    {
      id: 2,
      name: "High(AMC)"
    }
  ]
};
export const getPriorityType = function(initialStatus) {
  if (priorityType.hasOwnProperty(initialStatus)) {
    return priorityType[initialStatus];
  } else {
    return [];
  }
};

//severityType
//1 Low
//2	Medium
//3 High
//4 Critical

const severityType = {
  0: [
    {
      id: 1,
      name: "Low"
    },
    {
      id: 2,
      name: "Medium"
    },
    {
      id: 3,
      name: "High"
    },
    {
      id: 4,
      name: "Critical"
    }
  ]
};
export const getSeverityType = function(initialStatus) {
  if (severityType.hasOwnProperty(initialStatus)) {
    return severityType[initialStatus];
  } else {
    return [];
  }
};
const escalationEvaluatorStatus = {
  1: [
    {
      id: 1,
      name: "Active"
    },
    {
      id: 3,
      name: "Terminated"
    }
  ],

  3: [
    {
      id: 3,
      name: "Terminated"
    }
  ],
  4: [
    {
      id: 4,
      name: "Pending for Activation"
    },
    {
      id: 1,
      name: "Active"
    },
    {
      id: 3,
      name: "Terminated"
    }
  ]
};
export const getEvaluatorStatus = function(initialStatus) {
  if (escalationEvaluatorStatus.hasOwnProperty(initialStatus)) {
    return escalationEvaluatorStatus[initialStatus];
  } else {
    return [];
  }
};

const RoleStatus = {
  2: [
    {
      id: 2,
      name: "Active"
    },
    {
      id: 3,
      name: "Suspended"
    },
    {
      id: 4,
      name: "Terminated"
    }
  ],
  3: [
    {
      id: 2,
      name: "Active"
    },
    {
      id: 3,
      name: "Suspended"
    },

    {
      id: 4,
      name: "Terminated"
    }
  ],
  4: [
    {
      id: 4,
      name: "Terminated"
    }
  ],
  1: [
    {
      id: 1,
      name: "Pending for Activation"
    },

    {
      id: 2,
      name: "Active"
    },
    {
      id: 4,
      name: "Terminated"
    }
  ]
};

export const getRoleStatus = function(initialStatus) {
  if (RoleStatus.hasOwnProperty(initialStatus)) {
    return RoleStatus[initialStatus];
  } else {
    return [];
  }
};

// BrandClassification Status
// 1.Active
// 2.Suspended
// 3.Terminated
// 4.Pending

const brandMappingStatus = {
  1: [
    {
      id: 1,
      name: "Active"
    },
    {
      id: 2,
      name: "Suspended"
    },
    {
      id: 3,
      name: "Terminated"
    }
  ],
  2: [
    {
      id: 2,
      name: "Suspended"
    },
    {
      id: 1,
      name: "Active"
    },

    {
      id: 3,
      name: "Terminated"
    }
  ],
  3: [
    {
      id: 3,
      name: "Terminated"
    }
  ],
  4: [
    {
      id: 4,
      name: "Pending for Activation"
    },
    {
      id: 1,
      name: "Active"
    }
  ]
};
export const getBrandMappingStatus = function(initialStatus) {
  if (brandMappingStatus.hasOwnProperty(initialStatus)) {
    return brandMappingStatus[initialStatus];
  } else {
    return [];
  }
};
