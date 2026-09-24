import React, { useState } from "react";
import { useAME } from "../../context/AMEContext";
import { QrCode, CheckCircle2, AlertTriangle, Search, Info } from "lucide-react";

export function ScanTrackView() {
  const { scanQRCode, shippingPieces, dashboardData } = useAME();
  const [inputValue, setInputValue] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredPieces = inputValue.trim() 
    ? shippingPieces.filter(p => 
        (p.qrCode?.toLowerCase().includes(inputValue.toLowerCase())) ||
        (p.pieceNo?.toLowerCase().includes(inputValue.toLowerCase())) ||
        (p.jobId?.toLowerCase().includes(inputValue.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSimulateScan = async (codeToScan = inputValue) => {
    if (!codeToScan.trim()) return;

    let parsedItemId = codeToScan;
    
    // Try parsing as JSON first
    if (codeToScan.startsWith("{") && codeToScan.endsWith("}")) {
      try {
        const json = JSON.parse(codeToScan);
        if (json.ItemID) {
          parsedItemId = json.ItemID;
        } else {
          setScanResult({ type: "INVALID_JSON" });
          setInputValue("");
          return;
        }
      } catch (e) {
        setScanResult({ type: "INVALID_JSON" });
        setInputValue("");
        return;
      }
    }

    const result = await scanQRCode(parsedItemId);
    setScanResult(result);
    setInputValue("");
  };

  const resetScanner = () => {
    setScanResult(null);
    setInputValue("");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <div className="card" style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
        
        {/* SCANNER READY STATE */}
        {!scanResult && (
           <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, color: "var(--text-main)", fontSize: "1.2rem" }}>Scan & Track</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: "0.5rem auto", maxWidth: "400px" }}>
                Scan a piece to identify and update its tracking information.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", position: "relative" }}>
              <input
                type="text"
                className="form-input"
                style={{ width: "100%", textAlign: "center", fontSize: "1rem", padding: "0.75rem" }}
                placeholder="[ Enter / Scan QR Data ]"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={(e) => e.key === "Enter" && handleSimulateScan()}
              />

              {showDropdown && filteredPieces.length > 0 && (
                <div style={{ position: "absolute", top: "45px", left: 0, right: 0, background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", zIndex: 10, maxHeight: "200px", overflowY: "auto" }}>
                  {filteredPieces.map((p, i) => (
                    <div 
                      key={i} 
                      style={{ padding: "0.75rem 1rem", borderBottom: i === filteredPieces.length - 1 ? "none" : "1px solid #e2e8f0", cursor: "pointer", textAlign: "left" }}
                      onClick={() => {
                        const codeToScan = p.qrCode || p.pieceNo;
                        setShowDropdown(false);
                        handleSimulateScan(codeToScan);
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div style={{ fontWeight: 600, color: "var(--primary)" }}>{p.pieceNo} <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 400 }}>(Job: {p.jobId})</span></div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{p.qrCode}</div>
                    </div>
                  ))}
                </div>
              )}
              <button 
                className="btn btn-primary" 
                style={{ width: "100%", padding: "0.75rem", fontSize: "1rem" }}
                onClick={() => handleSimulateScan()}
              >
                Scan Piece
              </button>
            </div>
          </div>
        )}

        {/* SCAN SUCCESS STATE */}
        {scanResult?.type === "SUCCESS" && (
           <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#059669", marginBottom: "1.5rem", justifyContent: "center" }}>
              <CheckCircle2 size={24} />
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Piece Found</h2>
            </div>
            
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem", fontSize: "0.9rem" }}>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Piece Number:</span> <strong>{scanResult.piece.pieceNo}</strong></div>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Item ID:</span> <span className="mono">{scanResult.piece.qrCode}</span></div>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Job ID:</span> <strong>{scanResult.piece.jobId}</strong></div>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Item Name:</span> <strong>Structural Beam</strong></div>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Quantity:</span> <strong>1</strong></div>
                <div style={{ borderTop: "1px solid #e2e8f0", margin: "0.5rem 0" }}></div>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Current Status:</span> <span className="badge badge-pending">In Progress</span></div>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Current Location:</span> <strong>Scanning Area</strong></div>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Last Scanned:</span> <strong>{scanResult.scanDateTime}</strong></div>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }} onClick={resetScanner}>
              Scan Next Piece
            </button>
          </div>
        )}

        {/* DUPLICATE STATE */}
        {scanResult?.type === "DUPLICATE" && (
           <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d97706", marginBottom: "1.5rem", justifyContent: "center" }}>
              <CheckCircle2 size={24} />
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Already Scanned</h2>
            </div>
            
            <div style={{ background: "#fffbeb", padding: "1rem", borderRadius: "8px", border: "1px solid #fde68a", marginBottom: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.75rem", fontSize: "0.9rem" }}>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Piece Number:</span> <strong>{scanResult.piece.pieceNo}</strong></div>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Job ID:</span> <strong>{scanResult.piece.jobId}</strong></div>
                <div style={{ borderTop: "1px solid #fde68a", margin: "0.5rem 0" }}></div>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Last Scanned:</span> <strong>{scanResult.firstScannedTime}</strong></div>
                <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "120px" }}>Current Status:</span> <span className="badge badge-scanned">In Progress</span></div>
              </div>
            </div>

            <button className="btn btn-secondary" style={{ width: "100%", padding: "0.75rem" }} onClick={resetScanner}>
              Scan Next Piece
            </button>
          </div>
        )}

        {/* NOT FOUND STATE */}
        {scanResult?.type === "NOT_FOUND" && (
           <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#dc2626", marginBottom: "1.5rem", justifyContent: "center" }}>
              <AlertTriangle size={24} />
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Piece Not Found</h2>
            </div>
            
            <div style={{ background: "#fef2f2", padding: "1rem", borderRadius: "8px", border: "1px solid #fecaca", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.95rem", color: "#991b1b" }}>
              This ItemID does not match any piece in the current AME demo data.
            </div>

            <button className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }} onClick={resetScanner}>
              Scan Again
            </button>
          </div>
        )}

        {/* INVALID JSON STATE */}
        {scanResult?.type === "INVALID_JSON" && (
           <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#dc2626", marginBottom: "1.5rem", justifyContent: "center" }}>
              <AlertTriangle size={24} />
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Invalid QR Data</h2>
            </div>
            
            <div style={{ background: "#fef2f2", padding: "1rem", borderRadius: "8px", border: "1px solid #fecaca", marginBottom: "1.5rem", textAlign: "center", fontSize: "0.95rem", color: "#991b1b" }}>
              Unable to read ItemID from the scanned QR data.
            </div>

            <button className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }} onClick={resetScanner}>
              Try Again
            </button>
          </div>
        )}

      </div>
      
      {/* RECENT SCANS BELOW SCANNER */}
      {dashboardData?.recentScans?.length > 0 && (
        <div className="card" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.5rem" }}>Recent Scans</h3>
          <table className="data-table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", fontSize: "0.85rem", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "0.5rem 0" }}>Time</th>
                <th style={{ padding: "0.5rem 0" }}>Piece Number</th>
                <th style={{ padding: "0.5rem 0" }}>Job ID</th>
                <th style={{ padding: "0.5rem 0" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentScans.slice(0, 5).map((scan, idx) => {
                const scanTime = new Date(scan.scanDateTime).toLocaleString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true }).replace(/,/g, "");
                return (
                  <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.5rem 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>{scanTime}</td>
                    <td style={{ padding: "0.5rem 0", fontWeight: 600 }}>Piece {scan.pieceNo}</td>
                    <td style={{ padding: "0.5rem 0" }}>Job {scan.jobId}</td>
                    <td style={{ padding: "0.5rem 0" }}><span className="badge badge-pending">In Progress</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
