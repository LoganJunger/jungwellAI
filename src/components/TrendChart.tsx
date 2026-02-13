"use client";

import { Line } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function TrendChart({ data }: { data: Array<{ month: string; avgScore: number }> }) {
  return (
    <Line
      data={{
        labels: data.map((d) => d.month),
        datasets: [{ label: "V Score", data: data.map((d) => d.avgScore), borderColor: "#FF5C5C", backgroundColor: "#F28C13" }]
      }}
      options={{ responsive: true, scales: { y: { min: 1, max: 5 } } }}
    />
  );
}
