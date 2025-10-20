import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../services/api";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ client_name: "", service: "", date: "", time: "", status: "Pending", payment_method: "" });
  const [saving, setSaving] = useState(false);


  const fetchBookings = async () => {
    try {
      const data = await api.appointments.list();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await api.appointments.remove(id);
        fetchBookings();
      } catch (err) {
        console.error("Failed to delete booking:", err);
      }
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const name = (b.client_name || "").toLowerCase();
    const svc = (b.service || "").toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || svc.includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : b.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <div className="container mt-5">
        <div
          className="card p-4 shadow-lg border-0"
          style={{ backgroundColor: "#f5f2e7" }}
        >
          <h2 className="text-center mb-4 text-secondary fw-bold">
            Salon Dashboard
          </h2>

          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search booking by name or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-select w-25"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th><i className="bi bi-person me-1"></i>Customer</th>
                  <th><i className="bi bi-briefcase me-1"></i>Service</th>
                  <th><i className="bi bi-calendar-event me-1"></i>Date</th>
                  <th><i className="bi bi-check2-circle me-1"></i>Status</th>
                  <th><i className="bi bi-gear me-1"></i>Actions</th>
                </tr>
              </thead>
              <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b, index) => (
                  <tr key={b.id}>
                    <td>{index + 1}</td>
                    <td>{b.client_name}</td>
                    <td>{b.service}</td>
                    <td>{b.date} {b.time}</td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === "Completed"
                            ? "bg-success"
                            : b.status === "Cancelled"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          setEditingId(b.id);
                          setEditForm({
                            client_name: b.client_name || "",
                            service: b.service || "",
                            date: b.date || "",
                            time: b.time || "",
                            status: b.status || "Pending",
                            payment_method: b.payment_method || ""
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(b.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No bookings found.
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {editingId && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Booking (Admin)</h5>
                <button type="button" className="btn-close" onClick={() => setEditingId(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Customer Name</label>
                  <input type="text" className="form-control" value={editForm.client_name} onChange={(e)=>setEditForm({ ...editForm, client_name: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Service</label>
                  <select className="form-select" value={editForm.service} onChange={(e)=>setEditForm({ ...editForm, service: e.target.value })}>
                    <option value="">Select Service</option>
                    <option value="Haircut">Haircut</option>
                    <option value="Rebond">Rebond</option>
                    <option value="Hair Color">Hair Color</option>
                    <option value="Manicure">Manicure</option>
                    <option value="Pedicure">Pedicure</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" value={editForm.date} onChange={(e)=>setEditForm({ ...editForm, date: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Time</label>
                  <input type="time" className="form-control" value={editForm.time} onChange={(e)=>setEditForm({ ...editForm, time: e.target.value })} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={editForm.status} onChange={(e)=>setEditForm({ ...editForm, status: e.target.value })}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Payment Method</label>
                  <select className="form-select" value={editForm.payment_method} onChange={(e)=>setEditForm({ ...editForm, payment_method: e.target.value })}>
                    <option value="">-- Select --</option>
                    <option value="Cash">Cash</option>
                    <option value="GCash">GCash</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingId(null)} disabled={saving}>Close</button>
                <button className="btn btn-primary" disabled={saving || !editForm.client_name || !editForm.service || !editForm.date || !editForm.time} onClick={async ()=>{
                  if (!editForm.client_name || !editForm.service || !editForm.date || !editForm.time) {
                    alert('Please complete all required fields');
                    return;
                  }
                  try {
                    setSaving(true);
                    await api.appointments.update(editingId, { 
                      client_name: editForm.client_name,
                      service: editForm.service,
                      date: editForm.date,
                      time: editForm.time,
                      status: editForm.status,
                      payment_method: editForm.payment_method
                    });
                    setEditingId(null);
                    await fetchBookings();
                  } catch (e) {
                    alert(e?.error || 'Failed to update booking');
                  } finally {
                    setSaving(false);
                  }
                }}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
