import React from "react";
import { Activity } from "lucide-react";

export function ScanningProgress({ scanned, total, scanningProgress }) {
  const r    = 45;
  const circ = 2 * Math.PI * r;
  const pct = scanningProgress !== undefined ? scanningProgress : (total > 0 ? Math.round((scanned / total) * 100) : 0);

  return (
    <div className="scanning-progress-card">
      <div className="section-title" style={{ marginBottom: "0.2rem", justifyContent: "center" }}>
        <Activity size={14} color="#2563eb" /> Scanning Progress
      </div>

      <div className="large-circle-ring-wrapper">
        <svg className="circle-ring-svg" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle cx="55" cy="55" r={r} fill="none" stroke="url(#scanGrad)" strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
          <defs>
            <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
        <div className="circle-inner-content">
          <div className="large-circle-label">Scanned</div>
        </div>
      </div>
    </div>
  );
}
