import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "../state/AppContext.jsx";
import rasLogo from "../assets/ras_logo.jpg";

const LOGO_URL = rasLogo;

/* ---------------- Brand building blocks ---------------- */

function SectionPanel({ open, onClick, children }) {
  // Panel brand: nền nhẹ (20–30%), mở ra thì đậm hơn 1 nấc
  return (
    <button
      data-open={open}
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-3 rounded-xl font-semibold transition shadow-sm",
        "bg-gradient-to-r from-ras-blue/20 to-ras-purple/20 text-ras-blue",
        "hover:from-ras-blue/30 hover:to-ras-purple/30 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-ras-yellow/40",
        "data-[open=true]:from-ras-blue/30 data-[open=true]:to-ras-purple/30",
        "ring-1 ring-ras-purple/20"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Item({ to, label, exact = false }) {
  // Link chính: active NHẸ ( tím/20 ) + chữ xanh, viền mảnh
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        [
          "group relative block px-4 py-3 rounded-xl font-medium transition",
          isActive
            ? "bg-ras-purple/20 text-ras-blue ring-1 ring-ras-purple/30 shadow-sm"
            : "text-ras-blue hover:bg-ras-purple/10 hover:ring-1 hover:ring-ras-purple/20"
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {/* gạch vàng bên trái, nhạt hơn khi chưa active */}
          <span
            className={[
              "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full transition-all",
              isActive ? "bg-ras-yellow/90" : "bg-ras-yellow/50 opacity-0 group-hover:opacity-100"
            ].join(" ")}
          />
          {label}
        </>
      )}
    </NavLink>
  );
}

function SubItem({ to, label }) {
  // Link con: active rất nhẹ ( tím/15 ), hover tím/10
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "block ml-2 px-3 py-2 rounded-lg text-sm transition",
          isActive
            ? "bg-ras-purple/15 text-ras-blue font-semibold ring-1 ring-ras-purple/20"
            : "text-slate-700 hover:bg-ras-purple/10 hover:text-ras-blue"
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

/* ---------------- Layout ---------------- */

export default function Layout({ children }) {
  const app = useApp() ?? { branchId: null, setBranchId: () => {} };
  const { branchId, setBranchId } = app;

  const [openTeam, setOpenTeam] = useState(true);
  const [openManage, setOpenManage] = useState(true);
  const [openFinance, setOpenFinance] = useState(true);
  const [openCourses, setOpenCourses] = useState(true);
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
        <aside
          className={[
            "w-[280px] min-h-screen p-4 space-y-3 border-r",
            // nền sidebar nhẹ & sạch mắt
            "bg-gradient-to-b from-ras-white via-white to-ras-purple/5"
          ].join(" ")}
        >
          {/* brand */}
          <div className="text-center mb-5">
            <div className="font-extrabold text-ras-blue text-2xl leading-6 tracking-wide">RAS</div>
            <div className="text-slate-600">Admin Panel</div>

            <div className="mx-auto mt-3 w-40 h-40 rounded-2xl bg-white/80 border border-ras-blue/15 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition">
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

            {/* dải brand */}
            <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-ras-yellow via-ras-purple to-ras-blue" />
          </div>
          <div className="space-y-1">
              <SectionPanel open={true} onClick={() => navigate()}>
              Tổng quan
            </SectionPanel>
          </div>
          {/* ===== Tổng quan (cũng là panel giống các nút) ===== */}


          {/* ===== KHÓA HỌC ===== */}
          <div className="space-y-1">
            <SectionPanel open={openCourses} onClick={() => setOpenCourses(v => !v)}>
              Khóa học
            </SectionPanel>
            {openCourses && (
              <div className="mt-1 space-y-1">
                <SubItem to="khoa-hoc/xem-khoa-hoc" label="Xem khóa học" />
                <SubItem to="khoa-hoc/dang-ki-khoa-hoc" label="Đăng kí khóa học" />
              </div>
            )}
          </div>

          {/* ===== THÔNG TIN ===== */}
          <div className="space-y-1">
            <SectionPanel open={openTeam} onClick={() => setOpenTeam(v => !v)}>
              Thông tin
            </SectionPanel>
            {openTeam && (
              <div className="mt-1 space-y-1">
                <SubItem to="/doi-ngu/hoc-vien" label="Học viên" />
                <SubItem to="/doi-ngu/nhan-vien" label="Nhân viên" />
                <SubItem to="/doi-ngu/tai-khoan" label="Tài khoản" />
              </div>
            )}
          </div>

          {/* ===== QUẢN LÝ ===== */}
          <div className="space-y-1">
            <SectionPanel open={openManage} onClick={() => setOpenManage(v => !v)}>
              Quản lý
            </SectionPanel>
            {openManage && (
              <div className="mt-1 space-y-1">
                <SubItem to="/quan-ly/xep-lop" label="Xếp lớp" />
                <SubItem to="/quan-ly/xep-lich-truc" label="Xếp lịch trực" />
              </div>
            )}
          </div>

          {/* ===== TÀI CHÍNH ===== */}
          <div className="space-y-1">
            <SectionPanel open={openFinance} onClick={() => setOpenFinance(v => !v)}>
              Tài chính
            </SectionPanel>
            {openFinance && (
              <div className="mt-1 space-y-1">
                <SubItem to="/luong-nhan-vien" label="Tính lương nhân viên" />
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="mt-2 w-full px-3 py-2 rounded-xl border border-ras-blue/30 text-ras-blue hover:bg-ras-purple/10 transition"
          >
            Đăng xuất
          </button>
        </aside>

        {/* ====== MAIN ====== */}
        <main className="flex-1 p-6">
          {/* thanh brand mảnh */}
          <div className="mb-4 h-1 rounded-full bg-gradient-to-r from-ras-purple via-ras-blue to-ras-yellow" />
          {children}
        </main>
      </div>
    </div>
  );
}
