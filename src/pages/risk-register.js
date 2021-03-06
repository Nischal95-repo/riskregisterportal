import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import RiskRegister from "../screens/RiskRegister/RiskRegister";

const breadCrumbData = [
  { link: "/dashboard", name: "Dashboard" },
  { name: "Risk Register" }
];

const Home = () => (
  <>
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <RiskRegister />
    </LayoutContainer>
  </>
);

export default Home;
