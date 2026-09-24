import React, { useState, useEffect, useCallback } from "react";
import { 
  Calendar, 
  Search, 
  RefreshCw, 
  Download, 
  FileText, 
  ChevronDown, 
  BarChart3, 
  FileSpreadsheet, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export function ReportsView() {
  // Dropdown options
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Workflow selection
  const [activeWorkflow, setActiveWorkflow] = useState(null); // 'daily' or 'job'
  
  // Daily Report filters
  const [dailyDate, setDailyDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [dailyCustomer, setDailyCustomer] = useState("ALL");
  const [dailyProject, setDailyProject] = useState("ALL");
  const [dailyJob, setDailyJob] = useState("ALL");
  const [dailyStatus, setDailyStatus] = useState("ALL");

  // Job Report filters
  const [jobCustomer, setJobCustomer] = useState("ALL");
  const [jobProject, setJobProject] = useState("ALL");
  const [jobSelected, setJobSelected] = useState("ALL");

  // Report Results
  const [reportSummary, setReportSummary] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [jobInfo, setJobInfo] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  // Client-side search within generated preview
  const [previewSearch, setPreviewSearch] = useState("");

  // Fetch options for cascading dropdowns
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [custRes, projRes, jobRes] = await Promise.all([
          fetch("/api/customers"),
          fetch("/api/projects"),
          fetch("/api/jobs")
        ]);
        
        if (custRes.ok) {
          const custJson = await custRes.json();
          setCustomers(custJson.data || []);
        }
        if (projRes.ok) {
          const projJson = await projRes.json();
          setProjects(projJson.data || []);
        }
        if (jobRes.ok) {
          const jobJson = await jobRes.json();
          setJobs(jobJson.data || []);
        }
      } catch (err) {
        console.error("Error loading dropdown options:", err);
      } finally {
        setLoadingOptions(false);
      }
    }
    fetchOptions();
  }, []);

  // Reset dropdowns based on cascading constraints
  useEffect(() => {
    setDailyProject("ALL");
    setDailyJob("ALL");
  }, [dailyCustomer]);

  useEffect(() => {
    setDailyJob("ALL");
  }, [dailyProject]);

  useEffect(() => {
    setJobProject("ALL");
    setJobSelected("ALL");
  }, [jobCustomer]);

  useEffect(() => {
    setJobSelected("ALL");
  }, [jobProject]);

  // Compute cascading options
  const getFilteredProjects = (custId) => {
    if (custId === "ALL") return projects;
    return projects.filter(p => p.IDCustomer === parseInt(custId));
  };

  const getFilteredJobs = (projId, custId) => {
    let list = jobs;
    if (projId !== "ALL") {
      list = list.filter(j => j.IDProject === parseInt(projId));
    } else if (custId !== "ALL") {
      const allowedProjIds = projects.filter(p => p.IDCustomer === parseInt(custId)).map(p => p.IDProject);
      list = list.filter(j => allowedProjIds.includes(j.IDProject));
    }
    return list;
  };

  // Generate Reports
  const handleGenerateDaily = async () => {
    if (!dailyDate) {
      setErrorMsg("Please select a date.");
      return;
    }
    setGenerating(true);
    setErrorMsg("");
    setHasGenerated(false);
    try {
      const url = `/api/reports/daily?date=${dailyDate}` +
        (dailyCustomer !== "ALL" ? `&customerId=${dailyCustomer}` : "") +
        (dailyProject !== "ALL" ? `&projectId=${dailyProject}` : "") +
        (dailyJob !== "ALL" ? `&jobId=${dailyJob}` : "") +
        (dailyStatus !== "ALL" ? `&statusId=${dailyStatus}` : "");
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to generate daily report");
      const json = await res.json();
      setReportSummary(json.summary);
      setReportData(json.data || []);
      setJobInfo(null);
      setHasGenerated(true);
    } catch (err) {
      setErrorMsg(err.message || "An error occurred while generating the report.");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateJob = async () => {
    if (jobSelected === "ALL") {
      setErrorMsg("Please select a specific Job.");
      return;
    }
    setGenerating(true);
    setErrorMsg("");
    setHasGenerated(false);
    try {
      const res = await fetch(`/api/reports/job/${jobSelected}`);
      if (!res.ok) throw new Error("Failed to generate job-wise report");
      const json = await res.json();
      setReportSummary(json.summary);
      setReportData(json.data || []);
      setJobInfo(json.jobInfo);
      setHasGenerated(true);
    } catch (err) {
      setErrorMsg(err.message || "An error occurred while generating the report.");
    } finally {
      setGenerating(false);
    }
  };

  // Trigger Download Handlers
  const handleDownloadPDF = () => {
    if (!hasGenerated) return;
    let url = "";
    if (activeWorkflow === "daily") {
      const custObj = customers.find(c => String(c.IDCustomer) === dailyCustomer);
      const projObj = projects.find(p => String(p.IDProject) === dailyProject);
      const jobObj = jobs.find(j => String(j.IDJob) === dailyJob);
      url = `/api/reports/daily/pdf?date=${dailyDate}` +
        ` &customerId=${dailyCustomer}&projectId=${dailyProject}&jobId=${dailyJob}&statusId=${dailyStatus}` +
        ` &customerName=${encodeURIComponent(custObj?.strCustomerName || 'All')}` +
        ` &projectName=${encodeURIComponent(projObj?.ProjectName || 'All')}` +
        ` &jobName=${encodeURIComponent(jobObj?.JobName || 'All')}`;
    } else {
      url = `/api/reports/job/${jobSelected}/pdf`;
    }
    window.open(url, "_blank");
  };

  const handleDownloadExcel = () => {
    if (!hasGenerated) return;
    let url = "";
    if (activeWorkflow === "daily") {
      const custObj = customers.find(c => String(c.IDCustomer) === dailyCustomer);
      const projObj = projects.find(p => String(p.IDProject) === dailyProject);
      const jobObj = jobs.find(j => String(j.IDJob) === dailyJob);
      url = `/api/reports/daily/excel?date=${dailyDate}` +
        ` &customerId=${dailyCustomer}&projectId=${dailyProject}&jobId=${dailyJob}&statusId=${dailyStatus}` +
        ` &customerName=${encodeURIComponent(custObj?.strCustomerName || 'All')}` +
        ` &projectName=${encodeURIComponent(projObj?.ProjectName || 'All')}` +
        ` &jobName=${encodeURIComponent(jobObj?.JobName || 'All')}`;
    } else {
      url = `/api/reports/job/${jobSelected}/excel`;
    }
    window.open(url, "_blank");
  };

  // Filter preview data by search input
  const getFilteredPreviewRows = () => {
    if (!previewSearch.trim()) return reportData;
    const q = previewSearch.toLowerCase();
    return reportData.filter(r => 
      (r.barcode || "").toLowerCase().includes(q) ||
      (r.pieceNumber || "").toLowerCase().includes(q) ||
      (r.fitting || "").toLowerCase().includes(q) ||
      (r.metal || "").toLowerCase().includes(q) ||
      (r.liner || "").toLowerCase().includes(q) ||
      (r.projectName || "").toLowerCase().includes(q) ||
      (r.jobName || "").toLowerCase().includes(q)
    );
  };

  const filteredPreviewRows = getFilteredPreviewRows();

  return (
    <div className="view-animate-in" style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "3rem" }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
          AME Analytics & Reports
        </h1>
        <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>
          Generate professional, exportable reports for daily scanning records and client job status.
        </p>
      </div>

      {/* Primary Report Workflow Selection Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
        
        {/* Card 1: Daily Report */}
        <div 
          onClick={() => { setActiveWorkflow("daily"); setHasGenerated(false); setReportData([]); setErrorMsg(""); }}
          style={{
            background: "white",
            border: activeWorkflow === "daily" ? "2px solid #10b981" : "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "1.2rem",
            cursor: "pointer",
            boxShadow: activeWorkflow === "daily" ? "0 4px 6px -1px rgb(16 185 129 / 0.1)" : "var(--shadow-sm)",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#f0fdf4", color: "#10b981", padding: "0.45rem", borderRadius: "8px" }}>
              <Calendar size={20} />
            </div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>Daily / Gauge Report</h3>
          </div>
          <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>
            Generate a complete production & scanning report for a selected date, filtered by Customer, Project, Job and Status.
          </p>
        </div>

        {/* Card 2: Job-Wise Customer Report */}
        <div 
          onClick={() => { setActiveWorkflow("job"); setHasGenerated(false); setReportData([]); setErrorMsg(""); }}
          style={{
            background: "white",
            border: activeWorkflow === "job" ? "2px solid #0284c7" : "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "1.2rem",
            cursor: "pointer",
            boxShadow: activeWorkflow === "job" ? "0 4px 6px -1px rgb(2 132 199 / 0.1)" : "var(--shadow-sm)",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#f0f9ff", color: "#0284c7", padding: "0.45rem", borderRadius: "8px" }}>
              <BarChart3 size={20} />
            </div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>Job-Wise Customer Report</h3>
          </div>
          <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>
            Analyze a specific job's items end-to-end, showing current tracking events, completed counts, and full detailed item metadata.
          </p>
        </div>

      </div>

      {/* FILTER PANEL SECTION */}
      {activeWorkflow && (
        <div className="card" style={{ padding: "1.2rem", borderLeft: activeWorkflow === "daily" ? "4px solid #10b981" : "4px solid #0284c7" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginTop: 0, marginBottom: "0.8rem", textTransform: "uppercase" }}>
            Configure {activeWorkflow === "daily" ? "Daily Report" : "Job Report"} Filters
          </h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            
            {/* DAILY WORKFLOW FILTERS */}
            {activeWorkflow === "daily" && (
              <>
                {/* Date Input */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>REPORT DATE (REQUIRED)</label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <input 
                      type="date"
                      value={dailyDate}
                      onChange={e => setDailyDate(e.target.value)}
                      style={{
                        border: "1px solid #cbd5e1",
                        padding: "0.45rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.78rem",
                        color: "#0f172a",
                        fontWeight: 600,
                        outline: "none",
                        cursor: "pointer",
                        background: "#fff"
                      }}
                    />
                  </div>
                </div>

                {/* Customer dropdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: "150px" }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>CUSTOMER</label>
                  <select 
                    value={dailyCustomer}
                    onChange={e => setDailyCustomer(e.target.value)}
                    style={{ border: "1px solid #cbd5e1", padding: "0.45rem", borderRadius: "6px", fontSize: "0.78rem", outline: "none", background: "#fff" }}
                  >
                    <option value="ALL">All Customers</option>
                    {customers.map(c => <option key={c.IDCustomer} value={c.IDCustomer}>{c.strCustomerName}</option>)}
                  </select>
                </div>

                {/* Project dropdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: "160px" }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>PROJECT</label>
                  <select 
                    value={dailyProject}
                    onChange={e => setDailyProject(e.target.value)}
                    style={{ border: "1px solid #cbd5e1", padding: "0.45rem", borderRadius: "6px", fontSize: "0.78rem", outline: "none", background: "#fff" }}
                  >
                    <option value="ALL">All Projects</option>
                    {getFilteredProjects(dailyCustomer).map(p => <option key={p.IDProject} value={p.IDProject}>{p.ProjectName}</option>)}
                  </select>
                </div>

                {/* Job dropdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: "160px" }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>JOB</label>
                  <select 
                    value={dailyJob}
                    onChange={e => setDailyJob(e.target.value)}
                    style={{ border: "1px solid #cbd5e1", padding: "0.45rem", borderRadius: "6px", fontSize: "0.78rem", outline: "none", background: "#fff" }}
                  >
                    <option value="ALL">All Jobs</option>
                    {getFilteredJobs(dailyProject, dailyCustomer).map(j => <option key={j.IDJob} value={j.IDJob}>{j.JobName}</option>)}
                  </select>
                </div>

                {/* Status dropdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: "110px" }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>STATUS</label>
                  <select 
                    value={dailyStatus}
                    onChange={e => setDailyStatus(e.target.value)}
                    style={{ border: "1px solid #cbd5e1", padding: "0.45rem", borderRadius: "6px", fontSize: "0.78rem", outline: "none", background: "#fff" }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="1">Pending (None)</option>
                    <option value="8">Scanned (Staged)</option>
                    <option value="3">Loaded</option>
                    <option value="4">Shipped</option>
                  </select>
                </div>

                {/* Button */}
                <button
                  onClick={handleGenerateDaily}
                  disabled={generating}
                  className="btn btn-primary"
                  style={{ alignSelf: "flex-end", height: "34px", padding: "0 1.2rem", background: "#10b981", border: "none" }}
                >
                  {generating ? <Loader2 className="animate-spin" size={14} /> : "Generate Daily Report"}
                </button>
              </>
            )}

            {/* JOB WORKFLOW FILTERS */}
            {activeWorkflow === "job" && (
              <>
                {/* Customer dropdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: "180px" }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>CUSTOMER</label>
                  <select 
                    value={jobCustomer}
                    onChange={e => setJobCustomer(e.target.value)}
                    style={{ border: "1px solid #cbd5e1", padding: "0.45rem", borderRadius: "6px", fontSize: "0.78rem", outline: "none", background: "#fff" }}
                  >
                    <option value="ALL">Select Customer</option>
                    {customers.map(c => <option key={c.IDCustomer} value={c.IDCustomer}>{c.strCustomerName}</option>)}
                  </select>
                </div>

                {/* Project dropdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: "200px" }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>PROJECT</label>
                  <select 
                    value={jobProject}
                    disabled={jobCustomer === "ALL"}
                    onChange={e => setJobProject(e.target.value)}
                    style={{ border: "1px solid #cbd5e1", padding: "0.45rem", borderRadius: "6px", fontSize: "0.78rem", outline: "none", background: "#fff", opacity: jobCustomer === "ALL" ? 0.6 : 1 }}
                  >
                    <option value="ALL">Select Project</option>
                    {getFilteredProjects(jobCustomer).map(p => <option key={p.IDProject} value={p.IDProject}>{p.ProjectName}</option>)}
                  </select>
                </div>

                {/* Job dropdown (Required) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: "200px" }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b" }}>JOB (REQUIRED)</label>
                  <select 
                    value={jobSelected}
                    disabled={jobProject === "ALL"}
                    onChange={e => setJobSelected(e.target.value)}
                    style={{ border: "1px solid #cbd5e1", padding: "0.45rem", borderRadius: "6px", fontSize: "0.78rem", outline: "none", background: "#fff", opacity: jobProject === "ALL" ? 0.6 : 1 }}
                  >
                    <option value="ALL">Select Job</option>
                    {getFilteredJobs(jobProject, jobCustomer).map(j => <option key={j.IDJob} value={j.IDJob}>{j.JobName}</option>)}
                  </select>
                </div>

                {/* Button */}
                <button
                  onClick={handleGenerateJob}
                  disabled={generating || jobSelected === "ALL"}
                  className="btn btn-primary"
                  style={{ alignSelf: "flex-end", height: "34px", padding: "0 1.2rem", background: "#0284c7", border: "none" }}
                >
                  {generating ? <Loader2 className="animate-spin" size={14} /> : "Generate Job Report"}
                </button>
              </>
            )}

          </div>

          {errorMsg && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#ef4444", fontSize: "0.76rem", marginTop: "0.8rem", fontWeight: 600 }}>
              <AlertCircle size={14} />
              {errorMsg}
            </div>
          )}
        </div>
      )}

      {/* REPORT RESULTS AREA */}
      {hasGenerated && (
        <div className="view-animate-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* Summary / Metadata banner */}
          <div 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              background: "white",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <div>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                REPORT GENERATED SUCCESSFULLY
              </span>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0.1rem 0" }}>
                {activeWorkflow === "daily" ? "Daily Scanning Preview" : `Job-Wise Preview: ${jobInfo?.jobName}`}
              </h2>
              {activeWorkflow === "job" && (
                <p style={{ fontSize: "0.74rem", color: "#64748b", margin: 0 }}>
                  <strong>Customer:</strong> {jobInfo?.customerName} | <strong>Project:</strong> {jobInfo?.projectName} | <strong>Description:</strong> {jobInfo?.jobDescription}
                </p>
              )}
              {activeWorkflow === "daily" && (
                <p style={{ fontSize: "0.74rem", color: "#64748b", margin: 0 }}>
                  <strong>Date:</strong> {dailyDate}
                </p>
              )}
            </div>
            
            {/* Export buttons */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handleDownloadExcel}
                disabled={reportData.length === 0}
                style={{
                  border: "1px solid #10b981",
                  background: "#f0fdf4",
                  color: "#166534",
                  padding: "0.45rem 0.85rem",
                  borderRadius: "6px",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <FileSpreadsheet size={14} />
                Export Excel
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={reportData.length === 0}
                style={{
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  padding: "0.45rem 0.85rem",
                  borderRadius: "6px",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <FileText size={14} />
                Download PDF
              </button>
            </div>
          </div>

          {/* Summary KPIs Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <div className="card" style={{ padding: "0.8rem 1rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Pieces</span>
              <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a" }}>{reportSummary?.totalPieces}</span>
            </div>
            <div className="card" style={{ padding: "0.8rem 1rem", display: "flex", flexDirection: "column", gap: "0.2rem", borderLeft: "4px solid #10b981" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Scanned / Completed</span>
              <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "#10b981" }}>{reportSummary?.scanned ?? reportSummary?.completed}</span>
            </div>
            <div className="card" style={{ padding: "0.8rem 1rem", display: "flex", flexDirection: "column", gap: "0.2rem", borderLeft: "4px solid #f59e0b" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Pending</span>
              <span style={{ fontSize: "1.45rem", fontWeight: 800, color: "#f59e0b" }}>{reportSummary?.pending}</span>
            </div>
          </div>

          {/* Table Search bar */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", background: "white", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={14} color="#94a3b8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text"
                value={previewSearch}
                onChange={e => setPreviewSearch(e.target.value)}
                placeholder="Search barcode, fitting, dimensions, job within this report..."
                style={{
                  width: "100%",
                  height: "32px",
                  paddingLeft: "32px",
                  paddingRight: "12px",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
            <span style={{ fontSize: "0.74rem", color: "#64748b", fontWeight: 500 }}>
              Showing {filteredPreviewRows.length} of {reportData.length} records
            </span>
          </div>

          {/* Main Table Preview */}
          {filteredPreviewRows.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
              No matching report records found.
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ width: "40px" }}>SR</th>
                      {activeWorkflow === "daily" && (
                        <>
                          <th>CUSTOMER</th>
                          <th>PROJECT</th>
                          <th>JOB NAME</th>
                        </>
                      )}
                      <th>PIECE NO</th>
                      <th>BARCODE / ITEM ID</th>
                      <th>FITTING</th>
                      <th>METAL / LINER</th>
                      <th>DIMENSIONS</th>
                      <th>QTY</th>
                      <th>AREA (SQFT)</th>
                      <th>WEIGHT (LBS)</th>
                      <th style={{ width: "100px" }}>STATUS</th>
                      <th>TIMESTAMP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPreviewRows.map((row, index) => (
                      <tr key={`row-${row.idItem}-${index}`}>
                        <td style={{ color: "#64748b", textAlign: "center", fontWeight: 600 }}>{index + 1}</td>
                        {activeWorkflow === "daily" && (
                          <>
                            <td style={{ fontWeight: 600 }}>{row.customerName}</td>
                            <td style={{ color: "#475569" }}>{row.projectName}</td>
                            <td className="mono" style={{ color: "#475569" }}>{row.jobName}</td>
                          </>
                        )}
                        <td className="mono" style={{ fontWeight: 700 }}>{row.pieceNumber}</td>
                        <td className="mono" style={{ color: "#0284c7" }}>{row.barcode}</td>
                        <td style={{ color: "#334155", fontWeight: 500 }}>{row.fitting}</td>
                        <td style={{ fontSize: "0.74rem", color: "#64748b" }}>
                          {row.metal} <span style={{ color: "#cbd5e1" }}>/</span> {row.liner}
                        </td>
                        <td className="mono" style={{ fontSize: "0.74rem", color: "#475569" }}>{row.dimensions}</td>
                        <td style={{ textAlign: "center" }}>{row.quantity}</td>
                        <td style={{ textAlign: "right" }} className="mono">{Number(row.area).toFixed(2)}</td>
                        <td style={{ textAlign: "right" }} className="mono">{Number(row.weight).toFixed(2)}</td>
                        <td>
                          <span 
                            className="badge"
                            style={{
                              background: row.status === "None" ? "#f1f5f9"
                                        : row.status === "Staged" || row.status === "Scanned" ? "#f0fdf4"
                                        : row.status === "Loaded" ? "#f0f9ff" : "#fdf2f8",
                              color: row.status === "None" ? "#475569"
                                   : row.status === "Staged" || row.status === "Scanned" ? "#166534"
                                   : row.status === "Loaded" ? "#0369a1" : "#9d174d",
                              borderColor: row.status === "None" ? "#e2e8f0"
                                         : row.status === "Staged" || row.status === "Scanned" ? "#bbf7d0"
                                         : row.status === "Loaded" ? "#bae6fd" : "#fbcfe8"
                            }}
                          >
                            {row.status === "None" ? "Pending" : row.status}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.72rem", color: "#64748b" }}>
                          {row.trackingDate ? new Date(row.trackingDate).toLocaleString("en-GB", {
                            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true
                          }) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
