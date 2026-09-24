import React, { useState } from "react";
import { useAME } from "../../context/AMEContext";
import { Search, Filter, QrCode, Eye, Building, Briefcase, MapPin } from "lucide-react";

export function JobsPiecesView() {
  const { pieces, jobs, clients, setSelectedPieceForModal } = useAME();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientFilter, setSelectedClientFilter] = useState("ALL");
  const [selectedJobFilter, setSelectedJobFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("Shifted");

  // Filter logic
  const filteredPieces = pieces.filter((piece) => {
    const job = jobs.find((j) => j.jobId === piece.jobId);
    const client = clients.find((c) => c.clientId === (job ? job.clientId : ""));

    const matchesSearch =
      piece.pieceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      piece.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      piece.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      piece.jobId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClient =
      selectedClientFilter === "ALL" || (client && client.clientId === selectedClientFilter);

    const matchesJob =
      selectedJobFilter === "ALL" || piece.jobId === selectedJobFilter;

    const matchesStatus =
      selectedStatusFilter === "ALL" || piece.currentStatus === selectedStatusFilter;

    return matchesSearch && matchesClient && matchesJob && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge badge-pending">Pending</span>;
      case "In Progress":
        return <span className="badge badge-progress">In Progress</span>;
      case "Ready":
        return <span className="badge badge-ready">Ready</span>;
      case "Dispatched":
      case "Shifted":
        return <span className="badge badge-dispatched">{status}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="section-header">
          <div className="section-title">
            <Boxes size={20} color="#2563eb" /> Jobs & Pieces Explorer
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Showing {filteredPieces.length} of {pieces.length} tracked items
          </span>
        </div>

        {/* Search and Filters Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "1rem" }}>
          {/* Search Box */}
          <div style={{ position: "relative" }}>
            <Search size={16} color="#64748b" style={{ position: "absolute", left: "10px", top: "11px" }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "2.1rem" }}
              placeholder="Search by Piece #, Item Name, or ItemID UUID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Client Filter */}
          <select
            className="form-select"
            value={selectedClientFilter}
            onChange={(e) => setSelectedClientFilter(e.target.value)}
          >
            <option value="ALL">All Clients</option>
            {clients.map((c) => (
              <option key={c.clientId} value={c.clientId}>
                {c.clientName}
              </option>
            ))}
          </select>

          {/* Job Filter */}
          <select
            className="form-select"
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
          >
            <option value="ALL">All Jobs</option>
            {jobs.map((j) => (
              <option key={j.jobId} value={j.jobId}>
                {j.jobId} - {j.jobName}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="form-select"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            <option value="Shifted">Shifted</option>
          </select>
        </div>
      </div>

      {/* Pieces Table */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Piece #</th>
                <th>Item Name / Specs</th>
                <th>Client Name</th>
                <th>Job ID & Project</th>
                <th>ItemID (UUID)</th>
                <th>Status</th>
                <th>Current Location</th>
                <th>Last Scanned</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPieces.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    No matching pieces found for the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPieces.map((piece) => {
                  const job = jobs.find((j) => j.jobId === piece.jobId);
                  const client = clients.find((c) => c.clientId === (job ? job.clientId : ""));

                  return (
                    <tr key={piece.pieceId}>
                      <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                        {piece.pieceNumber}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{piece.itemName}</div>
                        <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                          Qty: {piece.quantity} | {piece.material || "Steel"}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.83rem", fontWeight: 500 }}>
                          <Building size={13} color="#64748b" />
                          {client ? client.clientName : "N/A"}
                        </div>
                      </td>
                      <td>
                        <div className="mono" style={{ fontWeight: 600, fontSize: "0.8rem" }}>
                          {piece.jobId}
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>
                          {job ? job.projectName : ""}
                        </div>
                      </td>
                      <td className="mono" style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        {piece.itemId.slice(0, 14)}...
                      </td>
                      <td>{getStatusBadge("Shifted")}</td>
                      <td style={{ fontSize: "0.83rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <MapPin size={13} color="#2563eb" /> {piece.currentLocation}
                        </div>
                      </td>
                      <td style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {piece.lastScannedAt}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedPieceForModal(piece)}
                          title="View Piece Details & QR payload"
                        >
                          <Eye size={14} /> Detail
                        </button>
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

// Icon import helper
import { Boxes } from "lucide-react";
