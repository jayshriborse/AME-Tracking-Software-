import React from "react";
import { Truck } from "lucide-react";

export function ActiveTransit({ activeTransit }) {
  return (
    <div className="card">
      <div className="section-header" style={{ marginBottom: "0.5rem" }}>
        <div className="section-title"><Truck size={14} color="#8b5cf6" /> Active Transit</div>
      </div>
      {activeTransit ? (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Transit Number</span>
            <strong className="mono">{activeTransit.transitNumber}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Status</span>
            <span className="badge badge-pending">{activeTransit.status}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Pieces</span>
            <strong>{activeTransit.totalPieces}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Customers</span>
            <strong>{activeTransit.totalCustomers}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Jobs</span>
            <strong>{activeTransit.totalJobs}</strong>
          </div>
        </div>
      ) : (
        <div className="empty-state" style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)" }}>No data available</div>
      )}
    </div>
  );
}
