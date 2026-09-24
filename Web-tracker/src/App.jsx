"use client";
import React from "react";
import { useAME } from "./context/AMEContext";
import { LoginPortal } from "./components/LoginPortal";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { PieceDetailModal } from "./components/PieceDetailModal";
import { DashboardView } from "./components/views/DashboardView";
import { ShippingListView } from "./components/views/ShippingListView";
import { ScanTrackView } from "./components/views/ScanTrackView";
import { TransitView } from "./components/views/TransitView";
import { ReportsView } from "./components/views/ReportsView";
import { DataImportView } from "./components/views/DataImportView";
import { QrLabelsView } from "./components/views/QrLabelsView";

function MainContent() {
  const { activeTab, isSidebarCollapsed } = useAME();

  const renderView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "shipping-list":
        return <ShippingListView />;
      case "scan-track":
        return <ScanTrackView />;
      case "transit":
        return <TransitView />;
      case "reports":
        return <ReportsView />;
      case "data-import":
        return <DataImportView />;
      case "qr-labels":
        return <QrLabelsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`main-wrapper${isSidebarCollapsed ? " collapsed-sidebar" : ""}`}>
      <Header />
      <main className="content-area">
        {renderView()}
      </main>
      <PieceDetailModal />
    </div>
  );
}

function AppContent() {
  const { isLoggedIn } = useAME();

  if (!isLoggedIn) {
    return <LoginPortal />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
