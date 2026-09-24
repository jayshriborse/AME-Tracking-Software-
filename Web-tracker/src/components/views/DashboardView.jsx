"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAME } from "../../context/AMEContext";
import { Activity, QrCode } from "lucide-react";

import { DashboardKPI } from "../dashboard/DashboardKPI";
import { ScanningProgress } from "../dashboard/ScanningProgress";
import { LatestScan } from "../dashboard/LatestScan";
import { ActiveTransit } from "../dashboard/ActiveTransit";
import { RecentScans } from "../dashboard/RecentScans";

const formatScanDateTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).replace(/,/g, "");
};

export function DashboardView() {
  const { setActiveTab } = useAME();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getDashboardData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDashboardData(data);
      setError(false);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getDashboardData();
    const interval = setInterval(getDashboardData, 3000);
    return () => clearInterval(interval);
  }, [getDashboardData]);

  if (loading && !dashboardData) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#ef4444" }}>
        <p style={{ marginBottom: "1rem", fontWeight: 500 }}>Unable to load dashboard data.</p>
        <button className="btn btn-primary" onClick={() => { setLoading(true); getDashboardData(); }}>
          Retry
        </button>
      </div>
    );
  }

  const {
    totalPieces = 0,
    scanned = 0,
    pending = 0,
    readyForDispatch = 0,
    loaded = 0,
    dispatched = 0,
    scanningProgress = 0,
    totalProjects = 0,
    totalJobs = 0,
    latestScan = null,
    recentScans = [],
    activeTransit = null
  } = dashboardData || {};

  return (
    <div className="view-animate-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem" }}>
        
        {/* LEFT COLUMN: KPIS & SCANNER LINK */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="section-header" style={{ marginBottom: "1rem" }}>
            <div className="section-title">
              <Activity size={14} color="#2563eb" /> REAL-TIME SCANNING
            </div>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => setActiveTab("scan-track")}
              style={{ height: "26px", padding: "0.2rem 0.4rem" }}
              title="Scan & Track"
            >
              <QrCode size={14} />
            </button>
          </div>
          
          {/* Top KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1rem" }}>
            <DashboardKPI value={totalPieces} totalMax={totalPieces} label="Total Pieces" ringColor="#0ea5e9" />
            <DashboardKPI value={scanned}     totalMax={totalPieces} label="Scanned"      ringColor="#10b981" />
            <DashboardKPI value={pending}     totalMax={totalPieces} label="Pending"      ringColor="#f43f5e" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1rem" }}>
            <DashboardKPI value={readyForDispatch} totalMax={totalPieces} label="Ready"       ringColor="#f59e0b" />
            <DashboardKPI value={loaded}           totalMax={totalPieces} label="Loaded"      ringColor="#8b5cf6" />
            <DashboardKPI value={dispatched}       totalMax={totalPieces} label="Dispatched"  ringColor="#64748b" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", marginBottom: "1rem" }}>
            <DashboardKPI value={totalProjects} totalMax={totalProjects} label="Projects" ringColor="#06b6d4" />
            <DashboardKPI value={totalJobs}     totalMax={totalJobs}     label="Jobs"     ringColor="#f97316" />
          </div>

          <ScanningProgress scanned={scanned} total={totalPieces} scanningProgress={scanningProgress} />
        </div>

        {/* RIGHT COLUMN: TRACKING & TRANSIT DETAILS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* Latest Scan & Active Transit Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <LatestScan latestScan={latestScan} formatScanDateTime={formatScanDateTime} />
            <ActiveTransit activeTransit={activeTransit} />
          </div>

          <RecentScans recentScans={recentScans} formatScanDateTime={formatScanDateTime} />

        </div>
      </div>
    </div>
  );
}
