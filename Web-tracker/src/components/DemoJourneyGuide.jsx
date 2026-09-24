import React, { useState } from "react";
import { useAME } from "../context/AMEContext";
import { Play, ChevronRight, ChevronLeft, Sparkles, X, Check } from "lucide-react";

export function DemoJourneyGuide() {
  const { setActiveTab } = useAME();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const steps = [
    { title: "STEP 1", desc: "Open AME Dashboard — View 2,000 Total Pieces, Scanned vs Pending metrics.", tab: "dashboard" },
    { title: "STEP 2", desc: "Open Shipping List — Review imported source shipping manifest.", tab: "shipping-list" },
    { title: "STEP 3", desc: "Open a Shipping Record — Click any row to view Customer, Ref ID, P-Number, Price & QR.", tab: "shipping-list" },
    { title: "STEP 4-8", desc: "Open Scan & Track — Click 'Scan P-1847' to simulate scanning physical piece QR code.", tab: "scan-track" },
    { title: "STEP 9", desc: "Verify Scanning Updates — Confirm status changes to Scanned and Dashboard counters update.", tab: "dashboard" },
    { title: "STEP 10", desc: "Test Duplicate Scan — Click 'Rescan P-1847' in Scan & Track to show Already Scanned warning.", tab: "scan-track" },
    { title: "STEP 11", desc: "Test Piece Not Found — Click 'Scan XYZ123' to demonstrate error validation for unknown items.", tab: "scan-track" },
    { title: "STEP 12-15", desc: "Open Dispatch & Vehicles — Assign scanned pieces to Vehicle MH12AB1234 (Multi-Client payload).", tab: "dispatch" },
    { title: "STEP 16-18", desc: "Open Reports — Click 'Generate Shipping List', test Download PDF & Download Excel.", tab: "reports" },
    { title: "STEP 19-20", desc: "Customer WhatsApp Sharing — Click 'Share with Customer via WhatsApp' to complete demo!", tab: "reports" }
  ];

  const currentStep = steps[currentStepIndex];

  const goToStep = (index) => {
    setCurrentStepIndex(index);
    if (steps[index] && steps[index].tab) {
      setActiveTab(steps[index].tab);
    }
  };

  if (isMinimized) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: 99,
          background: "#0f172a",
          color: "#ffffff",
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          fontSize: "0.82rem",
          fontWeight: 600
        }}
        onClick={() => setIsMinimized(false)}
      >
        <Sparkles size={16} color="#fbbf24" /> Demo Journey Guide ({currentStepIndex + 1}/10)
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 99,
        background: "#0f172a",
        color: "#ffffff",
        padding: "1rem 1.25rem",
        borderRadius: "12px",
        width: "420px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        border: "1px solid #334155"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 700, color: "#fbbf24" }}>
          <Sparkles size={16} /> CLIENT DEMO JOURNEY ASSISTANT
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem" }}>
        {currentStep.title}: {currentStep.desc}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.85rem", paddingTop: "0.65rem", borderTop: "1px solid #334155" }}>
        <button
          className="btn btn-secondary btn-sm"
          disabled={currentStepIndex === 0}
          onClick={() => goToStep(currentStepIndex - 1)}
          style={{ padding: "0.3rem 0.6rem", background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "none" }}
        >
          <ChevronLeft size={14} /> Back
        </button>

        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
          Step {currentStepIndex + 1} of {steps.length}
        </span>

        <button
          className="btn btn-primary btn-sm"
          disabled={currentStepIndex === steps.length - 1}
          onClick={() => goToStep(currentStepIndex + 1)}
          style={{ padding: "0.3rem 0.6rem" }}
        >
          Next Step <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
