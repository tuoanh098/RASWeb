import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import heroBg from "../assets/RAS MOCKUP.jpg";
import rasLogo from "../assets/RASlogo.png";

const THEME = {
  primary: "#6d28d9",   // tím RAS
  primaryDark: "#5b21b6",
  accent: "#0ea5e9",    // xanh sky
  yellow: "#fbbf24",    // vàng nhấn
};

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password: pass })
    })
      .then(async (r) => {
        if (!r.ok) {
          if (r.status === 401) throw new Error("Sai mật khẩu");
          const j = await r.json().catch(() => ({}));
          throw new Error(j?.message || "Đăng nhập thất bại");
        }
        return r.json();
      })
      .then((res) => {
        const payload = { token: res.token, user: res.username, role: res.role, ts: Date.now() };
        const store = remember ? localStorage : sessionStorage;
        store.setItem("ras_auth", JSON.stringify(payload));
        const redirectTo = (location.state && location.state.from) || "/";
        navigate(redirectTo, { replace: true });
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="relative min-h-screen">
      {/* BG full-screen */}
      <div
        className="fixed inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      {/* overlay làm tối nhẹ để form nổi hơn */}
      <div className="fixed inset-0 bg-black/25" />

      {/* content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl border shadow-xl backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.9)", borderColor: "#e5e7eb" }}
        >
          {/* header form với logo bên phải */}
          <div className="flex items-start justify-between p-6 pb-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Đăng nhập</h1>
              <p className="text-slate-600 text-sm">Vui lòng nhập thông tin để tiếp tục</p>
            </div>
            <img src={rasLogo} alt="RAS Logo" className="h-10 w-auto object-contain ml-4" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4 px-6 pb-6" autoComplete="on">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1 text-slate-800">
                Email hoặc Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                style={{ borderColor: "#e2e8f0" }}
                value={user}
                onChange={(e) => { setUser(e.target.value); if (error) setError(""); }}
                placeholder="nguyenvanA hoặc a@example.com"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-slate-800">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                style={{ borderColor: "#e2e8f0" }}
                value={pass}
                onChange={(e) => { setPass(e.target.value); if (error) setError(""); }}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 select-none text-sm text-slate-800">
                <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
                Ghi nhớ đăng nhập
              </label>
              <a className="text-sm" href="#" style={{ color: THEME.accent }}>Quên mật khẩu?</a>
            </div>

            {error && (
              <p className="text-red-600 text-sm">• {error}</p>
            )}

            {/* Nút theo tông RAS: gradient tím→xanh, chữ trắng */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-white font-semibold shadow transition active:scale-[.99]"
              style={{
                backgroundImage: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accent})`
              }}
              onMouseEnter={(e)=> e.currentTarget.style.backgroundImage =
                `linear-gradient(90deg, ${THEME.primaryDark}, ${THEME.accent})`}
              onMouseLeave={(e)=> e.currentTarget.style.backgroundImage =
                `linear-gradient(90deg, ${THEME.primary}, ${THEME.accent})`}
            >
              Đăng nhập
            </button>
          </form>

          {/* dải brand mảnh dưới form */}
          <div
            className="h-1 rounded-b-2xl"
            style={{
              backgroundImage: `linear-gradient(90deg, ${THEME.primary}, ${THEME.accent}, ${THEME.yellow})`
            }}
          />
          <div className="text-xs text-slate-600 text-center py-3">
            © {new Date().getFullYear()} RAS Music & Art
          </div>
        </div>
      </div>
    </div>
  );
}
