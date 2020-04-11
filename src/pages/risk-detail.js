import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import RiskProfile from "../screens/RiskRegister/RiskProfile";

const breadCrumbData = [
  { link: "/risk-register", name: "Risk Register" },
  { name: "Risk Details" }
];

const Home = () => (
  <>
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <RiskProfile />
    </LayoutContainer>
  </>
);

export default Home;
