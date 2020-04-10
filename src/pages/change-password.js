import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";
import LayoutContainer from "../screens/layout/admin-dashboard";
import ChangePassword from "../screens/profile/changePassword";

const breadCrumbData = [
  { link: "/user-profile", name: "User Profile" },
  { name: "Change Password" }
];

const changePassword = () => {
  return (
    <>
      <LayoutContainer>
        <BreadCrumb data={breadCrumbData} />
        <ChangePassword />
      </LayoutContainer>
    </>
  );
};

export default changePassword;
