import React from "react";

export function DashboardKPI({ value, totalMax, label, ringColor }) {
  const r    = 28;
  const circ = 2 * Math.PI * r;
  const pct  = totalMax > 0 ? Math.min(value / totalMax, 1) : 1;
  
  return (
    <div className="circular-stat-card">
      <div className="circle-ring-wrapper">
        <svg className="circle-ring-svg" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r={r} fill="none" stroke="#f1f5f9" strokeWidth="5" />
          <circle cx="35" cy="35" r={r} fill="none" stroke={ringColor} strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={circ - pct * circ}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="circle-inner-content">
          <span className="circle-value" style={{ fontSize: value >= 10000 ? "0.72rem" : value >= 1000 ? "0.8rem" : "0.95rem", fontWeight: 700, color: ringColor, lineHeight: 1 }}>
            {value >= 1000000
              ? (value / 1000000).toFixed(1) + "M"
              : value >= 1000
              ? (value / 1000).toFixed(value >= 10000 ? 0 : 1) + "k"
              : value}
          </span>
        </div>
      </div>
      <div className="circle-label">{label}</div>
    </div>
  );
}
