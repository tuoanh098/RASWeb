// src/lib/http.js
export function qs(obj = {}) {
  const p = Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return p ? `?${p}` : "";
}

export async function req(method, url, body, options = {}) {
  const isForm = body instanceof FormData;
  const headers = isForm ? {} : { "Content-Type": "application/json" };
  const res = await fetch(url, {
    method,
    headers: { ...headers, ...(options.headers || {}) },
    body: isForm ? body : body != null ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const noBody =
    res.status === 204 ||
    res.status === 205 ||
    res.headers.get("content-length") === "0" ||
    !(res.headers.get("content-type") || "").includes("application/json");

  if (!res.ok) {
    let msg = "";
    try {
      msg = noBody ? "" : JSON.stringify(await res.json());
    } catch {
      msg = await res.text();
    }
    throw new Error(msg || `${res.status} ${res.statusText}`);
  }

  return noBody ? null : await res.json();
}
