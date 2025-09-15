import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../state/AppContext.jsx";

import rasLogo from "../assets/ras_logo.jpg";
const LOGO_URL = rasLogo;

function Item({ to, label, exact=false }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `block px-4 py-3 rounded-lg font-medium transition
         ${isActive ? "bg-ras-purple text-white" : "text-ras-blue hover:bg-ras-purple/10"}`
      }
    >
      {label}
    </NavLink>
  );
}

function SubItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block ml-2 px-3 py-2 rounded-md text-sm transition ${
          isActive
            ? "bg-slate-100 text-ras-blue font-semibold"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Layout({ children }) {
  // an toàn nếu quên bọc AppProvider
  const app = useApp() ?? { branchId: null, setBranchId: () => {} };
  const { branchId, setBranchId } = app;

  const [openTeam, setOpenTeam] = useState(true);
  const [openManage, setOpenManage] = useState(true);
  const [openFinance, setOpenFinance] = useState(true);
  const location = useLocation();

    function logout() {
      localStorage.removeItem("ras_auth");
      sessionStorage.removeItem("ras_auth");
      window.location.href = "/login";
    }
  return (
    <div className="min-h-screen bg-ras-white">
      <div className="flex">
        {/* ====== SIDEBAR ====== */}
        <aside className="w-[260px] bg-white border-r min-h-screen p-4 space-y-3">
          <div className="text-center mb-5">
            <div className="font-extrabold text-ras-blue text-2xl leading-6">RAS</div>
            <div className="text-slate-600">Admin Panel</div>
            <div className="mx-auto mt-3 w-40 h-40 rounded-2xl bg-slate-100 border flex items-center justify-center overflow-hidden shadow-sm">
              <img
                src={LOGO_URL}
                alt="RAS logo"
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.textContent = "LOGO";
                }}
              />
            </div>
          </div>

          <Item to="/" label="Tổng quan" exact />
          <Item to="/khoa-hoc" label="Khóa học" />
          
          {/* ĐỘI NGŨ */}
          <div>
            <button
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-ras-blue hover:bg-ras-purple/10"
              onClick={() => setOpenTeam(v => !v)}
            >
              Đội ngũ
            </button>
            {openTeam && (
              <div className="mt-1 space-y-1">
                <SubItem to="/doi-ngu/hoc-vien" label="Học viên" />
                <SubItem to="/doi-ngu/nhan-vien" label="Nhân viên" />
                <SubItem to="/doi-ngu/tai-khoan" label="Tài khoản" />
              </div>
            )}
          </div>

          {/* QUẢN LÝ */}
          <div>
            <button
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-ras-blue hover:bg-ras-purple/10"
              onClick={() => setOpenManage(v => !v)}
            >
              Quản lý
            </button>
            {openManage && (
              <div className="mt-1 space-y-1">
                <SubItem to="/quan-ly/diem-danh" label="Điểm danh" />
                <SubItem to="/quan-ly/xep-lop" label="Xếp lớp" />
                <SubItem to="/quan-ly/xep-lich-truc" label="Xếp lịch trực" />
              </div>
            )}  
          </div>

          {/* TÀI CHÍNH */}
          <div>
            <button
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-ras-blue hover:bg-ras-purple/10"
              onClick={() => setOpenFinance(v => !v)}
            >
            Tài chính
            </button>
            {openFinance && (
              <div className="mt-1 space-y-1">
                <SubItem to="/luong-nhan-vien" label="Lương nhân viên" />
              </div>
            )}
          </div>
          <Item to="/cai-dat" label="Cài đặt" />

          {/* Đăng xuất (mock) */}
        <button onClick={logout} className="px-3 py-2 rounded border">Đăng xuất</button>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
