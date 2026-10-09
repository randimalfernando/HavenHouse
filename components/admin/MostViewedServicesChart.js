"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const GRID_COLOR = "#2a2d40";
const TEXT_COLOR = "#eceefa";
const TOOLTIP_BG = "#191b28";
const BAR_COLOR = "#5b5ff0";

export default function MostViewedServicesChart({ data }) {
  return (
    <div className="card dashboard-chart-card">
      <h3 style={{ marginBottom: "0.25rem" }}>Most viewed services</h3>
      <br/>

      {/* <p style={{ marginTop: 0, marginBottom: "1rem", fontSize: "0.85rem", opacity: 0.7 }}>
        Page views, not unique visitors
      </p> */}
      {data.length === 0 ? (
        <p style={{ opacity: 0.75 }}>No views recorded yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height="75%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
            <CartesianGrid stroke={GRID_COLOR} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: TEXT_COLOR, fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fill: TEXT_COLOR, fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ background: TOOLTIP_BG, border: "1px solid " + GRID_COLOR, borderRadius: 10 }}
              labelStyle={{ color: TEXT_COLOR }}
              itemStyle={{ color: TEXT_COLOR }}
              formatter={(value, _name, item) => [`${value} views`, item.payload.category]}
            />
            <Bar dataKey="views" radius={[0, 6, 6, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={BAR_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}