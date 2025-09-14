import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Login.jsx — RAS professional login page
 * - Tông màu chủ đạo RAS (violet)
 * - Nhập email/username + mật khẩu
 * - Nhấn Enter => submit ngay, điều hướng vào trang chính
 * - Lưu phiên đăng nhập (localStorage nếu tick "Ghi nhớ", ngược lại sessionStorage)
 * - Không gọi API (demo). Có thể thay handleSubmit để gọi backend thật.
 */

const THEME = {
  primary: "#6d28d9", // violet-700
  primaryDark: "#5b21b6", // violet-800
  accent: "#0ea5e9", // sky-500
};

function LogoRAS({ className = "h-8 w-auto" }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg className={className} viewBox="0 0 64 64" aria-hidden>
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#g)" />
        <circle cx="22" cy="26" r="6" fill="white"/>
        <path d="M32 20v24" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M32 44c6-6 14-6 20 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </svg>
      <span className="text-xl font-extrabold tracking-tight" style={{color: THEME.primary}}>RAS</span>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  // Nếu đã đăng nhập, chuyển vào trang chính luôn
  useEffect(() => {
    const ok = !!(localStorage.getItem("ras_auth") || sessionStorage.getItem("ras_auth"));
    if (ok) navigate("/", { replace: true });
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    // Validate đơn giản
    if (!user || user.length < 2) return setError("Vui lòng nhập email/tên đăng nhập hợp lệ.");
    if (!pass || pass.length < 4) return setError("Mật khẩu tối thiểu 4 ký tự.");

    // Demo: đặt token giả, điều hướng vào trang chính
    const token = "ras-demo-token";
    const payload = { token, user, ts: Date.now() };
    const store = remember ? localStorage : sessionStorage;
    store.setItem("ras_auth", JSON.stringify(payload));

    const redirectTo = (location.state && location.state.from) || "/";
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-50">
      {/* Left visual */}
      <div className="relative hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-white to-sky-100" />
        <div className="absolute inset-0 p-10 flex flex-col">
          <LogoRAS className="h-10" />
          <div className="mt-auto" />
          <div className="text-3xl font-bold text-slate-800 max-w-md leading-tight">
            Nuôi dưỡng đam mê – Kiến tạo cộng đồng nghệ thuật
          </div>
          <div className="mt-3 text-slate-600 max-w-lg">
            Hệ sinh thái đào tạo âm nhạc & mỹ thuật với lộ trình cá nhân hoá, sân chơi biểu diễn và kiểm định chất lượng định kỳ.
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute -top-10 -left-10 h-64 w-64 rounded-full" style={{background: THEME.primary, opacity: .12}} />
        <div className="absolute -bottom-12 -right-12 h-72 w-72 rounded-full" style={{background: THEME.accent, opacity: .12}} />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 md:hidden"><LogoRAS /></div>
          <div className="rounded-2xl border bg-white shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-1" style={{color: THEME.primary}}>Đăng nhập</h1>
            <p className="text-slate-500 text-sm mb-6">Vui lòng nhập thông tin để tiếp tục</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email hoặc Tên đăng nhập</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e2e8f0", boxShadow: `0 0 0 0 rgba(0,0,0,0)`, }}
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="nguyenvanA hoặc a@example.com"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                <input
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e2e8f0" }}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 select-none text-sm">
                  <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
                  Ghi nhớ đăng nhập
                </label>
                <a className="text-sm" href="#" style={{color: THEME.accent}}>Quên mật khẩu?</a>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-white font-semibold shadow"
                style={{ background: THEME.primary }}
              >
                Đăng nhập
              </button>

              <div className="text-xs text-slate-500 text-center"></div>
            </form>
          </div>

          <div className="text-xs text-slate-500 text-center mt-4">
            © {new Date().getFullYear()} RAS Music & Art
          </div>
        </div>
      </div>
    </div>
  );
}
