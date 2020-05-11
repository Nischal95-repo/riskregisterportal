// import React from "react";

// import { Bar } from "react-chartjs-2";

// class PieCharts extends React.Component {
//   constructor() {
//     super();
//   }
//   render() {
//     console.log("count", this.props.data.count);
//     const options = {
//       legend: {
//         position: this.props.legendPos,
//         display: true,
//       },
//       scales: {
//         yAxes: [
//           {
//             ticks: {
//               min: 0,
//               max: parseInt(this.props.data.count) + 5,
//               // stepWidth: 5,
//             },
//           },
//         ],
//       },
//     };
//     return (
//       <Bar data={this.props.data} options={options}>
//         {" "}
//       </Bar>
//     );
//   }
// }

// export default PieCharts;

import Chart from "chart.js";

function ColumnCharts(data, legendPos, id) {
  console.log("test", document.getElementById(id));
  const options = {
    // maintainAspectRatio: false,
    // responsive: false,
    legend: {
      position: legendPos,
      display: false,
      labels: {
        boxWidth: 10,
      },
      itemMaxWidth: 200,
    },
    tooltips: {
      callbacks: {
        title: function(t, d) {
          console.log(t, d);
          return d.labels[t[0].index];
        },
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            max: parseInt(data.count) + 5,
            // max: 10,
            stepSize: 2,
          },
          scaleLabel: {
            display: true,
            labelString: "Risk",
            fontColor: "black",
            fontSize: 15,
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Department",
            fontColor: "black",
            fontSize: 15,
            tooltips: {
              callbacks: {
                title: function(t, d) {
                  console.log(t, d);
                  return d.labels[t[0].index];
                },
              },
            },
          },
          ticks: {
            callback: function(label, index, values) {
              if (label.length > 10) {
                return label.substring(0, 10) + "...";
              } else {
                return label;
              }
            },
          },
        },
      ],
    },
  };

  var ctx1 = document.getElementById(id).getContext("2d");
  window.myBar = new Chart(ctx1, {
    type: "bar",
    data: data,
    options: options,
  });
}

export default ColumnCharts;
