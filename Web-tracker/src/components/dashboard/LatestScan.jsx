import React from "react";
import { Clock, MapPin } from "lucide-react";

export function LatestScan({ latestScan, formatScanDateTime }) {
  return (
    <div className="card">
      <div className="section-header" style={{ marginBottom: "0.5rem" }}>
        <div className="section-title"><Clock size={14} color="#10b981" /> Latest Scan</div>
      </div>
      {latestScan ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Piece No.</span>
            <strong className="mono">{latestScan.pieceNo}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Job ID</span>
            <strong className="mono">{latestScan.jobId}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Download No.</span>
            <strong className="mono">{latestScan.downloadNo}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Status</span>
            <span className="badge badge-scanned">{latestScan.status}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Date & Time</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{formatScanDateTime(latestScan.scanDateTime)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Location</span>
            <span style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <MapPin size={12} color="#0ea5e9" /> {latestScan.scanLocation}
            </span>
          </div>
        </div>
      ) : (
        <div className="empty-state" style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)" }}>No data available</div>
      )}
    </div>
  );
}
