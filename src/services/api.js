const BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, method = "GET", body = null) {
  const opts = {
    method,
    credentials: "include",
  };

  if (body) {
    opts.headers = { "Content-Type": "application/json" };
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE}/${path}`, opts);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) throw json;
  return json;
}

export const api = {
  auth: {
    register: (data) => request("register", "POST", data),
    login: (data) => request("login", "POST", data),
    logout: () => request("logout", "GET"),
    me: () => request("me", "GET"),
  },
  appointments: {
    list: (query = "") => request(`appointments${query}`, "GET"),
    myAppointments: (query = "") => request(`appointments/my${query}`, "GET"),
    create: (data) => request("appointments", "POST", data),
    update: (id, data) => request(`appointments/${id}`, "PUT", data),
    cancel: (id) => request(`appointments/cancel/${id}`, "PUT"),
    remove: (id) => request(`appointments/${id}`, "DELETE"),
    summary: (params = "") => request(`appointments/analytics/summary${params}`, "GET"),
    byService: (params = "") => request(`appointments/analytics/by-service${params}`, "GET"),
    monthly: (year) => request(`appointments/analytics/monthly/${year}`, "GET"),
    byUser: (includeZero = false) => request(`appointments/analytics/by-user${includeZero ? '?includeZero=1' : ''}`, "GET"),
    search: (params = "") => request(`appointments/search${params}`, "GET"),
  },
};
