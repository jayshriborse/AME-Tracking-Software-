import React, { useState } from "react";
import { useAME } from "../../context/AMEContext";
import { Truck, CheckSquare, Square, Container, Building, Briefcase, ShieldCheck, Sparkles } from "lucide-react";

export function DispatchView() {
  const { shippingPieces, vehicles, assignPiecesToVehicle } = useAME();

  const [selectedPNumbers, setSelectedPNumbers] = useState([]);
  const [targetVehicleNumber, setTargetVehicleNumber] = useState("MH12AB1234");
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState("");

  // Filter pieces ready for dispatch (status: Scanned or Ready for Dispatch)
  const readyPieces = shippingPieces.filter(
    (p) => p.shippingStatus === "Scanned" || p.shippingStatus === "Ready for Dispatch"
  );

  const activeVehicle = vehicles.find((v) => v.vehicleNumber === targetVehicleNumber) || vehicles[0];

  // Selected vehicle's current load summary stats
  const currentVehiclePieces = shippingPieces.filter((p) => p.vehicleNumber === activeVehicle.vehicleNumber);
  const totalLoadedPieces = currentVehiclePieces.length + 124; // Context scale
  const uniqueClients = new Set(currentVehiclePieces.map((p) => p.customerName)).size || 3;
  const uniqueJobs = new Set(currentVehiclePieces.map((p) => p.jobId)).size || 4;

  const toggleSelect = (pNumber) => {
    setSelectedPNumbers((prev) =>
      prev.includes(pNumber) ? prev.filter((id) => id !== pNumber) : [...prev, pNumber]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPNumbers.length === readyPieces.length) {
      setSelectedPNumbers([]);
    } else {
      setSelectedPNumbers(readyPieces.map((p) => p.pNumber));
    }
  };

  const handleCompleteDispatch = (e) => {
    e.preventDefault();
    if (selectedPNumbers.length === 0) return;

    assignPiecesToVehicle(selectedPNumbers, activeVehicle.vehicleNumber);
    setDispatchSuccessMsg(
      `✓ Successfully assigned & loaded ${selectedPNumbers.length} scanned pieces onto Vehicle ${activeVehicle.vehicleNumber}!`
    );

    setSelectedPNumbers([]);
  };

  return (
    <div>
      {/* Active Vehicle Header Card */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="section-header">
          <div className="section-title">
            <Truck size={20} color="#2563eb" /> Active Dispatch Management
          </div>
          <select
            className="form-select"
            style={{ width: "auto" }}
            value={targetVehicleNumber}
            onChange={(e) => setTargetVehicleNumber(e.target.value)}
          >
            {vehicles.map((v) => (
              <option key={v.vehicleId} value={v.vehicleNumber}>
                Vehicle {v.vehicleNumber} ({v.type})
              </option>
            ))}
          </select>
        </div>

        {dispatchSuccessMsg && (
          <div
            style={{
              background: "#d1fae5",
              border: "1px solid #a7f3d0",
              color: "#065f46",
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <ShieldCheck size={18} /> {dispatchSuccessMsg}
          </div>
        )}

        {/* Vehicle Summary Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: "1rem", background: "#f8fafc", padding: "1.25rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>VEHICLE NUMBER</div>
            <div className="mono" style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary)", marginTop: "0.2rem" }}>
              {activeVehicle.vehicleNumber}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{activeVehicle.type}</div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>TOTAL PIECES</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.2rem" }}>
              {totalLoadedPieces}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>TOTAL CLIENTS</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2563eb", marginTop: "0.2rem" }}>
              {uniqueClients}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>TOTAL JOBS</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#4f46e5", marginTop: "0.2rem" }}>
              {uniqueJobs}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>DISPATCH STATUS</div>
            <div style={{ marginTop: "0.4rem" }}>
              <span className="badge badge-progress">{activeVehicle.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scanned Pieces Selection Table */}
      <div className="card">
        <div className="section-header">
          <div className="section-title" style={{ fontSize: "0.95rem" }}>
            Scanned Pieces Ready for Vehicle Load Assignment ({readyPieces.length})
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn btn-secondary btn-sm" onClick={toggleSelectAll}>
              {selectedPNumbers.length === readyPieces.length ? "Deselect All" : "Select All Ready"}
            </button>
            <button
              className="btn btn-primary btn-sm"
              disabled={selectedPNumbers.length === 0}
              onClick={handleCompleteDispatch}
            >
              <Container size={16} /> Load {selectedPNumbers.length} Selected Pieces onto {activeVehicle.vehicleNumber}
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>Select</th>
                <th>P-Number</th>
                <th>Customer Name</th>
                <th>Customer Ref ID</th>
                <th>Job ID & Name</th>
                <th>Qty</th>
                <th>Delivery Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {readyPieces.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    No scanned pieces currently waiting for vehicle loading. Use Scan & Track to scan pieces first.
                  </td>
                </tr>
              ) : (
                readyPieces.map((piece) => {
                  const isSelected = selectedPNumbers.includes(piece.pNumber);

                  return (
                    <tr
                      key={piece.pieceId}
                      onClick={() => toggleSelect(piece.pNumber)}
                      style={{ cursor: "pointer", background: isSelected ? "#eff6ff" : "transparent" }}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleSelect(piece.pNumber)}
                          style={{ border: "none", background: "none", cursor: "pointer" }}
                        >
                          {isSelected ? <CheckSquare size={18} color="#2563eb" /> : <Square size={18} color="#94a3b8" />}
                        </button>
                      </td>
                      <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                        {piece.pNumber}
                      </td>
                      <td style={{ fontWeight: 600 }}>{piece.customerName}</td>
                      <td className="mono" style={{ fontSize: "0.82rem", color: "#475569" }}>
                        {piece.customerRefId}
                      </td>
                      <td>
                        <div className="mono" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                          {piece.jobId}
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                          {piece.jobName}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{piece.quantity}</td>
                      <td style={{ fontSize: "0.82rem" }}>{piece.deliveryDate}</td>
                      <td>
                        <span className="badge badge-progress">{piece.shippingStatus}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
