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
    },
    legendCallback: function(chart) {
      console.log("text", chart.data);
      var text = [];
      text.push("<ul>");
      for (var i = 0; i < chart.data.datasets.length; i++) {
        console.log(chart.data.datasets[i]); // see what's inside the obj.
        text.push("<li>");
        text.push(
          '<span style="background-color:' +
            chart.data.datasets[i].borderColor +
            '">' +
            chart.data.datasets[i].label +
            "</span>"
        );
        text.push("</li>");
      }
      text.push("</ul>");
      return text.join("");
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

export default PieCharts;
