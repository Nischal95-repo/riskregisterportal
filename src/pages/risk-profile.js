import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import RiskProfile from "../screens/Reports/riskProfile";

const breadCrumbData = [{ name: "Risk Profile" }];

const Home = () => (
  <>
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <RiskProfile />
    </LayoutContainer>
  </>
);

export default Home;
