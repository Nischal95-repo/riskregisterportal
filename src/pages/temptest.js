// import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// // import "@zendeskgarden/react-tables/dist/styles.css";

// import { ThemeProvider } from "@zendeskgarden/react-theming";
// import {
//   Table,
//   Caption,
//   Head,
//   HeaderRow,
//   HeaderCell,
//   Body,
//   Row,
//   Cell
// } from "@zendeskgarden/react-tables";

// class temptest extends Component {
//   // Normally you would want to split things out into separate components.
//   // But in this example everything is just done in one place for simplicity
//   render() {
//     return (
//       <React.Fragment>
//         <div>
//           <h>sdfds</h>
//           <ThemeProvider>
//             <Table>
//               <Caption>Your Unsolved Tickets</Caption>
//               <Head>
//                 <HeaderRow>
//                   <HeaderCell width="25%">Subject</HeaderCell>
//                   <HeaderCell width="25%">Requester</HeaderCell>
//                   <HeaderCell width="25%">Requested</HeaderCell>
//                   <HeaderCell width="25%">Type</HeaderCell>
//                 </HeaderRow>
//               </Head>
//               <Body>
//                 <Row>
//                   <Cell width="25%">Where are my shoes?</Cell>
//                   <Cell width="25%">John Smith</Cell>
//                   <Cell width="25%">15 minutes ago</Cell>
//                   <Cell width="25%">Ticket</Cell>
//                 </Row>
//                 <Row>
//                   <Cell width="25%">I was charged twice!</Cell>
//                   <Cell width="25%">Jane Doe</Cell>
//                   <Cell width="25%">25 minutes ago</Cell>
//                   <Cell width="25%">Call</Cell>
//                 </Row>
//               </Body>
//             </Table>
//           </ThemeProvider>
//           ;
//         </div>
//       </React.Fragment>
//     );
//   }
// }
// export default temptest;
// Put the thing into the DOM!
// ReactDOM.render(<App />, document.getElementById("root"));
import BreadCrumb from "../screens/Common/BreadCrumb";
import React from "react";

import LayoutContainer from "../screens/layout/admin-dashboard";
import Temp from "../src/components/QuestionsAns/Temp";
import { ThemeProvider } from "@zendeskgarden/react-theming";
import {
  Table,
  Caption,
  Head,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell
} from "@zendeskgarden/react-tables";

const breadCrumbData = [
  { link: "/test-list", name: "Test List" },
  { link: "/test-add", name: "Test Add" }
];
const temptest = () => (
  <>
    <LayoutContainer>
      <BreadCrumb data={breadCrumbData} />
      <Temp />
    </LayoutContainer>
  </>
);

export default temptest;
