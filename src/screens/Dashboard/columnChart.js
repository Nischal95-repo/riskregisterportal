import React from "react";

import { Bar } from "react-chartjs-2";

class PieCharts extends React.Component {
  constructor() {
    super();
  }
  render() {
    const options = {
      legend: {
        position: this.props.legendPos,
        display: true,
      },
      hAxis: {
        title: "Departments",
      },
      vAxis: {
        title: "Risk",
        // ticks: [5, 10, 15, 20]
      },
    };
    return (
      <Bar data={this.props.data} options={options}>
        {" "}
      </Bar>
    );
  }
}

export default PieCharts;
