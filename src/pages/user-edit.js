import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import UserEdit from "../screens/profile/UserEdit";

const breadCrumbData = [
  { link: "/user-profile", name: "User Profile" },
  { link: "/user-edit", name: "User Edit" }
];

const Home = () => (
  <>
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <UserEdit />
    </LayoutContainer>
  </>
);

export default Home;
