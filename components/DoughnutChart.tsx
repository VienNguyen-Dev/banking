"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const data = {
    labels: accounts.map((account) => account.name),
    datasets: [
      {
        label: "Banks",
        data: accounts.map((account) => account.currentBalance),
        backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"],
      },
    ],
  };
  return (
    <Doughnut
      data={data}
      options={{
        cutout: "60%",
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
