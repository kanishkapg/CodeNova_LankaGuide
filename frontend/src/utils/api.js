const API_BASE =
  (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://localhost:4000/api";

function getToken() {
  try {
    return localStorage.getItem("lg_token");
  } catch {
    return null;
  }
}

async function request(path, opts = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...opts,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  return res.json();
}

export const authRegister = async ({ name, email, password }) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
export const authLogin = async ({ email, password }) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const createOrGetUser = async ({ name, email }) => {
  // fallback for older demo behavior
  return request("/users", {
    method: "POST",
    body: JSON.stringify({ name, email }),
  });
};

export const getDepartments = async () => request("/departments");
export const listAppointments = async (userId) =>
  request(`/appointments?userId=${userId || ""}`);
export const createAppointment = async (body) =>
  request("/appointments", { method: "POST", body: JSON.stringify(body) });
export const updateAppointment = async (id, body) =>
  request(`/appointments/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const listNotifications = async (target) =>
  request(`/notifications${target ? `?target=${target}` : ""}`);
export const createNotification = async (body) =>
  request("/notifications", { method: "POST", body: JSON.stringify(body) });

export default { createOrGetUser, getDepartments };
