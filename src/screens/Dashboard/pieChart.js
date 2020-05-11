// import React from "react";

// import { Pie } from "react-chartjs-2";

// class PieCharts extends React.Component {
//   constructor() {
//     super();
//   }
//   render() {
//     const options = {
//       // maintainAspectRatio: false,
//       // responsive: false,
//       legend: {
//         position: this.props.legendPos,
//         display: true,
//         labels: {
//           boxWidth: 10,
//         },
//         itemMaxWidth: 200,
//       },
//     };
//     return (
//       <Pie data={this.props.data} options={options}>
//         {" "}
//       </Pie>
//     );
//   }
// }

// export default PieCharts;
import Chart from "chart.js";

function PieCharts(data, legendPos, id) {
  // console.log("test", document.getElementById(id));

  const options = {
    // maintainAspectRatio: false,
    // responsive: false,
    legend: {
      position: legendPos,
      display: true,
      // onHover: legendOnHover,
    },
  };

  var ctx1 = document.getElementById(id).getContext("2d");
  var chart = new Chart(ctx1, {
    type: "pie",
    data: data,
    options: options,
  });
  // document.getElementById("chart-legends").innerHTML = chart.generateLegend();
}

function legendOnHover(e, legendItem) {
  console.log(legendItem);
  // return <h1> {legendItem.text}</h1>;
}

export default PieCharts;
