import React, { useEffect } from 'react';
import { useForm } from '../hooks/useForm';
import { api } from '../services/api';

export default function AppointmentForm({ editItem, onSaved, user }) {
  const [form, setForm, onChange, reset] = useForm({
    client_name: '',
    service: '',
    date: '',
    time: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (editItem) {
      setForm({
        client_name: editItem.client_name,
        service: editItem.service,
        date: editItem.date,
        time: editItem.time,
        status: editItem.status
      });
    } else reset();
  }, [editItem]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editItem && editItem.id) {
        await api.appointments.update(editItem.id, form);
      } else {
        await api.appointments.create(form);
      }
      reset();
      if (onSaved) onSaved();
    } catch (err) {
      alert(err.error || 'Error saving');
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h5>{editItem ? 'Edit Appointment' : 'Book a Salon Appointment'}</h5>
      <form onSubmit={submit}>
        <div className="row">
          <div className="col-md-6 mb-2">
            <input
              name="client_name"
              value={form.client_name}
              onChange={onChange}
              className="form-control"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="col-md-6 mb-2">
            <input
              name="service"
              value={form.service}
              onChange={onChange}
              className="form-control"
              placeholder="Service (e.g., Rebond, Haircut)"
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-2">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6 mb-2">
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="mb-2">
            <select name="status" value={form.status} onChange={onChange} className="form-select">
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        )}

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              reset();
              if (onSaved) onSaved();
            }}
          >
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            {editItem ? 'Update' : 'Book Now'}
          </button>
        </div>
      </form>
    </div>
  );
}
