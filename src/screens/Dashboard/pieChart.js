import React from "react";

import { Pie } from "react-chartjs-2";

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
    };
    return (
      <Pie data={this.props.data} options={options}>
        {" "}
      </Pie>
    );
  }
}

export default PieCharts;
