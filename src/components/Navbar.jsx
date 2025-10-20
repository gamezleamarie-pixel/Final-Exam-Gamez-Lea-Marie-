import React from "react";
import { api } from "../services/api";

export default function Navbar({ user, onNavigate, setUser }) {
  const goDashboard = () => {
    if (!user) return;
    if (user.role === "admin") onNavigate("admin");
    else if (user.role === "customer") onNavigate("customer");
    else onNavigate("landing");
  };

  const closeMenu = () => {
    try {
      const el = document.getElementById("navbarNav");
      if (!el) return;
      if (el.classList.contains("show")) {
        const Collapse = window.bootstrap?.Collapse;
        if (Collapse) new Collapse(el, { toggle: false }).hide();
        else el.classList.remove("show");
      }
    } catch {}
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(90deg, var(--taupe), var(--accent))",
      }}
    >
      <div className="container">
        <a
          className="navbar-brand fw-bold"
          style={{ cursor: "pointer", color: "var(--ivory)" }}
          onClick={() => {
            user ? goDashboard() : onNavigate("landing");
            closeMenu();
          }}
        >
          Salon Booking
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          {user ? (
            <ul className="navbar-nav align-items-center">
              <li className="nav-item me-2" style={{ color: "var(--ivory)" }}>
                {user.name}
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm me-2"
                  onClick={() => { goDashboard(); closeMenu(); }}
                >
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => { onNavigate("logout"); closeMenu(); }}
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav align-items-center">
              <li className="nav-item">
                <button
                  className="btn btn-outline-light btn-sm me-2"
                  onClick={() => { onNavigate("register"); closeMenu(); }}
                >
                  Register
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => { onNavigate("login"); closeMenu(); }}
                >
                  Login
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
