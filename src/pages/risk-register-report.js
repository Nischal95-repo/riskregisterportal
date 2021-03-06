import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import Reports from "../screens/Reports/riskRegisterReports";

const breadCrumbData = [
  { link: "/reports", name: "Reports" },
  { name: "Risk Register Report" },
];

const Home = () => (
  <>
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <Reports />
    </LayoutContainer>
  </>
);

export default Home;
