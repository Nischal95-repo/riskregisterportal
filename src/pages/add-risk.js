import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import AddRiskRegister from "../screens/RiskRegister/createRiskRegister";

const breadCrumbData = [
  { link: "/risk-register", name: "Risk Register" },
  { name: "Add Risk" }
];

const Home = () => (
  <>
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <AddRiskRegister />
    </LayoutContainer>
  </>
);

export default Home;
