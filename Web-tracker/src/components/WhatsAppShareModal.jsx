import React, { useState } from "react";
import { X, Send, CheckCircle2, MessageSquare, FileText, Phone, Building } from "lucide-react";

export function WhatsAppShareModal({ isOpen, onClose, reportData }) {
  const [phone, setPhone] = useState("+91 98230 11223");
  const [customNotes, setCustomNotes] = useState("Attached is your final AME Shipping List and Dispatch Manifest for Vehicle MH12AB1234.");
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen || !reportData) return null;

  const handleShare = (e) => {
    e.preventDefault();
    setShareSuccess(true);
  };

  const handleClose = () => {
    setShareSuccess(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "550px" }}>
        <div className="modal-header" style={{ background: "#075e54", color: "#ffffff", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MessageSquare size={22} color="#25d366" />
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ffffff" }}>Share Shipping List via WhatsApp</h2>
              <p style={{ fontSize: "0.78rem", color: "#ece5dd" }}>Prototype Simulation — Future WhatsApp Integration</p>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleClose}
            style={{ padding: "0.35rem", borderRadius: "50%", background: "rgba(255,255,255,0.15)", color: "#ffffff", border: "none" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {shareSuccess ? (
            <div style={{ background: "#d1fae5", border: "1px solid #a7f3d0", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
              <CheckCircle2 size={42} color="#059669" style={{ margin: "0 auto 0.75rem auto" }} />
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#065f46", marginBottom: "0.35rem" }}>
                ✓ Report Successfully Shared via WhatsApp
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#047857", marginBottom: "1rem" }}>
                Final Shipping List and Dispatch Manifest delivered to <strong>{reportData.customerName}</strong>.
              </p>

              <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "6px", border: "1px solid #a7f3d0", textAlign: "left", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
                <div><strong>Recipient:</strong> {reportData.customerName} ({phone})</div>
                <div><strong>Delivered File:</strong> {reportData.fileName}</div>
                <div><strong>Status:</strong> Delivered ✓✓</div>
              </div>

              <button className="btn btn-primary" onClick={handleClose} style={{ width: "100%" }}>
                Done / Back to Reports
              </button>
            </div>
          ) : (
            <form onSubmit={handleShare}>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  marginBottom: "1.25rem"
                }}
              >
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  ATTACHED REPORT DETAILS
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Customer: </span>
                    <strong>{reportData.customerName}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Total Pieces: </span>
                    <strong>{reportData.totalPieces.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Vehicle: </span>
                    <strong className="mono">{reportData.vehicleNumber}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Status: </span>
                    <span className="badge badge-dispatched">{reportData.status}</span>
                  </div>
                </div>

                <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)", fontSize: "0.82rem", color: "#2563eb", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <FileText size={15} /> {reportData.fileName}
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Phone size={14} color="#64748b" /> Customer WhatsApp Phone Number
                </label>
                <input
                  type="text"
                  className="form-input mono"
                  style={{ fontWeight: 700 }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Message Notes</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", background: "#25d366", borderColor: "#128c7e", color: "#ffffff", padding: "0.75rem", fontSize: "0.95rem" }}
              >
                <Send size={18} /> Share via WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
