"use client";

import { Line } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export function TrendChart({ data }: { data: Array<{ month: string; avgScore: number }> }) {
  if (!data || data.length === 0) return <p className="text-sm text-gray-400">No trend data yet.</p>;

  return (
    <Line
      data={{
        labels: data.map((d) => d.month),
        datasets: [{
          label: "V Score",
          data: data.map((d) => d.avgScore),
          borderColor: "#FF5C5C",
          backgroundColor: "rgba(255, 92, 92, 0.08)",
          borderWidth: 2.5,
          pointBackgroundColor: "#FF5C5C",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3,
          fill: true,
        }]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#111",
            titleFont: { size: 12 },
            bodyFont: { size: 14, weight: "bold" },
            padding: 12,
            cornerRadius: 8,
          }
        },
        scales: {
          y: { min: 1, max: 5, grid: { color: "#f3f4f6" }, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        }
      }}
    />
  );
}
