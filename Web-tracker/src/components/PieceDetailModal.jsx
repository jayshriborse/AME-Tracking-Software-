import React, { useState } from "react";
import { useAME } from "../context/AMEContext";
import {
  X, QrCode, Copy, Check, CheckCircle2,
  Clock, MapPin, Truck, Package
} from "lucide-react";

const STATUS_BADGE = {
  "Pending":            "badge-pending",
  "Scanned":            "badge-scanned",
  "Loaded":             "badge-ready",
  "Ready for Dispatch": "badge-ready",
  "Dispatched":         "badge-dispatched",
  "Shifted":            "badge-dispatched",
};

const EVENT_COLOR = {
  "Scanned":             "#059669",
  "Assigned to Transit": "#0284c7",
  "Ready for Dispatch":  "#0284c7",
  "Dispatched":          "#7c3aed",
};

export function PieceDetailModal() {
  const { selectedPieceForModal, setSelectedPieceForModal, jobs } = useAME();
  const [copied, setCopied] = useState(false);

  if (!selectedPieceForModal) return null;

  const piece = selectedPieceForModal;
  const job   = jobs.find((j) => j.jobId === piece.jobId);
  const qr    = piece.qrData || `{"ItemID":"${piece.itemId}"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(qr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const close = () => setSelectedPieceForModal(null);

  /* Helper field component */
  const F = ({ label, value, mono, color, children, full }) => (
    <div className="drawer-field" style={full ? { gridColumn: "span 2" } : {}}>
      <label>{label}</label>
      {children || (
        <span className={`val${mono ? " mono" : ""}`} style={color ? { color } : {}}>
          {value || <span style={{ color: "var(--text-light)" }}>—</span>}
        </span>
      )}
    </div>
  );

  return (
    <>
      {/* Overlay — click to close */}
      <div className="drawer-overlay" onClick={close} />

      {/* Drawer panel — slides in from right */}
      <div className="drawer-panel">
        {/* Header */}
        <div className="drawer-header">
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.15rem" }}>
              Piece Details
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="mono" style={{ fontSize: "1rem", fontWeight: 800, color: "var(--primary)" }}>{piece.pNumber}</span>
              <span className={`badge ${STATUS_BADGE[piece.shippingStatus] || "badge-scanned"}`}>{piece.shippingStatus}</span>
            </div>
            <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>{piece.customerName}</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={close} style={{ padding: "0.3rem", borderRadius: "50%", flex: "0 0 30px", height: "30px" }} title="Close">
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="drawer-body">

          {/* Core fields grid */}
          <div className="drawer-field-grid">
            <F label="Customer Name"    value={piece.customerName} />
            <F label="Customer Ref ID"  value={piece.customerRefId} mono />
            <F label="P-Number"         value={piece.pNumber}       mono color="var(--primary)" />
            <F label="Job ID">
              <span>
                <span className="mono val" style={{ color: "#7c3aed" }}>{piece.jobId}</span>
                {job && <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.05rem" }}>{job.jobName}</div>}
              </span>
            </F>
            <F label="Quantity"         value={piece.quantity} />
            <F label="Current Status">
              <span className={`badge ${STATUS_BADGE[piece.shippingStatus] || "badge-scanned"}`}>{piece.shippingStatus}</span>
            </F>
            <F label="Delivery Date"    value={piece.deliveryDate} />
            <F label="Scan Date & Time">
              {piece.scanDateTime
                ? <span className="val" style={{ color: "#059669" }}>{piece.scanDateTime}</span>
                : <span style={{ fontSize: "0.76rem", color: "var(--text-light)" }}>Not yet scanned</span>
              }
            </F>
            <F label="Scan Location">
              {piece.scanLocation
                ? <span className="val" style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <MapPin size={11} color="#2563eb" /> {piece.scanLocation}
                  </span>
                : <span style={{ fontSize: "0.76rem", color: "var(--text-light)" }}>—</span>
              }
            </F>
            <F label="Transit Number">
              {piece.transitNumber
                ? <span className="val mono" style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <Truck size={11} color="#8b5cf6" /> {piece.transitNumber}
                  </span>
                : <span style={{ fontSize: "0.76rem", color: "var(--text-light)" }}>—</span>
              }
            </F>
            <F label="Current Location" value={piece.currentLocation} full />
          </div>

          {/* QR Data */}
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "7px", padding: "0.7rem", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.68rem", fontWeight: 700, color: "#0284c7", textTransform: "uppercase" }}>
                <QrCode size={12} /> QR Data
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleCopy} style={{ height: "22px", fontSize: "0.66rem" }}>
                {copied ? <><Check size={10} color="#059669" /> Copied</> : <><Copy size={10} /> Copy</>}
              </button>
            </div>
            <div className="mono" style={{ fontSize: "0.72rem", background: "#fff", border: "1px solid #bae6fd", padding: "0.3rem 0.5rem", borderRadius: "4px", wordBreak: "break-all", color: "var(--text-main)" }}>
              {qr}
            </div>
            <div style={{ fontSize: "0.62rem", color: "#0369a1", marginTop: "0.2rem" }}>
              Matched when worker scans physical piece in Scan & Track.
            </div>
          </div>

          {/* Tracking Timeline */}
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Clock size={13} color="#2563eb" /> Tracking Timeline
            </div>

            {(!piece.trackingEvents || piece.trackingEvents.length === 0) ? (
              <div className="empty-state" style={{ padding: "1.25rem" }}>
                <Package size={24} />
                <h3>No events yet</h3>
                <p>This piece has not been scanned yet.</p>
              </div>
            ) : (
              <div style={{ position: "relative", paddingLeft: "1.5rem" }}>
                {/* Vertical connector line */}
                <div style={{ position: "absolute", left: "0.45rem", top: 0, bottom: 0, width: "2px", background: "#e2e8f0", borderRadius: "1px" }} />

                {piece.trackingEvents.map((evt, idx) => {
                  const color  = EVENT_COLOR[evt.eventType] || "#64748b";
                  const isLast = idx === piece.trackingEvents.length - 1;
                  return (
                    <div key={idx} style={{ position: "relative", marginBottom: isLast ? 0 : "0.7rem" }}>
                      {/* Dot */}
                      <div style={{
                        position: "absolute", left: "-1.25rem", top: "0.1rem",
                        width: "13px", height: "13px", borderRadius: "50%",
                        background: "#fff", border: `2px solid ${color}`,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <CheckCircle2 size={7} color={color} />
                      </div>
                      <div style={{ background: "#f8fafc", border: `1px solid ${color}20`, borderRadius: "6px", padding: "0.45rem 0.6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.76rem", fontWeight: 700, color }}>✓ {evt.eventType}</span>
                          <span className="mono" style={{ fontSize: "0.66rem", color: "var(--text-muted)" }}>{evt.dateTime}</span>
                        </div>
                        {evt.detail && (
                          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.08rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                            <MapPin size={9} /> {evt.detail}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Pending tail */}
                {piece.shippingStatus !== "Dispatched" && (
                  <div style={{ position: "relative", marginTop: "0.7rem" }}>
                    <div style={{ position: "absolute", left: "-1.25rem", top: "0.1rem", width: "13px", height: "13px", borderRadius: "50%", background: "#f8fafc", border: "2px dashed #cbd5e1" }} />
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", paddingLeft: "0.1rem" }}>
                      ● Awaiting next event…
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
