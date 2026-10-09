"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TEXT_COLOR = "#eceefa";
const TOOLTIP_BG = "#191b28";
const GRID_COLOR = "#2a2d40";

export default function ServicesPerCategoryChart({ data }) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="card dashboard-chart-card">
      <h3 style={{ marginBottom: "1rem" }}>Services per category</h3>
      {!hasData ? (
        <p style={{ opacity: 0.75 }}>No services yet — this chart will fill in as services are added.</p>
      ) : (
        <ResponsiveContainer width="100%" height="88%">
          <PieChart>
            <Pie
              data={data.filter((d) => d.value > 0)}
              dataKey="value"
              nameKey="label"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={2}
              label={({ value }) => value}
              labelLine={false}
            >
              {data.filter((d) => d.value > 0).map((entry) => (
                <Cell key={entry.label} fill={entry.chartColor} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: TOOLTIP_BG, border: "1px solid " + GRID_COLOR, borderRadius: 10 }}
              labelStyle={{ color: TEXT_COLOR }}
              itemStyle={{ color: TEXT_COLOR }}
            />
            <Legend wrapperStyle={{ color: TEXT_COLOR, fontSize: 11 }} layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}