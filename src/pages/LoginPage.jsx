import React, { useState } from "react";
import { api } from "../services/api";

export default function LoginPage({ setUser, onNavigate }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    try {
      const res = await api.auth.login(form);

      const user = res.user ?? (await api.auth.me()).user;
      console.log("Logged-in user:", user); 
      if (!user) throw { error: "Invalid email or password" };
      setUser(user);

      if (user.role === "admin") onNavigate && onNavigate("admin");
      else if (user.role === "customer") onNavigate && onNavigate("customer");
      else setErr("Unknown user role");
    } catch (e) {
      console.error("Login error:", e);
      setErr(e.error || "Invalid email or password");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "85vh" }}>
      <div className="card p-4 w-100" style={{ maxWidth: 540, backgroundColor: '#f5f2e7', border: '1px solid #e6dccb' }}>
        <h4 className="text-center mb-3">Login</h4>
        {err && <div className="alert alert-danger">{err}</div>}
        <form onSubmit={submit}>

          <label className="form-label">Email</label>
          <input
            className="form-control mb-2"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required/>

          <label className="form-label">Password</label>
          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button className="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
