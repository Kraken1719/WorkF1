// The API base URL comes from an environment variable (set in .env or at Docker build time).
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Token ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Object.values(data).flat().join(" ") || "Request failed";
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (user) => request("/auth/register/", { method: "POST", body: user }),
  login: (credentials) => request("/auth/login/", { method: "POST", body: credentials }),
  logout: (token) => request("/auth/logout/", { method: "POST", token }),
  listItems: (token) => request("/items/", { token }),
  createItem: (token, item) => request("/items/", { method: "POST", body: item, token }),
  updateItem: (token, id, changes) =>
    request(`/items/${id}/`, { method: "PATCH", body: changes, token }),
  deleteItem: (token, id) => request(`/items/${id}/`, { method: "DELETE", token }),
};
