import Chart from "chart.js";

function PieCharts(data, legendPos, id, display = true) {
  // console.log("test", document.getElementById(id));

  const options = {
    // maintainAspectRatio: false,
    // responsive: false,
    legend: {
      position: legendPos,
      display: display,
      align: "center",
      // onHover: legendOnHover,
      labels: { usePointStyle: true, boxWidth: 10, fontSize: 10 },
      // onClick: function(e, legendItem) {
      //   var index = legendItem.datasetIndex;
      //   var ci = this.chart;

      // var alreadyHidden =
      //   ci.getDatasetMeta(index).hidden === null
      //     ? false
      //     : ci.getDatasetMeta(index).hidden;

      // ci.data.datasets.forEach(function(e, i) {
      //   var meta = ci.getDatasetMeta(i);

      //   if (i !== index) {
      //     if (!alreadyHidden) {
      //       meta.hidden = meta.hidden === null ? !meta.hidden : null;
      //     } else if (meta.hidden === null) {
      //       meta.hidden = true;
      //     }
      //   } else if (i === index) {
      //     meta.hidden = null;
      //   }
      // });

      // ci.update();
      // },
    },
  };

  var ctx1 = document.getElementById(id).getContext("2d");
  var chart = new Chart(ctx1, {
    type: "pie",
    data: data,
    options: options,
  });
  // document.getElementById("chart-legends").innerHTML = chart.generateLegend();
  // document.getElementById("js-legend").innerHTML = chart.generateLegend();
}

// $("#js-legend > ul > li").on("click",function(e){
//   //console.log(this,e.view.myChart,);
//           var index = $(this).index();
//           $(this).toggleClass("strike")
//           var ci = e.view.myChart;
//           console.log(index)
//           //var meta = ci.getDatasetMeta(index);
//           console.log();
//           var curr = ci.data.datasets[0]._meta[0].data[index];

//           curr.hidden = !curr.hidden
//          /*if (meta.dataset) {
//             meta.hidden = !meta.hidden;
//          } else {
//             meta.data[index].hidden = !meta.data[index].hidden;
//           }*/

//           // We hid a dataset ... rerender the chart
//           ci.update();
//   })
// Chart.Legend.prototype.afterFit = function() {
//   this.width = this.width + 50;
// };
// function legendOnHover(e, legendItem) {
//   console.log(legendItem);
//   // return <h1> {legendItem.text}</h1>;
// }

export default PieCharts;
