import React, { useState, useEffect } from "react";
import { useAME } from "../../context/AMEContext";
import { Grid, Printer, QrCode, Search } from "lucide-react";

export function QrLabelsView() {
  const { shippingPieces } = useAME();
  const [jobIdInput, setJobIdInput] = useState("P47184");
  const [loadedJobId, setLoadedJobId] = useState("P47184");
  const [filteredLabels, setFilteredLabels] = useState([]);

  // Job ID to Customer Reference mapping to match xlsx/display spec
  const getCustomerRef = (jobId) => {
    const id = (jobId || "").toUpperCase();
    if (id === "P47184") return "EXT/SABIYA CCGT-2";
    if (id === "47041" || id === "47042") return "HWC-2024";
    if (id === "55210" || id === "55211") return "MRD-5521";
    if (id === "62300") return "APX-8840";
    if (id === "68490" || id === "68491") return "BPT-3302";
    if (id === "74100") return "SSW-7719";
    return "AME-REF";
  };

  useEffect(() => {
    // Filter pieces matching the loadedJobId (case-insensitive)
    const matched = shippingPieces.filter(
      (p) => (p.jobId || "").toUpperCase() === loadedJobId.toUpperCase()
    );
    setFilteredLabels(matched);
  }, [loadedJobId, shippingPieces]);

  const handleLoadLabels = () => {
    setLoadedJobId(jobIdInput.trim());
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to extract UUID from JSON string or use value as-is
  const getDisplayUuid = (qrCodeString) => {
    if (!qrCodeString) return "";
    try {
      if (qrCodeString.startsWith("{")) {
        const parsed = JSON.parse(qrCodeString);
        if (parsed.ItemID) return parsed.ItemID;
      }
    } catch (e) {
      // Not JSON or parse error
    }
    return qrCodeString;
  };

  return (
    <div className="view-animate-in qr-labels-page">
      {/* Print Styles Dynamic Insertion */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .qr-labels-page, .qr-labels-page * {
            visibility: visible;
          }
          .qr-labels-page {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-exclude {
            display: none !important;
          }
          .labels-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1.5cm !important;
            background: white !important;
          }
          .label-card {
            border: 1px solid #000 !important;
            page-break-inside: avoid;
            background: white !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="print-exclude" style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
          PRINT
        </div>
        <h2 style={{ margin: "0.2rem 0 1.2rem 0", color: "var(--text-main)", fontSize: "1.6rem", fontWeight: 700 }}>
          QR labels
        </h2>
      </div>

      {/* Main card */}
      <div className="card" style={{ padding: "1.2rem" }}>
        {/* Label Run Header */}
        <div className="print-exclude" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
          <div style={{ background: "#d1fae5", padding: "6px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Grid size={16} color="#059669" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>Label run</span>
        </div>
        
        <p className="print-exclude" style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0 0 1rem 0" }}>
          Scan these with the mobile app. Payload is <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem", color: "#0f172a" }}>{`{"ItemID":"<uuid>"}`}</code>.
        </p>

        {/* Input Bar */}
        <div className="print-exclude" style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={14} color="#94a3b8" style={{ position: "absolute", left: 10, top: 10 }} />
            <input
              className="form-input"
              style={{ paddingLeft: "2rem", height: "34px", fontSize: "0.82rem" }}
              value={jobIdInput}
              onChange={(e) => setJobIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoadLabels()}
              placeholder="Enter Job ID (e.g. P47184, 47041)..."
            />
          </div>

          <button 
            className="btn btn-primary" 
            style={{ height: "34px", background: "#059669", borderColor: "#059669", fontSize: "0.82rem", fontWeight: 600, padding: "0 1rem" }}
            onClick={handleLoadLabels}
          >
            Load labels
          </button>

          <button 
            className="btn btn-secondary" 
            style={{ height: "34px", width: "34px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
            onClick={handlePrint}
            title="Print QR labels"
          >
            <Printer size={15} />
          </button>
        </div>

        {/* Alerts / Badge indicator */}
        <div style={{ 
          background: "#ecfdf5", 
          border: "1px solid #d1fae5", 
          borderRadius: "8px", 
          padding: "0.5rem 0.8rem", 
          marginBottom: "1.2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#065f46" }}>
            {filteredLabels.length} label{filteredLabels.length !== 1 ? "s" : ""} ready.
          </span>
        </div>

        {/* Labels Grid */}
        {filteredLabels.length > 0 ? (
          <div className="labels-grid" style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", 
            gap: "1rem" 
          }}>
            {filteredLabels.map((piece) => {
              const qrValue = piece.qrCode || "";
              const displayUuid = getDisplayUuid(qrValue);
              // Using public qr server API to render dynamic QR Codes
              const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrValue)}`;

              return (
                <div 
                  key={piece.srNo} 
                  className="label-card" 
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.2rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "#f8fafc",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                  }}
                >
                  {/* QR Image */}
                  <div style={{ background: "white", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "0.75rem" }}>
                    <img 
                      src={qrImageUrl} 
                      alt={`QR Piece ${piece.pieceNo}`}
                      style={{ width: "120px", height: "120px", display: "block" }}
                    />
                  </div>

                  {/* Piece Number */}
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a", marginBottom: "0.15rem" }}>
                    Piece {piece.pieceNo}
                  </div>

                  {/* Item Description Spec */}
                  <div style={{ fontSize: "0.74rem", color: "#475569", fontWeight: 500, marginBottom: "0.35rem" }}>
                    Standard Duct
                  </div>

                  {/* Job ID & Project Code */}
                  <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, letterSpacing: "0.2px", marginBottom: "0.4rem" }}>
                    {loadedJobId} · {getCustomerRef(loadedJobId)}
                  </div>

                  {/* UUID Value */}
                  <div 
                    style={{ 
                      fontSize: "0.62rem", 
                      color: "#94a3b8", 
                      fontFamily: "var(--font-mono)", 
                      wordBreak: "break-all", 
                      textAlign: "center",
                      borderTop: "1px dashed #e2e8f0",
                      paddingTop: "0.4rem",
                      width: "100%"
                    }}
                    title={displayUuid}
                  >
                    {displayUuid}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
            <QrCode size={36} color="#94a3b8" style={{ marginBottom: "0.5rem" }} />
            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#475569" }}>No pieces found for Job ID "{loadedJobId}"</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.2rem" }}>Make sure the Job exists in the seeded database. Try loaded jobs: 47041, 47042, etc.</div>
          </div>
        )}
      </div>
    </div>
  );
}
