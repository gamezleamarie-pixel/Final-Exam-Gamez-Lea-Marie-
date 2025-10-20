import React from "react";

export default function Footer() {
  return (
    <footer
      className="text-center text-dark py-4 mt-auto"
      style={{
        backgroundColor: "#F5F5DC", 
        borderTop: "2px solid #D2B48C", 
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="container">
        <h5 style={{ color: "#6B4F4F", fontWeight: "600" }}>
          ✂️ Salon Appointment Booking System
        </h5>
        <p style={{ margin: "8px 0", color: "#4B3832" }}>
          Book. Beautify. Be Confident. — Effortless salon booking made simple.
        </p>

        <div style={{ fontSize: "14px", color: "#7B6F63" }}>
          <span style={{ marginRight: "15px" }}>Privacy Policy</span>
          |
          <span style={{ marginLeft: "15px" }}>Terms & Conditions</span>
        </div>

        <hr style={{ borderColor: "#D2B48C", width: "80%", margin: "15px auto" }} />
        <p style={{ fontSize: "13px", color: "#7B6F63" }}>
          © {new Date().getFullYear()} Salon Appointment Booking System — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}