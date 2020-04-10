import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import UserProfile from "../screens/profile/UserProfile";

const breadCrumbData = [{ link: "/user-profile", name: "User Profile" }];

const Home = () => (
  <>
    {/* <link
        href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      /> */}
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <UserProfile />
    </LayoutContainer>
  </>
);

export default Home;
