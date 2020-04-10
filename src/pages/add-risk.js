import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import AddRiskRegister from "../screens/RiskRegister/createRiskRegister";

const breadCrumbData = [
  { link: "/user-profile", name: "User Profile" },
  { link: "/user-edit", name: "User Edit" }
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
