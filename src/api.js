//src/api.js
// Small fetch wrapper for the backend API.
// Auth: the backend sets an httpOnly "token" cookie on login (sent with
// credentials: "include"). The JWT is also kept in localStorage and sent as a
// Bearer header, so login still works when the browser blocks cross-site
// cookies (frontend and backend are on different Vercel domains).

export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const TOKEN_KEY = "token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

export async function api(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    // Session expired / not logged in: tell the app to drop the user.
    if (res.status === 401 && path !== "/api/auth/login") {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}
