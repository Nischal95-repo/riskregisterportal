import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import ApproveMitigation from "../screens/MitigationPlan/mitigationApproval";

const breadCrumbData = [
  { link: "/risk-register", name: "Risk Register" },
  { name: "Risk Details" }
];

const Home = () => (
  <>
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <ApproveMitigation />
    </LayoutContainer>
  </>
);

export default Home;
