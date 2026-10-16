"use client";

import { useState } from "react";

// Simplified state outlines as [longitude, latitude] points.
const SHAPES = {
  WA: [[129,-14.9],[127.8,-14.1],[126,-13.9],[124.6,-15.0],[122.9,-16.4],[122.2,-18.0],[120,-19.8],[118.6,-20.3],[116.7,-20.6],[114.1,-21.8],[113.7,-24.9],[113.4,-26.0],[114.6,-28.8],[115.7,-32.0],[115.1,-34.3],[117.9,-35.0],[121.9,-33.9],[124.5,-33.0],[126.5,-32.3],[129,-31.7]],
  NT: [[129,-14.9],[129.5,-13.8],[130.0,-12.8],[130.8,-12.4],[132.6,-11.5],[134.5,-12.0],[136.8,-12.2],[136.9,-11.1],[135.9,-13.3],[135.5,-14.8],[136.7,-15.9],[138,-16.6],[138,-26],[129,-26]],
  SA: [[129,-26],[138,-26],[141,-26],[141,-34],[141,-38.05],[140.0,-37.0],[139.3,-35.6],[138.1,-35.7],[137.5,-35.6],[135.8,-34.9],[134.9,-33.6],[133.5,-32.2],[131.0,-31.5],[129,-31.7]],
  QLD: [[138,-16.6],[139.0,-17.6],[140.0,-17.7],[141.0,-17.0],[141.6,-15.3],[141.6,-13.0],[142.1,-10.9],[143.5,-13.5],[144.0,-14.5],[145.3,-15.0],[145.8,-16.9],[146.8,-19.3],[149.2,-21.2],[150.5,-22.4],[151.3,-23.8],[153.2,-25.0],[153.1,-27.5],[153.55,-28.17],[153.0,-28.2],[150.0,-28.9],[148.9,-29.0],[141,-29],[141,-26],[138,-26]],
  NSW: [[141,-29],[148.9,-29.0],[150.0,-28.9],[153.0,-28.2],[153.55,-28.17],[153.4,-29.4],[153.1,-30.3],[152.9,-31.4],[152.5,-32.4],[151.8,-32.9],[151.3,-33.9],[150.9,-34.4],[150.7,-35.1],[150.2,-35.7],[150.1,-37.0],[149.97,-37.5],[148.0,-36.9],[147.9,-36.2],[146.0,-36.0],[144.0,-35.8],[143.0,-35.2],[142.0,-34.5],[141,-34]],
  VIC: [[141,-34],[142.0,-34.5],[143.0,-35.2],[144.0,-35.8],[146.0,-36.0],[147.9,-36.2],[148.0,-36.9],[149.97,-37.5],[148.0,-37.8],[146.4,-39.1],[144.7,-38.1],[143.5,-38.8],[141.9,-38.4],[141,-38.05]],
  TAS: [[144.7,-40.7],[148.3,-40.9],[148.2,-41.9],[148.0,-43.0],[147.3,-43.3],[146.3,-43.6],[145.3,-42.5],[145.0,-41.2]],
  ACT: [[148.76,-35.12],[149.4,-35.12],[149.4,-35.92],[148.76,-35.92]],
};

// Where each state's label sits [lon, lat].
const LABEL_AT = { WA: [122, -25], NT: [133.5, -19.5], SA: [134.5, -30], QLD: [144.5, -23], NSW: [146.5, -32.2], VIC: [144.3, -36.9], TAS: [146.6, -45.2] };

const W = 460, H = 400, SCALE = 9.6, X0 = 112, Y0 = -10, K = 0.89;
const px = (lon) => 12 + (lon - X0) * K * SCALE;
const py = (lat) => 12 + (Y0 - lat) * SCALE;
const path = (pts) => pts.map(([lo, la], i) => `${i ? "L" : "M"}${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join(" ") + "Z";

const ACCENT = "#5b5ff0";

function shade(count, max) {
  if (!count) return { fill: "currentColor", opacity: 0.1 };
  const t = max <= 1 ? 1 : 0.3 + 0.7 * (count / max);
  return { fill: ACCENT, opacity: t };
}

export default function ServicesByStateMap({ data }) {
  const [active, setActive] = useState(null);
  const states = data?.states || [];
  const byCode = Object.fromEntries(states.map((s) => [s.code, s]));
  const max = Math.max(1, ...states.map((s) => s.count));
  const shown = active ? byCode[active] : null;

  return (
    <div className="dashboard-chart-card services-map">
      <h2 className="services-map__title">Services by state</h2>
      <div className="services-map__body">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of Australia showing the number of services in each state" className="services-map__svg">
          {Object.entries(SHAPES).map(([code, pts]) => {
            const s = byCode[code] || { count: 0 };
            const { fill, opacity } = shade(s.count, max);
            return (
              <path
                key={code}
                d={path(pts)}
                fill={fill}
                fillOpacity={opacity}
                stroke="currentColor"
                strokeOpacity={active === code ? 0.9 : 0.35}
                strokeWidth={active === code ? 2 : 1}
                strokeLinejoin="round"
                onMouseEnter={() => setActive(code)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(code)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                aria-label={`${code}: ${s.count} service${s.count === 1 ? "" : "s"}`}
                style={{ cursor: "pointer", outline: "none" }}
              />
            );
          })}
          {Object.entries(LABEL_AT).map(([code, [lo, la]]) => {
            const s = byCode[code] || { count: 0 };
            return (
              <g key={code} pointerEvents="none" fill="currentColor" textAnchor="middle">
                <text x={px(lo)} y={py(la)} fontSize="13" fontWeight="700">{code}</text>
                <text x={px(lo)} y={py(la) + 17} fontSize="16" fontWeight="700">{s.count}</text>
              </g>
            );
          })}
          {/* ACT is too small to hold a label inside, so it gets a callout */}
          <g pointerEvents="none" fill="currentColor" fontSize="12" fontWeight="700">
            <line x1={px(149.4)} y1={py(-35.5)} x2={px(152.2)} y2={py(-36.2)} stroke="currentColor" strokeOpacity="0.5" />
            <text x={px(152.4)} y={py(-36.3)}>ACT {(byCode.ACT || { count: 0 }).count}</text>
          </g>
        </svg>

        <div className="services-map__side">
          <div className="services-map__detail" aria-live="polite">
            {shown ? (
              <>
                <strong>{shown.name}</strong>
                <span>{shown.count} service{shown.count === 1 ? "" : "s"}</span>
                {shown.services.length > 0 && (
                  <ul>
                    {shown.services.slice(0, 5).map((n) => <li key={n}>{n}</li>)}
                    {shown.services.length > 5 && <li>+{shown.services.length - 5} more</li>}
                  </ul>
                )}
              </>
            ) : (
              <span>Hover a state to see its services.</span>
            )}
          </div>

          <ul className="services-map__list">
            {[...states].sort((a, b) => b.count - a.count).map((s) => (
              <li key={s.code} onMouseEnter={() => setActive(s.code)} onMouseLeave={() => setActive(null)}>
                <span className="services-map__code">{s.code}</span>
                <span className="services-map__bar"><span style={{ width: `${(s.count / max) * 100}%` }} /></span>
                <span className="services-map__count">{s.count}</span>
              </li>
            ))}
          </ul>

          {data?.unknown > 0 && (
            <p className="services-map__note">
              {data.unknown} service{data.unknown === 1 ? " has" : "s have"} no valid postcode, so {data.unknown === 1 ? "it isn't" : "they aren't"} on the map.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
