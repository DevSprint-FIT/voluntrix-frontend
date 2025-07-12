"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type InstituteData = {
  name: string;
  value: number;
};

interface FollowersPieChartProps {
  data: InstituteData[];
  topCount?: number;
}

const COLORS_DARK = ["#029972", "#0cbc8b"]; // Tailwind verdant-600, verdant-500
const COLOR_LIGHT = "#ecfdf6"; // verdant-100

export default function FollowersPieChart({ data, topCount = 2 }: FollowersPieChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((acc, cur) => acc + cur.value, 0);

  const topInstitutes = sorted.slice(0, topCount);
  const othersValue = sorted.slice(topCount).reduce((acc, cur) => acc + cur.value, 0);

  const chartData = [
    ...topInstitutes,
    ...(othersValue > 0 ? [{ name: "Others", value: othersValue }] : [])
  ];

  return (
    <div>
      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            startAngle={90} 
            endAngle={-270} 
            labelLine={false}
            label={false}
            stroke="none"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index < topCount ? COLORS_DARK[index % COLORS_DARK.length] : COLOR_LIGHT}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Institute Names Row */}
      <div className="mt-0 bg-white  rounded-lg px-6 py-3 flex justify-between items-center text-center ">
        {topInstitutes.map((entry, index) => {
          const percentage = ((entry.value / total) * 100).toFixed(0);
          return (
            <div key={entry.name} className="flex items-center gap-2 w-1/2 justify-center mt-0">
              <div
                className="w-3 h-3 rounded-full "
                style={{ backgroundColor: COLORS_DARK[index % COLORS_DARK.length] }}
              />
              <div>
                <div className="text-sm text-shark-300">{entry.name}</div>
                <div className="text-xl font-bold text-shark-800">{percentage}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
