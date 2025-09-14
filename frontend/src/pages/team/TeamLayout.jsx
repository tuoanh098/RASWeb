import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function TeamLayout() {
  const tabs = [
    { to: "/doi-ngu/hoc-vien", label: "Học viên" },
    { to: "/doi-ngu/nhan-vien", label: "Nhân viên" },
    { to: "/doi-ngu/tai-khoan", label: "Tài khoản" },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(t => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `px-4 py-2 -mb-px border-b-2 transition
               ${isActive
                 ? "border-ras-purple text-ras-blue font-semibold"
                 : "border-transparent text-slate-600 hover:text-slate-900"}`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      {/* Nội dung con */}
      <Outlet />
    </div>
  );
}
