import React, { useEffect, useState } from "react";
import { api } from "../services/api";

export default function CustomerDashboard({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ service: "", date: "", time: "" });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ service: "", date: "", time: "" });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchAppointments = async () => {
    try {
      const data = await api.appointments.myAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    }
  };

  const createAppointment = async (e) => {
    e.preventDefault();
    if (!form.service || !form.date || !form.time) {
      setMessage("Please fill all fields");
      return;
    }
    try {
      await api.appointments.create({
        client_name: user?.name || "",
        service: form.service,
        date: form.date,
        time: form.time,
      });
      setForm({ service: "", date: "", time: "" });
      setMessage("Appointment booked successfully!");
      fetchAppointments();
    } catch (err) {
      setMessage("Failed to book appointment");
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await api.appointments.cancel(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
      );
      setMessage("Appointment cancelled successfully!");
    } catch (err) {
      setMessage("Failed to cancel appointment");
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await api.appointments.remove(id);
      setMessage("Deleted successfully!");
      fetchAppointments();
    } catch (err) {
      setMessage("Failed to delete appointment");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-3">My Appointments</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={createAppointment} className="mb-4">
          <div className="row g-2">
            <div className="col-md-5">
              <select
                className="form-select"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
              >
                <option value="">Select Service</option>
                <option value="Haircut">Haircut</option>
                <option value="Rebond">Rebond</option>
                <option value="Hair Color">Hair Color</option>
                <option value="Manicure">Manicure</option>
                <option value="Pedicure">Pedicure</option>
              </select>
            </div>
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                type="time"
                className="form-control"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <div className="col-md-12 col-lg-3">
              <button className="btn btn-primary w-100">Book</button>
            </div>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table table-bordered mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th><i className="bi bi-briefcase me-1"></i>Service</th>
                <th><i className="bi bi-calendar-event me-1"></i>Date</th>
                <th><i className="bi bi-check2-circle me-1"></i>Status</th>
                <th><i className="bi bi-gear me-1"></i>Actions</th>
              </tr>
            </thead>
            <tbody>
            {appointments.length > 0 ? (
              appointments.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.service}</td>
                  <td>{a.date} {a.time}</td>
                  <td>
                    <span
                      className={`badge ${
                        a.status === "Cancelled"
                          ? "bg-danger"
                          : a.status === "Completed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {a.status !== "Cancelled" ? (
                      <button
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => cancelAppointment(a.id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-secondary" disabled>
                        Cancelled
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      onClick={() => {
                        setEditingId(a.id);
                        setEditForm({ service: a.service || "", date: a.date || "", time: a.time || "" });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteAppointment(a.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No appointments yet.
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
      {editingId && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Booking</h5>
                <button type="button" className="btn-close" onClick={() => setEditingId(null)}></button>
              </div>
              <div className="modal-body">
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
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingId(null)} disabled={savingEdit}>Close</button>
                <button className="btn btn-primary" disabled={savingEdit || !editForm.service || !editForm.date || !editForm.time} onClick={async ()=>{
                  if (!editForm.service || !editForm.date || !editForm.time) {
                    setMessage('Please complete all required fields');
                    return;
                  }
                  try {
                    setSavingEdit(true);
                    await api.appointments.update(editingId, { service: editForm.service, date: editForm.date, time: editForm.time });
                    setAppointments(prev => prev.map(x => x.id === editingId ? { ...x, service: editForm.service, date: editForm.date, time: editForm.time } : x));
                    setEditingId(null);
                    setMessage("Updated successfully!");
                  } catch (e) {
                    setMessage(e?.error || "Failed to update booking");
                  } finally {
                    setSavingEdit(false);
                  }
                }}>{savingEdit ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
