import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import Dashboard from "../screens/Dashboard/dashboard";

const breadCrumbData = [{ link: "/dashboard", name: "Dashboard" }];

const Home = () => (
  <>
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <Dashboard />
    </LayoutContainer>
  </>
);

export default Home;
