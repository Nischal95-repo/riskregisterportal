import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import Home from "../screens/Common/home";
const breadCrumbData = [{ link: "/home", name: "Dashboard" }];

const HomePage = () => (
  <>
    <LayoutContainer>
      {/* <BreadCrumb data={breadCrumbData} /> */}
      <Home />
    </LayoutContainer>
  </>
);

export default HomePage;
