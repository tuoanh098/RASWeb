import React, { useMemo } from "react";

/**
 * Dashboard1 (mock)
 * - Trực hôm nay: liệt kê giáo vụ trực theo ca tại các chi nhánh
 * - Lịch dạy hôm nay: bảng các buổi học với giờ, môn/lớp, GV, chi nhánh, sĩ số
 * 
 *
 * Không dùng API / thư viện ngoài. Có thể thả vào src/pages/Dashboard1.jsx
 * và trỏ route "/dashboard1" tới component này.
 */

// ===== Helpers =====
function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
const YMD = todayYMD();

function hhmm(s) {
  // s: "08:00" | Date | ISO -> return HH:mm
  if (!s) return "--:--";
  if (typeof s === "string" && /^\d{2}:\d{2}$/.test(s)) return s;
  const d = new Date(s);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// ===== Mock data =====
const MOCK_TRUC_HOM_NAY = [
  // Quận 1
  { id: 1, chi_nhanh_id: 1, chi_nhanh_ten: "RAS Quận 1", loai_ca: "Sáng", gio_bat_dau: "08:00", gio_ket_thuc: "12:00", nhan_vien_ten: "Nguyễn An", sdt: "0901 234 001" },
  { id: 2, chi_nhanh_id: 1, chi_nhanh_ten: "RAS Quận 1", loai_ca: "Chiều", gio_bat_dau: "13:00", gio_ket_thuc: "17:00", nhan_vien_ten: "Trần Bình", sdt: "0901 234 002" },
  // Quận 3
  { id: 3, chi_nhanh_id: 3, chi_nhanh_ten: "RAS Quận 3", loai_ca: "Sáng", gio_bat_dau: "08:00", gio_ket_thuc: "12:00", nhan_vien_ten: "Bùi Hạnh", sdt: "0901 234 006" },
  { id: 4, chi_nhanh_id: 3, chi_nhanh_ten: "RAS Quận 3", loai_ca: "Chiều", gio_bat_dau: "13:00", gio_ket_thuc: "17:00", nhan_vien_ten: "Võ Giang", sdt: "0901 234 005" },
  // Quận 7
  { id: 5, chi_nhanh_id: 7, chi_nhanh_ten: "RAS Quận 7", loai_ca: "Sáng", gio_bat_dau: "08:00", gio_ket_thuc: "12:00", nhan_vien_ten: "Lê Chi", sdt: "0901 234 003" },
  { id: 6, chi_nhanh_id: 7, chi_nhanh_ten: "RAS Quận 7", loai_ca: "Chiều", gio_bat_dau: "13:00", gio_ket_thuc: "17:00", nhan_vien_ten: "Phạm Duy", sdt: "0901 234 004" },
];

const MOCK_LICH_DAY_HOM_NAY = [
  {
    id: 101,
    bat_dau_luc: `${YMD}T08:30:00+07:00`,
    ket_thuc_luc: `${YMD}T09:30:00+07:00`,
    lop_ten: "Piano Cơ bản A1",
    mon: "Piano",
    giao_vien_ten: "Trần Minh",
    chi_nhanh_ten: "RAS Quận 1",
    si_so_dang_ky: 3,
    diem_danh_co_mat: 3,
    danh_sach_co_mat: ["Lan", "Huy", "Bảo"],
  },
  {
    id: 102,
    bat_dau_luc: `${YMD}T09:45:00+07:00`,
    ket_thuc_luc: `${YMD}T10:45:00+07:00`,
    lop_ten: "Guitar Nâng cao B2",
    mon: "Guitar",
    giao_vien_ten: "Ngô Thảo",
    chi_nhanh_ten: "RAS Quận 3",
    si_so_dang_ky: 4,
    diem_danh_co_mat: 3,
    danh_sach_co_mat: ["Quân", "My", "Nam"],
  },
  {
    id: 103,
    bat_dau_luc: `${YMD}T14:00:00+07:00`,
    ket_thuc_luc: `${YMD}T15:30:00+07:00`,
    lop_ten: "Thanh nhạc Beginner C1",
    mon: "Thanh nhạc",
    giao_vien_ten: "Hà My",
    chi_nhanh_ten: "RAS Quận 7",
    si_so_dang_ky: 5,
    diem_danh_co_mat: 4,
    danh_sach_co_mat: ["An", "Trúc", "Vi", "Tú"],
  },
  {
    id: 104,
    bat_dau_luc: `${YMD}T16:00:00+07:00`,
    ket_thuc_luc: `${YMD}T17:00:00+07:00`,
    lop_ten: "Drums Band Lab",
    mon: "Drums",
    giao_vien_ten: "Đỗ Hải",
    chi_nhanh_ten: "RAS Quận 1",
    si_so_dang_ky: 6,
    diem_danh_co_mat: 5,
    danh_sach_co_mat: ["An", "Bình", "Cát", "Duy", "Em"],
  },
];

// ===== UI blocks =====
function SectionBox({ title, children, right }) {
  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="font-semibold text-slate-800">{title}</h2>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function TrucHomNay({ rows }) {
  const byBranch = useMemo(() => {
    const g = {};
    rows.forEach((r) => {
      (g[r.chi_nhanh_ten] ||= []).push(r);
    });
    // sort ca Sáng -> Chiều -> Tối
    Object.values(g).forEach((arr) => arr.sort((a,b) => a.gio_bat_dau.localeCompare(b.gio_bat_dau)));
    return g;
  }, [rows]);

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {Object.entries(byBranch).map(([branch, arr]) => (
        <div key={branch} className="rounded-xl border p-4 bg-white">
          <div className="font-semibold text-slate-700 mb-2">{branch}</div>
          <div className="space-y-2">
            {arr.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border p-2">
                <div>
                  <div className="text-sm font-medium">{r.loai_ca} {r.gio_bat_dau}–{r.gio_ket_thuc}</div>
                  <div className="text-xs text-slate-500">{r.nhan_vien_ten} • {r.sdt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LichDayHomNay({ rows }) {
  const sorted = useMemo(() => [...rows].sort((a,b) => new Date(a.bat_dau_luc) - new Date(b.bat_dau_luc)), [rows]);

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left p-3 w-32">Giờ</th>
            <th className="text-left p-3">Môn / Lớp</th>
            <th className="text-left p-3">Giáo viên</th>
            <th className="text-left p-3">Chi nhánh</th>
            <th className="text-left p-3 w-40">Sĩ số</th>
            <th className="text-left p-3">Có mặt</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3 whitespace-nowrap">{hhmm(r.bat_dau_luc)}–{hhmm(r.ket_thuc_luc)}</td>
              <td className="p-3"><div className="font-medium">{r.mon}</div><div className="text-slate-600">{r.lop_ten}</div></td>
              <td className="p-3">{r.giao_vien_ten}</td>
              <td className="p-3">{r.chi_nhanh_ten}</td>
              <td className="p-3">{r.si_so_dang_ky} đăng ký</td>
              <td className="p-3">
                <details>
                  <summary className="cursor-pointer select-none">{r.diem_danh_co_mat} có mặt</summary>
                  <div className="mt-1 text-slate-600 text-xs">{r.danh_sach_co_mat.join(", ")}</div>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard1() {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bảng điều khiển</h1>
          <div className="text-slate-500 text-sm">Ngày: {YMD}</div>
        </div>
      </div>

      <SectionBox title="Trực hôm nay">
        <TrucHomNay rows={MOCK_TRUC_HOM_NAY} />
      </SectionBox>

      <SectionBox title="Lịch dạy hôm nay">
        <LichDayHomNay rows={MOCK_LICH_DAY_HOM_NAY} />
      </SectionBox>
    </div>
  );
}
