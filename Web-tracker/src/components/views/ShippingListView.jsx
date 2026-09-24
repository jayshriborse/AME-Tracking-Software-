import React, { useState } from "react";
import { useAME } from "../../context/AMEContext";
import { ClipboardList, Search, ChevronLeft, ChevronRight } from "lucide-react";

// Format ISO date string to readable format
const formatDateTime = (isoString) => {
  if (!isoString) return null;
  const d = new Date(isoString);
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).replace(/,/g, "");
};

export function ShippingListView() {
  const { shippingPieces } = useAME();

  const [searchTerm,   setSearchTerm]   = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page,         setPage]         = useState(1);
  const PER_PAGE = 15;

  const filtered = shippingPieces.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !q ||
      (p.downloadNo || "").toLowerCase().includes(q) ||
      (p.jobId      || "").toLowerCase().includes(q) ||
      (p.pieceNo    || "").toLowerCase().includes(q) ||
      (p.qrCode     || "").toLowerCase().includes(q);

    // Status values from DB: PENDING, SCANNED, READY_FOR_DISPATCH, LOADED, DISPATCHED
    const matchStatus = statusFilter === "ALL" || p.scanStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const reset = () => { setSearchTerm(""); setStatusFilter("ALL"); setPage(1); };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "SCANNED":            return "badge-scanned";
      case "READY_FOR_DISPATCH": return "badge-pending";
      case "LOADED":             return "badge-pending";
      case "DISPATCHED":         return "badge-scanned";
      default:                   return "badge-pending"; // PENDING
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "SCANNED":            return "Scanned";
      case "READY_FOR_DISPATCH": return "Ready";
      case "LOADED":             return "Loaded";
      case "DISPATCHED":         return "Dispatched";
      default:                   return "Pending";
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="card" style={{ marginBottom: "0.6rem", padding: "0.5rem 1rem" }}>
        <div className="section-header" style={{ marginBottom: "0.4rem" }}>
          <div className="section-title">
            <ClipboardList size={16} color="#f59e0b" /> Master Shipping List
          </div>
          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr auto", gap: "0.6rem" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} color="#94a3b8" style={{ position: "absolute", left: 10, top: 10 }} />
            <input
              className="form-input"
              style={{ paddingLeft: "2rem", height: "34px", fontSize: "0.79rem" }}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search Download No, Job, Piece, QR…"
            />
          </div>

          <select
            className="form-select"
            style={{ height: "34px", fontSize: "0.79rem" }}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="SCANNED">Scanned</option>
            <option value="READY_FOR_DISPATCH">Ready for Dispatch</option>
            <option value="LOADED">Loaded</option>
            <option value="DISPATCHED">Dispatched</option>
          </select>

          <button className="btn btn-secondary btn-sm" style={{ height: "34px" }} onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "42px" }}>Sr. No.</th>
                <th>Download No.</th>
                <th>Job ID</th>
                <th>Piece No.</th>
                <th>QR Code</th>
                <th>Scan Status</th>
                <th>Scan Date &amp; Time</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length > 0 ? pageItems.map((piece) => (
                <tr key={`${piece.jobId}-${piece.pieceNo}-${piece.srNo}`}>
                  <td style={{ color: "var(--text-muted)", fontWeight: 500, textAlign: "center" }}>
                    {piece.srNo}
                  </td>
                  <td className="mono" style={{ fontWeight: 600 }}>{piece.downloadNo}</td>
                  <td className="mono">{piece.jobId}</td>
                  <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                    {piece.pieceNo}
                  </td>
                  <td className="mono" style={{ color: "var(--text-muted)", fontSize: "0.72rem", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {piece.qrCode}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(piece.scanStatus)}`}>
                      {formatStatus(piece.scanStatus)}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.76rem", whiteSpace: "nowrap" }}>
                    {piece.scanDateTime
                      ? <span style={{ color: "var(--status-scanned)", fontWeight: 600 }}>{formatDateTime(piece.scanDateTime)}</span>
                      : <span style={{ color: "var(--text-light)" }}>—</span>
                    }
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    No records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.65rem", paddingTop: "0.6rem", borderTop: "1px solid var(--border-color)", fontSize: "0.74rem" }}>
          <span style={{ color: "var(--text-muted)" }}>Page {page} of {totalPages} &nbsp;·&nbsp; {filtered.length} records</span>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            <button className="btn btn-secondary btn-sm" style={{ height: "26px" }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft size={13} /> Prev
            </button>
            <button className="btn btn-secondary btn-sm" style={{ height: "26px" }} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
