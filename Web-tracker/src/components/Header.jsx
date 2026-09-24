import React, { useState } from "react";
import { useAME } from "../context/AMEContext";
import { LogOut, UserCheck, Activity } from "lucide-react";

export function Header() {
  const { userRole, logout, setActiveTab } = useAME();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="top-header">
      <div className="header-title-area">
        <p style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Activity size={16} color="#2563eb" /> Live Tracking
        </p>
      </div>

      <div className="header-right" style={{ position: "relative" }}>
        {/* Import Button */}
        <button
          onClick={() => setActiveTab("data-import")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
            fontSize: "0.78rem",
            fontWeight: 700,
            padding: "0 0.75rem",
            borderRadius: "6px",
            cursor: "pointer",
            height: "32px",
            boxSizing: "border-box"
          }}
        >
          Import
        </button>

        {/* Admin Icon Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title="Admin Menu"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            cursor: "pointer"
          }}
        >
          <UserCheck size={16} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "120%",
              right: "0",
              background: "white",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              padding: "0.5rem",
              zIndex: 50,
              minWidth: "150px",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem"
            }}
          >
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-main)", padding: "0.2rem 0.4rem" }}>
              {userRole || "Super Admin"}
            </div>
            <div style={{ height: "1px", background: "var(--border-color)", margin: "0.2rem 0" }}></div>
            <button
              onClick={logout}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "transparent",
                border: "none",
                color: "#dc2626",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: "0.3rem 0.4rem",
                borderRadius: "4px",
                width: "100%",
                textAlign: "left"
              }}
              onMouseOver={(e) => e.target.style.background = "#fef2f2"}
              onMouseOut={(e) => e.target.style.background = "transparent"}
            >
              <LogOut size={13} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
