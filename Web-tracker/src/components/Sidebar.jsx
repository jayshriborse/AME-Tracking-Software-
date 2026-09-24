import React from "react";
import { useAME } from "../context/AMEContext";
import {
  LayoutDashboard,
  ClipboardList,
  QrCode,
  Truck,
  BarChart3,
  FileSpreadsheet,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export function Sidebar() {
  const { activeTab, setActiveTab, resetDemoData, isSidebarCollapsed, toggleSidebar } = useAME();

  const navItems = [
    { id: "dashboard",     label: "Dashboard",     icon: LayoutDashboard, color: "#3b82f6" },
    { id: "data-import",   label: "Data Import",    icon: FileSpreadsheet, color: "#f43f5e" },
    { id: "shipping-list", label: "Shipping List",  icon: ClipboardList,   color: "#f59e0b" },
    { id: "reports",       label: "Reports",        icon: BarChart3,       color: "#06b6d4" },
    { id: "qr-labels",     label: "QR Labels",      icon: QrCode,          color: "#10b981" },
    { id: "transit",       label: "Transit",        icon: Truck,           color: "#8b5cf6" }
  ];

  return (
    <aside className={`sidebar${isSidebarCollapsed ? " collapsed" : ""}`}>
      {/* Header: Brand + Toggle Button */}
      <div className="sidebar-header" style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", padding: isSidebarCollapsed ? "0.6rem 0.3rem" : "1.2rem 0.85rem" }}>
        {!isSidebarCollapsed && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.55rem", width: "100%", marginTop: "0.4rem" }}>
            <div style={{
              background: "white",
              borderRadius: "12px",
              width: "52px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              padding: "4px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.18)"
            }}>
              <img src="/al-mulla-logo.png" alt="Al Mulla Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: "0.92rem", color: "#ffffff", letterSpacing: "-0.01em", marginTop: "2px", textAlign: "center" }}>
              AME Tracker
            </span>
          </div>
        )}
        {isSidebarCollapsed && (
          <div style={{
            background: "white",
            borderRadius: "7px",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "3px",
            margin: "0 auto",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            marginBottom: "0.2rem"
          }}>
            <img src="/al-mulla-logo.png" alt="Al Mulla Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        )}
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            position: isSidebarCollapsed ? "static" : "absolute",
            top: "8px",
            right: "8px",
            marginTop: isSidebarCollapsed ? "0.2rem" : "0"
          }}
        >
          {isSidebarCollapsed
            ? <ChevronRight size={13} />
            : <ChevronLeft size={13} />
          }
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item${isActive ? " active" : ""}`}
              onClick={() => setActiveTab(item.id)}
              id={`nav-${item.id}`}
              title={isSidebarCollapsed ? item.label : ""}
            >
              <span className="nav-item-icon" style={{ color: isActive ? "#ffffff" : item.color }}>
                <Icon size={15} />
              </span>
              <span className="nav-text">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer (hidden when collapsed) */}
      <div className="sidebar-footer">
        <div style={{ marginBottom: "0.35rem", fontWeight: 600, color: "#94a3b8", fontSize: "0.68rem" }}>
          Demo Data Environment
        </div>
        <button
          className="btn btn-secondary btn-sm"
          style={{
            width: "100%",
            justifyContent: "center",
            background: "rgba(255,255,255,0.06)",
            color: "#cbd5e1",
            borderColor: "rgba(255,255,255,0.12)",
            height: "26px",
            fontSize: "0.7rem"
          }}
          onClick={resetDemoData}
          title="Reset local mock dataset"
        >
          <RefreshCw size={11} /> Reset Demo Data
        </button>
      </div>
    </aside>
  );
}
