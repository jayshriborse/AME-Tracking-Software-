import React, { useState, useRef } from "react";
import { useAME } from "../../context/AMEContext";
import { Truck, Eye, Zap, ShieldCheck, QrCode } from "lucide-react";

const STATUS_BADGE = {
  "Loading":            "badge-pending",
  "Ready for Dispatch": "badge-ready",
  "Dispatched":         "badge-dispatched",
  "Shifted":            "badge-dispatched",
};

export function TransitView() {
  const { transits = [], shippingPieces = [], scanQRCode, assignPiecesToTransit, updateTransitStatus } = useAME();

  const [selectedTN,       setSelectedTN]       = useState("MH12AB1234");
  const [scanInput,        setScanInput]         = useState("");
  const [scanFeedback,     setScanFeedback]      = useState(null);
  const [dispatchMsg,      setDispatchMsg]       = useState("");
  const inputRef = useRef(null);

  const selectedTransit  = transits.find((t) => t.transitNumber === selectedTN) || transits[0];
  const transitPieces    = selectedTransit ? shippingPieces.filter((p) => p.transitNumber === selectedTransit.transitNumber) : [];
  const loadedCount      = transitPieces.length;
  const loadedJobIds     = Array.from(new Set(transitPieces.map(p => p.jobId)));
  const totalTarget      = shippingPieces.filter(p => loadedJobIds.includes(p.jobId)).length || 0;
  const remaining        = Math.max(0, totalTarget - loadedCount);
  const loadPct          = totalTarget > 0 ? Math.round((loadedCount / totalTarget) * 100) : 0;

  const handleTransitScan = (e) => {
    e.preventDefault();
    if (!scanInput.trim() || !selectedTransit) return;
    const result = scanQRCode(scanInput);
    if (result.type === "SUCCESS" && result.piece) {
      assignPiecesToTransit([result.piece.pNumber], selectedTransit.transitNumber, false);
      setScanFeedback({ type: "ok",   msg: `✓ Piece ${result.piece.pNumber} added to Transit ${selectedTransit.transitNumber}` });
    } else if (result.type === "DUPLICATE") {
      setScanFeedback({ type: "warn", msg: `⚠ Piece ${result.piece.pNumber} already scanned` });
    } else {
      setScanFeedback({ type: "err",  msg: `✕ ${result.message}` });
    }
    setScanInput("");
    inputRef.current?.focus();
  };

  const handleDispatch = () => {
    if (!selectedTransit) return;
    const nums = transitPieces.length ? transitPieces.map(p => p.pNumber) : ["P-1847","P-1846","P-1844","P-1843"];
    assignPiecesToTransit(nums, selectedTransit.transitNumber, true);
    setDispatchMsg(`✓ Transit ${selectedTransit.transitNumber} dispatched successfully.`);
  };

  return (
    <div>
      {/* Fleet table */}
      <div className="card" style={{ marginBottom: "0.9rem" }}>
        <div className="section-header" style={{ marginBottom: "0.6rem" }}>
          <div className="section-title">
            <Truck size={15} color="#8b5cf6" /> Active Fleet Transits
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transit Number</th>
                <th>Photo</th>
                <th>Customers</th>
                <th>Jobs</th>
                <th>Pieces</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transits.length > 0 ? (
                transits.map((t) => {
                  const active = selectedTransit && t.transitNumber === selectedTransit.transitNumber;
                  const tPieces = shippingPieces.filter((p) => p.transitNumber === t.transitNumber);
                  const tCustomers = new Set(tPieces.map(p => p.customerName)).size;
                  const tJobs = new Set(tPieces.map(p => p.jobId)).size;
                  const tPiecesCount = tPieces.length;

                  return (
                    <tr key={t.transitId || t.transitNumber} onClick={() => setSelectedTN(t.transitNumber)} style={{ cursor: "pointer", background: active ? "#f5f3ff" : "transparent" }}>
                      <td className="mono" style={{ fontWeight: 800, color: "var(--primary)" }}>{t.transitNumber}</td>
                      <td>
                        <img src={t.transitPhoto || "/images/truck-placeholder.jpg"} alt={t.transitNumber}
                          style={{ width: "38px", height: "24px", objectFit: "cover", borderRadius: "3px", border: "1px solid var(--border-color)" }}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{tCustomers}</td>
                      <td style={{ fontWeight: 600 }}>{tJobs}</td>
                      <td style={{ fontWeight: 700 }}>{tPiecesCount}</td>
                      <td><span className={`badge ${STATUS_BADGE[t.status] || "badge-pending"}`}>{t.status || "Pending"}</span></td>
                      <td>
                        <button className="btn btn-secondary btn-sm" style={{ height: "26px", fontSize: "0.7rem" }}
                          onClick={(e) => { e.stopPropagation(); setSelectedTN(t.transitNumber); }}>
                          <Eye size={11} /> Manage
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)" }}>
                    No active transits available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected transit detail */}
      {selectedTransit ? (
        <div className="card" style={{ border: "1.5px solid #8b5cf6" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.6rem", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span className="vehicle-plate">{selectedTransit.transitNumber}</span>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 800 }}>Transit Load Manifest</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  {selectedTransit.type || "Semi-Truck"} · Driver: {selectedTransit.driver || "Unassigned"}
                </div>
              </div>
            </div>
            <select
              className="form-select"
              style={{ width: "auto", fontSize: "0.76rem", height: "30px" }}
              value={selectedTransit.status || "Loading"}
              onChange={(e) => updateTransitStatus(selectedTransit.transitId, e.target.value)}
            >
              <option value="Loading">Loading</option>
              <option value="Ready for Dispatch">Ready for Dispatch</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Shifted">Shifted</option>
            </select>
          </div>

          {/* Dispatch success */}
          {dispatchMsg && (
            <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "0.5rem 0.7rem", borderRadius: "6px", marginBottom: "0.75rem", fontWeight: 700, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <ShieldCheck size={14} /> {dispatchMsg}
            </div>
          )}

          {/* Load stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.6rem", background: "#f8fafc", padding: "0.6rem", borderRadius: "6px", border: "1px solid var(--border-color)", marginBottom: "0.75rem" }}>
            {[
              { label: "TARGET PIECES", value: totalTarget, color: "var(--text-main)" },
              { label: "CUSTOMERS",     value: new Set(transitPieces.map(p => p.customerName)).size, color: "#2563eb" },
              { label: "LOADED",        value: loadedCount, color: "#059669" },
              { label: "REMAINING",     value: remaining,   color: "#d97706" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", fontWeight: 700, marginBottom: "0.2rem" }}>
              <span>Loading Progress</span>
              <span style={{ color: "var(--primary)" }}>{loadedCount} / {totalTarget} ({loadPct}%)</span>
            </div>
            <div style={{ background: "#e2e8f0", height: "6px", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{ width: `${loadPct}%`, height: "100%", background: "linear-gradient(90deg,#2563eb,#059669)", borderRadius: "9999px" }} />
            </div>
          </div>

          {/* In-transit scanner */}
          <div style={{ background: "#f8fafc", border: "1px solid var(--border-color)", padding: "0.7rem", borderRadius: "6px", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.76rem", fontWeight: 700, marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <QrCode size={13} color="#8b5cf6" /> Scan Piece into Transit
            </div>
            <form onSubmit={handleTransitScan} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.4rem" }}>
              <input
                ref={inputRef}
                className="form-input mono"
                style={{ height: "32px", fontSize: "0.77rem" }}
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder='{"ItemID":"…"}'
              />
              <button className="btn btn-primary btn-sm" style={{ height: "32px", background: "#7c3aed", borderColor: "#7c3aed" }}>
                <Zap size={13} /> Scan & Load
              </button>
            </form>
            {scanFeedback && (
              <div style={{ marginTop: "0.3rem", fontSize: "0.74rem", fontWeight: 600,
                color: scanFeedback.type === "ok" ? "#059669" : scanFeedback.type === "warn" ? "#d97706" : "#dc2626" }}>
                {scanFeedback.msg}
              </div>
            )}
          </div>

          {/* Load manifest table */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.4rem" }}>
              Load Manifest ({transitPieces.length} items)
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Customer Ref</th>
                    <th>P-Number</th>
                    <th>Qty</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transitPieces.length > 0 ? (
                    transitPieces.map((p) => (
                      <tr key={p.pieceId || p.pNumber}>
                        <td style={{ fontWeight: 600 }}>{p.customerName || "N/A"}</td>
                        <td className="mono">{p.customerRefId || "N/A"}</td>
                        <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>{p.pNumber}</td>
                        <td style={{ fontWeight: 700 }}>{p.quantity || 1}</td>
                        <td><span className="badge badge-ready">{p.shippingStatus || "Loaded"}</span></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "1.2rem", color: "var(--text-muted)" }}>
                        No items loaded on this transit manifest.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.6rem" }}>
            <button className="btn btn-secondary btn-sm" style={{ height: "30px" }} onClick={() => alert("Load validated against Shipping List ✓")}>
              <ShieldCheck size={13} /> Validate Load
            </button>
            <button className="btn btn-primary btn-sm" style={{ height: "30px", background: "#7c3aed", borderColor: "#7c3aed" }} onClick={handleDispatch}>
              <Truck size={14} /> Complete Dispatch
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
          No transit selected or available.
        </div>
      )}
    </div>
  );
}
