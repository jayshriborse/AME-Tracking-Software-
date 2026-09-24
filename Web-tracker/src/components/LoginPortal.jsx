import React, { useState } from "react";
import { useAME } from "../context/AMEContext";
import { ArrowRight, AlertCircle } from "lucide-react";

export function LoginPortal() {
  const { login } = useAME();
  const [email, setEmail] = useState("admin@ametracking.com");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !email.trim()) {
      setErrorMessage("Please enter your email or username.");
      return;
    }

    if (!password || !password.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (!selectedRole) {
      setErrorMessage("Please select a role.");
      return;
    }

    login(selectedRole);
  };

  const roleOptions = ["Admin"];

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      {/* COMPACT LOGIN FORM */}
      <div
        style={{
          maxWidth: "420px",
          width: "100%",
          padding: "2.5rem 2rem",
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          boxSizing: "border-box",
          margin: "1rem"
        }}
      >
        {/* Logo & Title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.6rem", marginBottom: "1.25rem" }}>
          <div style={{
            background: "white",
            borderRadius: "10px",
            width: "52px",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "4px",
            border: "1px solid var(--border-color)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <img src="/al-mulla-logo.png" alt="Al Mulla Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a", lineHeight: 1.1 }}>
              AME Tracking System
            </div>
            <div style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginTop: "2px" }}>
              Enterprise Portal
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.25rem" }}>
          Welcome to AME
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.25rem" }}>
          Sign in to access the tracking and dispatch platform.
        </p>

        {/* Validation Error Message */}
        {errorMessage && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "0.55rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: 600,
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <AlertCircle size={14} /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 1. EMAIL / USERNAME */}
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem", display: "block" }}>
              Email / Username
            </label>
            <input
              type="text"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          {/* 2. PASSWORD */}
          <div className="form-group" style={{ marginBottom: "1.1rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem", display: "block" }}>
              Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          {/* 3. SELECT ROLE (COMPACT HORIZONTAL BUTTONS) */}
          <div className="form-group" style={{ marginBottom: "1.25rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.35rem", display: "block" }}>
              Select Role
            </label>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {roleOptions.map((role) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    style={{
                      flex: "0 0 32%",
                      padding: "0.45rem 0.6rem",
                      borderRadius: "6px",
                      border: isSelected ? "2px solid #2563eb" : "1px solid var(--border-color)",
                      background: isSelected ? "#eff6ff" : "#ffffff",
                      color: isSelected ? "#1d4ed8" : "#475569",
                      fontWeight: isSelected ? 700 : 600,
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      transition: "all 0.12s ease",
                      textAlign: "center",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "0.65rem",
              height: "36px",
              fontSize: "0.85rem",
              borderRadius: "6px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem"
            }}
          >
            Sign In <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
