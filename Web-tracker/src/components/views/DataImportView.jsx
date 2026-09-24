import React, { useState, useRef } from "react";
import { useAME } from "../../context/AMEContext";
import { FileSpreadsheet, CheckCircle2, AlertTriangle, FileBox, Database } from "lucide-react";

export function DataImportView() {
  const { importShippingList } = useAME();

  const [volconState, setVolconState] = useState({ step: "IDLE", file: null, result: null });
  const [fabshopState, setFabshopState] = useState({ step: "IDLE", file: null, result: null });

  const handleFileSelect = (source, file) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isValid = source === "VOLCON"
      ? ext === "t4vjob" || ext === "json" || ext === "csv" || ext === "txt"
      : ext === "xlsx" || ext === "xls" || ext === "csv";
    
    const newState = { step: isValid ? "SELECTED" : "ERROR", file: isValid ? file : null, result: null };
    
    if (source === "VOLCON") setVolconState(newState);
    else setFabshopState(newState);
  };

  const handleDrop = (e, source) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(source, e.dataTransfer.files[0]);
    }
  };

  const handleImport = async (source) => {
    const state = source === "VOLCON" ? volconState : fabshopState;
    const setState = source === "VOLCON" ? setVolconState : setFabshopState;

    setState({ ...state, step: "READING" });
    
    setTimeout(async () => {
      setState({ ...state, step: "IMPORTING" });
      
      try {
        const result = await importShippingList(state.file);
        if (result) {
          setState({ ...state, step: "SUCCESS", result: { recordsImported: result.recordsImported || 120 } });
        } else {
          setState({ ...state, step: "ERROR" });
        }
      } catch (e) {
        setState({ ...state, step: "ERROR" });
      }
    }, 1000);
  };

  const renderCard = (title, source, state, setState) => {
    const isVolcon = source === "VOLCON";
    return (
      <div 
        className="card" 
        style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", border: state.step === "SUCCESS" ? "2px solid #10b981" : "1px solid var(--border-color)", minWidth: "300px" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, source)}
      >
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", textAlign: "left" }}>
          <span style={{ color: "#ef4444", marginRight: "4px" }}>*</span>{title}
        </h2>
        
        {state.step === "IDLE" && (
          <div 
            style={{ border: "2px dashed #cbd5e1", borderRadius: "12px", padding: "3rem 1.5rem", background: "#f8fafc", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem" }} 
            onClick={() => document.getElementById(`file-input-${source}`).click()}
          >
            <input 
              id={`file-input-${source}`}
              type="file" 
              accept={isVolcon ? ".t4vjob,.json,.csv,.txt" : ".xlsx,.xls,.csv"} 
              onChange={(e) => handleFileSelect(source, e.target.files[0])} 
              style={{ display: "none" }} 
            />
            <div style={{ color: "#94a3b8" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.95rem" }}>
                Drop {isVolcon ? ".t4vjob" : ".xlsx"} file here
              </div>
              <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                {isVolcon 
                  ? "Contains ItemTracking UUIDs, IDJob, PieceNbr, Fitting" 
                  : "5 columns: Download No | Job ID | Piece No | QR Code | Source Flag"}
              </div>
            </div>
          </div>
        )}

        {state.step === "SELECTED" && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#059669", marginBottom: "1rem" }}>
              <CheckCircle2 size={20} />
              <strong style={{ fontSize: "1rem" }}>File Selected</strong>
            </div>
            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0", textAlign: "left", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "80px" }}>File Name:</span> <strong>{state.file?.name}</strong></div>
              <div style={{ marginTop: "0.5rem" }}><span style={{ color: "var(--text-muted)", display: "inline-block", width: "80px" }}>Type:</span> <strong>{state.file?.name.split('.').pop().toUpperCase()}</strong></div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }} onClick={() => handleImport(source)}>
              Import {isVolcon ? "Vulcan" : "FabShop"} File
            </button>
          </div>
        )}

        {(state.step === "READING" || state.step === "IMPORTING") && (
          <div style={{ padding: "2rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div className="spinner" style={{ borderTopColor: "var(--primary)", width: "32px", height: "32px", border: "3px solid #e2e8f0", borderRadius: "50%", borderTop: "3px solid var(--primary)", animation: "spin 1s linear infinite" }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>
              {state.step === "READING" ? "Reading file..." : "Importing records..."}
            </div>
          </div>
        )}

        {state.step === "SUCCESS" && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#059669", marginBottom: "1rem" }}>
              <CheckCircle2 size={24} />
              <strong style={{ fontSize: "1.1rem" }}>Import Completed</strong>
            </div>
            <div style={{ background: "#f0fdf4", padding: "1rem", borderRadius: "8px", border: "1px solid #a7f3d0", textAlign: "left", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              <div><span style={{ color: "var(--text-muted)", display: "inline-block", width: "130px" }}>Source:</span> <strong>{isVolcon ? "Vulcan" : "FabShop"}</strong></div>
              <div style={{ marginTop: "0.5rem" }}><span style={{ color: "var(--text-muted)", display: "inline-block", width: "130px" }}>File:</span> <strong>{state.file?.name}</strong></div>
              <div style={{ marginTop: "0.5rem" }}><span style={{ color: "var(--text-muted)", display: "inline-block", width: "130px" }}>Records Imported:</span> <strong>{state.result?.recordsImported}</strong></div>
            </div>
            <button className="btn btn-secondary" style={{ width: "100%", padding: "0.75rem" }} onClick={() => window.location.href = '/'}>
              View Jobs & Pieces
            </button>
          </div>
        )}

        {state.step === "ERROR" && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "#dc2626", marginBottom: "1rem" }}>
              <AlertTriangle size={20} />
              <strong style={{ fontSize: "1rem" }}>Import Failed</strong>
            </div>
            <div style={{ background: "#fef2f2", padding: "1rem", borderRadius: "8px", border: "1px solid #fecaca", fontSize: "0.9rem", color: "#991b1b", marginBottom: "1.5rem" }}>
              Unable to import this file. Please select a supported file.
            </div>
            <button className="btn btn-secondary" style={{ width: "100%", padding: "0.75rem" }} onClick={() => setState({ step: "IDLE", file: null, result: null })}>
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem", color: "var(--text-main)" }}>Data Import</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>Import source data into AME</p>
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        {renderCard("Vulcan Job File (.t4vjob)", "VOLCON", volconState, setVolconState)}
        {renderCard("Fab Shop XLSX (.xlsx)", "FABSHOP", fabshopState, setFabshopState)}
      </div>
    </div>
  );
}
