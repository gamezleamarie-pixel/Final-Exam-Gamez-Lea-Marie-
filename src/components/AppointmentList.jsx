import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSearch } from '../hooks/useSearch';
import { useFilter } from '../hooks/useFilter';
import { useConfirm } from '../hooks/useConfirm';
import { useDate } from '../hooks/useDate';

export default function AppointmentList({ onEdit, user }) {
  const [list, setList] = useState([]);
  const { q, setQ, debounced } = useSearch('');
  const { filters, set, clear } = useFilter({ status: '' });
  const confirm = useConfirm();
  const { format } = useDate();

  const load = async () => {
    try {
      const params = [];
      if (debounced) params.push(`search=${encodeURIComponent(debounced)}`);
      if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const data = await api.appointments.list(query);
      setList(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load');
    }
  };

  useEffect(() => {
    load();
  }, [debounced, filters.status]);

  const handleDelete = async (id) => {
    confirm('Delete this appointment?', async () => {
      try {
        await api.appointments.remove(id);
        load();
      } catch (e) {
        alert(e.error || 'Delete failed');
      }
    });
  };

  const handleCancel = async (item) => {
    try {
      await api.appointments.update(item.id, { ...item, status: 'Cancelled' });
      alert('Appointment cancelled successfully');
      load();
    } catch (e) {
      alert(e.error || 'Cancel failed');
    }
  };

  return (
    <div className="card p-3">
      <div className="d-flex mb-2 align-items-center">
        <input
          placeholder="Search appointment..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="form-control me-2"
        />
        <select
          className="form-select w-auto"
          value={filters.status}
          onChange={(e) => set('status', e.target.value)}
        >
          <option value="">All status</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <button className="btn btn-outline-secondary ms-2" onClick={() => { setQ(''); clear(); }}>
          Clear
        </button>
      </div>

      <div style={{ maxHeight: 420, overflowY: 'auto' }}>
        {list.length === 0 && <div className="text-muted">No appointments</div>}
        {list.map((item) => (
          <div key={item.id} className="d-flex justify-content-between align-items-start border-bottom py-2">
            <div>
              <strong>{item.client_name}</strong> <small className="text-muted">({item.service})</small>
              <div className="small text-muted">
                {item.date} {item.time} • {item.status}
              </div>
              {user?.role === 'admin' && (
                <div className="small text-muted">Booked by: {item.user_name}</div>
              )}
            </div>
            <div className="d-flex flex-column gap-2">
              {user?.role === 'admin' ? (
                <>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(item)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </>
              ) : (
                <>
                  {item.status !== 'Cancelled' ? (
                    <button className="btn btn-sm btn-warning" onClick={() => handleCancel(item)}>
                      Cancel
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-secondary" disabled>
                      Cancelled
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
