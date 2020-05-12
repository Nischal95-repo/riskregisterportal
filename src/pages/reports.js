import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import Reports from "../screens/Reports/reports";

const breadCrumbData = [{ link: "/reports", name: "Reports" }];

const Home = () => (
  <>
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <Reports />
    </LayoutContainer>
  </>
);

export default Home;
