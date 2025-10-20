import React, { useState } from 'react';
import { api } from '../services/api';

export default function RegisterPage({ onNavigate }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (form.password !== form.confirmPassword) {
      setMsg('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setMsg('Registered. Please login.');
      setTimeout(()=> onNavigate('login'), 900);
    } catch (err) {
      setMsg(err.error || 'Error');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "85vh" }}>
      <div className="card p-4 w-100" style={{ maxWidth: 540, backgroundColor: '#f5f2e7', border: '1px solid #e6dccb' }}>
        <h4 className="text-center mb-3">Register</h4>
        {msg && <div className="alert alert-info">{msg}</div>}
        <form onSubmit={submit}>

        <label className="form-label">Name</label>
        <input 
        className="form-control mb-2" 
        placeholder="Enter Name" 
        value={form.name} 
        onChange={e=>setForm({...form,name:e.target.value})} required />

        <label className="form-label">Email</label>
        <input 
        className="form-control mb-2" 
        placeholder="Enter Email" 
        type="email" 
        value={form.email} 
        onChange={e=>setForm({...form,email:e.target.value})} required />

        <label className="form-label">Password</label>
        <input 
        className="form-control mb-3" 
        placeholder="Enter Password" 
        type="password" 
        value={form.password} 
        onChange={e=>setForm({...form,password:e.target.value})} required />

        <label className="form-label">Confirm Password</label>
        <input 
        className="form-control mb-3" 
        placeholder="Confirm Password" 
        type="password" 
        value={form.confirmPassword} 
        onChange={e=>setForm({...form,confirmPassword:e.target.value})} required />

        <div className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between">
            <button className="btn btn-secondary" type="button" onClick={()=> onNavigate('landing')}>Back</button>
            <button
              disabled={loading || !form.name || !form.email || !form.password || !form.confirmPassword || form.password !== form.confirmPassword}
              type="submit"
              className="btn btn-primary"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>
          <small className="text-center">
            Already have an account? <button type="button" className="btn btn-link p-0 align-baseline" onClick={()=> onNavigate('login')}>Login</button>
          </small>
        </div>
      </form>
    </div>
    </div>
  );
}