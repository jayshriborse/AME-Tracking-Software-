"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { INITIAL_TRANSITS, INITIAL_IMPORT_HISTORY } from "../data/mockData";

const AMEContext = createContext();

export function AMEProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("Admin");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [dashboardData, setDashboardData] = useState(null);
  const [shippingPieces, setShippingPieces] = useState([]);
  const [transits, setTransits] = useState(INITIAL_TRANSITS);
  const [importHistory, setImportHistory] = useState(INITIAL_IMPORT_HISTORY);
  const [loading, setLoading] = useState(true);


  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) setDashboardData(await res.json());
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    }
  };

  const fetchShippingList = async () => {
    try {
      const res = await fetch('/api/shipping-list?limit=200');
      if (res.ok) {
        const json = await res.json();
        // API returns { data: [...], pagination: {...} } — extract the array
        setShippingPieces(Array.isArray(json) ? json : (json.data || []));
      }
    } catch (e) {
      console.error('Shipping list fetch error:', e);
    }
  };

  const fetchTransits = async () => {
    try {
      const res = await fetch('/api/transits');
      if (res.ok) {
        const body = await res.json();
        if (body.success && body.data.items && body.data.items.length > 0) {
          const items = body.data.items.map(t => ({
            transitId: t.id,
            transitNumber: t.transitNumber,
            transitPhoto: t.truckPhotoUrl || '/images/truck-placeholder.jpg',
            status: t.status === 'COMPLETED' ? 'Dispatched' : 'Loading',
            driver: 'John Doe',
            type: 'Semi-Truck'
          }));
          setTransits(items);
        }
      }
    } catch (e) {
      console.error('Transits fetch error:', e);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchDashboard(), fetchShippingList(), fetchTransits()]);
    setLoading(false);
  };

  // Load data once when logged in
  useEffect(() => {
    if (isLoggedIn) {
      refreshData();
    }
  }, [isLoggedIn]);

  // ── Login / Logout simulation
  const login = (role) => { setUserRole(role || "Admin"); setIsLoggedIn(true); setActiveTab("dashboard"); };
  const logout = () => setIsLoggedIn(false);

  // ── Toggle sidebar collapse
  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  // ── Helper: Format date/time string
  const getScanDateTime = () => {
    const d = new Date();
    return d.toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    }).replace(/,/g, "");
  };

  // ── QR Scan: posts to real backend, triggers data refresh
  const scanQRCode = async (scannedCode) => {
    try {
      const res = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: scannedCode, deviceId: 'web-demo', scanLocation: 'Main Scanning Area' })
      });
      const data = await res.json();
      if (res.ok) {
        // Immediately refresh data so the UI updates without waiting for polling
        await refreshData();
        if (data.alreadyScanned) {
          return { type: "DUPLICATE", piece: data.piece, firstScannedTime: data.firstScanDateTime ? new Date(data.firstScanDateTime).toLocaleString() : "" };
        }
        return { type: "SUCCESS", piece: data.piece, scanDateTime: data.piece?.scanDateTime ? new Date(data.piece.scanDateTime).toLocaleString() : "" };
      }
      return { type: "NOT_FOUND", message: data.error };
    } catch (e) {
      console.error('Scan error:', e);
      return { type: "ERROR", message: 'Server error' };
    }
  };

  const importShippingList = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/import', { method: 'POST', body: formData });
      if (res.ok) {
        refreshData();
        return await res.json();
      }
    } catch (e) {
      console.error('Import error:', e);
    }
    return null;
  };

  // ── Reset to default demo data
  const resetDemoData = () => { };

  // ── Assign pieces to a transit (and optionally dispatch)
  const assignPiecesToTransit = async (pNumbers, transitNumber, isDispatch) => {
    try {
      const t = transits.find(tr => tr.transitNumber === transitNumber);
      if (!t) return;
      
      if (isDispatch) {
        const res = await fetch(`/api/transits/${t.transitId}/complete`, { method: 'POST' });
        if (res.ok) {
          await refreshData();
        }
      }
    } catch (e) {
      console.error('Assign pieces to transit error:', e);
    }
  };

  // ── Update transit status
  const updateTransitStatus = async (transitId, status) => {
    try {
      if (status === 'Shifted' || status === 'Dispatched' || status === 'Ready for Dispatch') {
        const res = await fetch(`/api/transits/${transitId}/complete`, { method: 'POST' });
        if (res.ok) {
          await refreshData();
        }
      }
    } catch (e) {
      console.error('Update transit status error:', e);
    }
  };

  const value = {
    isLoggedIn, userRole, login, logout,
    isSidebarCollapsed, toggleSidebar,
    shippingPieces, dashboardData, transits, importHistory, loading,
    activeTab, setActiveTab,

    // Workflow actions
    scanQRCode,
    importShippingList,
    resetDemoData,
    assignPiecesToTransit,
    updateTransitStatus,
    refreshData
  };

  return <AMEContext.Provider value={value}>{children}</AMEContext.Provider>;
}

export const useAME = () => useContext(AMEContext);
