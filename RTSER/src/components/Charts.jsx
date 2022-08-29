import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";

const classes = [
  "Angry 😠",
  "Disgust 🤮",
  "Fear 😨",
  "Happy 😃",
  "Neutral 😐",
  "Pleasantly Surprised 😲",
  "Sad 😭",
];

export default function ({ title, predictions }) {
  const chartRef = useRef();

  if (chartRef.current) {
    if (chartRef.current.chart) {
      console.log(chartRef.current.chart);
      chartRef.current.chart.destroy();
    }
  }

  const chartData = {
    labels: classes,
    datasets: [
      {
        label: title,
        data: predictions,
        barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
      },
    ],
  };

  const config = {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };

  return (
    <>
      <Bar redraw={true} ref={chartRef} data={chartData} />
    </>
  );
}
