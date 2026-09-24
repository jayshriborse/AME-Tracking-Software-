import React from "react";
import { Clock } from "lucide-react";

export function RecentScans({ recentScans, formatScanDateTime }) {
  return (
    <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div className="section-header" style={{ marginBottom: "1rem" }}>
        <div className="section-title">
          <Clock size={14} color="#2563eb" /> RECENT SCANS
        </div>
      </div>
      
      <div className="table-container" style={{ flex: 1 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Piece No.</th>
              <th>Job ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentScans?.map((act, i) => (
              <tr key={i} style={{ cursor: "default" }}>
                <td style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
                  {formatScanDateTime(act.scanDateTime)}
                </td>
                <td className="mono" style={{ fontWeight: 700 }}>{act.pieceNo}</td>
                <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>{act.jobId}</td>
                <td><span className="badge badge-scanned">{act.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(!recentScans || recentScans.length === 0) && (
        <div className="empty-state" style={{ marginTop: "1rem", textAlign: "center", color: "var(--text-muted)", padding: "1rem" }}>
          <p>No records found</p>
        </div>
      )}
    </div>
  );
}
