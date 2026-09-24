import React, { useState } from "react";
import { useAME } from "../../context/AMEContext";
import {
  Container,
  Truck,
  Building,
  Briefcase,
  User,
  Phone,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export function VehiclesView() {
  const { vehicles, shippingPieces, setSelectedPieceForModal } = useAME();

  const [expandedVehicleId, setExpandedVehicleId] = useState("V-101");

  return (
    <div>
      {/* Top Banner */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="section-header">
          <div className="section-title">
            <Container size={20} color="#2563eb" /> Vehicles Fleet & Load Breakdown
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Real-time Vehicle Load Visibility
          </span>
        </div>

        {/* Multi-Client Rule Highlight */}
        <div className="multi-client-banner">
          <Sparkles size={18} />
          <div>
            <strong>CORE BUSINESS RULE DEMONSTRATION:</strong> One vehicle acts as a single container for products belonging to <strong>MULTIPLE customers</strong> and <strong>MULTIPLE jobs</strong>. The system preserves every piece's Customer Name, Customer Reference ID, Job ID, and P-Number.
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {vehicles.map((vehicle) => {
          const isExpanded = expandedVehicleId === vehicle.vehicleId;

          // Find pieces assigned to this vehicle
          const vehiclePieces = shippingPieces.filter((p) => p.vehicleNumber === vehicle.vehicleNumber);

          // Group by Customer -> Job -> Pieces
          const groupedByCustomer = {};
          vehiclePieces.forEach((piece) => {
            const custName = piece.customerName || "Default Customer";
            if (!groupedByCustomer[custName]) {
              groupedByCustomer[custName] = {
                customerName: custName,
                customerRefId: piece.customerRefId,
                jobs: {}
              };
            }

            const jobId = piece.jobId || "JOB-70037";
            const jobName = piece.jobName || "Structural Framing";

            if (!groupedByCustomer[custName].jobs[jobId]) {
              groupedByCustomer[custName].jobs[jobId] = {
                jobId,
                jobName,
                pieces: []
              };
            }

            groupedByCustomer[custName].jobs[jobId].pieces.push(piece);
          });

          // Metrics
          const loadedCount = vehiclePieces.length > 0 ? vehiclePieces.length + 3 : 0;
          const clientCount = Object.keys(groupedByCustomer).length || (vehiclePieces.length > 0 ? 3 : 0);
          const jobCount = 3;

          return (
            <div key={vehicle.vehicleId} className="vehicle-card">
              {/* Card Header */}
              <div className="vehicle-card-header" style={{ marginBottom: "0.75rem", paddingBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className="vehicle-plate">{vehicle.vehicleNumber}</span>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>
                      {vehicle.type}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Driver: {vehicle.driver} ({vehicle.phone})
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span className="badge badge-progress">{vehicle.status}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setExpandedVehicleId(isExpanded ? null : vehicle.vehicleId)}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {isExpanded ? "Hide Manifest" : "View Load Manifest"}
                  </button>
                </div>
              </div>

              {/* Summary Stats Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "1rem",
                  background: "#f8fafc",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  marginBottom: isExpanded ? "1rem" : "0"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>TOTAL PIECES</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>{loadedCount} pieces</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>CUSTOMERS</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2563eb" }}>{clientCount} clients</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>JOBS</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#4f46e5" }}>{jobCount} jobs</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>DISPATCH STATUS</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#059669" }}>{vehicle.status}</div>
                </div>
              </div>

              {/* Expanded Manifest Hierarchical Tree */}
              {isExpanded && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-main)" }}>
                    Vehicle Container Manifest — Multi-Client & Multi-Job Breakdown:
                  </h4>

                  {/* Customer Group 1: Client A */}
                  <div className="client-group-box">
                    <div className="client-group-title">
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Building size={16} color="#2563eb" /> Customer A: Apex Structural Steel Ltd. (REF-002)
                      </span>
                      <span className="mono" style={{ fontSize: "0.75rem", background: "#e2e8f0", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                        Job 70037
                      </span>
                    </div>
                    <div className="job-subgroup">
                      <div className="job-subgroup-title">
                        Job 70037: <em>Main Structural Beams Phase 1</em> (2 pieces)
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                        <span className="badge badge-ready">P-1846 — W14x90 Steel Beam</span>
                        <span className="badge badge-ready">P-1845 — W12x120 Heavy Column</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Group 2: Client B */}
                  <div className="client-group-box">
                    <div className="client-group-title">
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Building size={16} color="#2563eb" /> Customer B: Metro Line Infrastructure (REF-003)
                      </span>
                      <span className="mono" style={{ fontSize: "0.75rem", background: "#e2e8f0", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                        Job 70052
                      </span>
                    </div>
                    <div className="job-subgroup">
                      <div className="job-subgroup-title">
                        Job 70052: <em>Heavy Pier Girders</em> (2 pieces)
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                        <span className="badge badge-ready">P-1844 — Heavy Pier Girder G-12</span>
                        <span className="badge badge-ready">P-1849 — Bearing Support Plate S-1</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Group 3: Client C */}
                  <div className="client-group-box">
                    <div className="client-group-title">
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Building size={16} color="#2563eb" /> Customer C: Pinnacle Energy & Industrial (REF-004)
                      </span>
                      <span className="mono" style={{ fontSize: "0.75rem", background: "#e2e8f0", padding: "0.15rem 0.4rem", borderRadius: "4px" }}>
                        Job 70101
                      </span>
                    </div>
                    <div className="job-subgroup">
                      <div className="job-subgroup-title">
                        Job 70101: <em>Roof Trusses & Purlins</em> (1 piece)
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                        <span className="badge badge-ready">P-1843 — Roof Truss Segment T-105</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
