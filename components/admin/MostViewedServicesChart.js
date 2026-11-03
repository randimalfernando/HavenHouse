"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const GRID_COLOR = "#2a2d40";
const TEXT_COLOR = "#eceefa";
const TOOLTIP_BG = "#191b28";
const BAR_COLOR = "#5b5ff0";

export default function MostViewedServicesChart({ data }) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: narrow ? 8 : 24, left: 0, bottom: 4 }}>
            <CartesianGrid stroke={GRID_COLOR} horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fill: TEXT_COLOR, fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={narrow ? 96 : 140}
              tick={{ fill: TEXT_COLOR, fontSize: narrow ? 10 : 11 }}
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