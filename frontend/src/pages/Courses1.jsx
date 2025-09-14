import React, { useEffect, useMemo, useState } from "react";

/**
 * Courses1.jsx — Trang quản lý Khoá học (mock 100%)
 * - Khởi tạo dữ liệu từ bảng học phí (hp.xlsx) đã rút gọn
 * - Tìm kiếm, sắp xếp, thêm/sửa/xoá tại chỗ
 * - Lưu/persist vào localStorage (key: ras_courses1)
 *
 * Cách dùng: đặt file vào src/pages/Courses1.jsx và thêm route "/courses1"
 */

// ======================= MOCK DATA (rút từ hp.xlsx) ==========================
const INITIAL_COURSES = [
  { id: 1, nhom: "Cá nhân 45p - Piano/Trống/Thanh nhạc/Guitar/Bass", giai_doan: "SƠ CẤP", grade: "Pre - Grade", hoc_phi_buoi: 450000, khoa_12_buoi: 5400000, khoa_16_buoi: 7200000, ghi_chu: "Áp dụng cho riêng Quận 2" },
  { id: 2, nhom: "Cá nhân 45p - Piano/Trống/Thanh nhạc/Guitar/Bass", giai_doan: "SƠ TRUNG CẤP CƠ BẢN", grade: "Grade 1, Grade 2, Grade 3", hoc_phi_buoi: 500000, khoa_12_buoi: 6000000, khoa_16_buoi: 8000000, ghi_chu: "Đối với Quận 7 HP từ Pre đến G3 như nhau" },
  { id: 3, nhom: "Cá nhân 45p - Piano/Trống/Thanh nhạc/Guitar/Bass", giai_doan: "SƠ TRUNG CẤP NÂNG CAO", grade: "Grade 4", hoc_phi_buoi: 550000, khoa_12_buoi: 6600000, khoa_16_buoi: 8800000, ghi_chu: "Áp dụng 2 quận như nhau " },
  { id: 4, nhom: "Cá nhân 45p - Piano/Trống/Thanh nhạc/Guitar/Bass", giai_doan: "TRUNG CẤP", grade: "Grade 5", hoc_phi_buoi: 600000, khoa_12_buoi: 7200000, khoa_16_buoi: 9600000, ghi_chu: "" },
  { id: 5, nhom: "Cá nhân 45p - Piano/Trống/Thanh nhạc/Guitar/Bass", giai_doan: "TRUNG CẤP CHUYÊN SÂU", grade: "Grade 6, Grade 7", hoc_phi_buoi: 650000, khoa_12_buoi: 7800000, khoa_16_buoi: 10400000, ghi_chu: "" },
  { id: 6, nhom: "Cá nhân 45p - Piano/Trống/Thanh nhạc/Guitar/Bass", giai_doan: "TIỀN CHUYÊN NGHIỆP", grade: "Grade 8", hoc_phi_buoi: 700000, khoa_12_buoi: 8400000, khoa_16_buoi: 11200000, ghi_chu: "" },

  { id: 7, nhom: "Cá nhân 45p - Sax/Trumpet/Flute/Violin/Cello/Contrabass", giai_doan: "SƠ CẤP", grade: "Pre - Grade", hoc_phi_buoi: 500000, khoa_12_buoi: 6000000, khoa_16_buoi: 8000000, ghi_chu: "" },
  { id: 8, nhom: "Cá nhân 45p - Sax/Trumpet/Flute/Violin/Cello/Contrabass", giai_doan: "SƠ TRUNG CẤP CƠ BẢN", grade: "Grade 1, Grade 2, Grade 3", hoc_phi_buoi: 550000, khoa_12_buoi: 6600000, khoa_16_buoi: 8800000, ghi_chu: "" },
  { id: 9, nhom: "Cá nhân 45p - Sax/Trumpet/Flute/Violin/Cello/Contrabass", giai_doan: "SƠ TRUNG CẤP NÂNG CAO - TRUNG CẤP", grade: "Grade 4, Grade 5", hoc_phi_buoi: 600000, khoa_12_buoi: 7200000, khoa_16_buoi: 9600000, ghi_chu: "" },
  { id: 10, nhom: "Cá nhân 45p - Sax/Trumpet/Flute/Violin/Cello/Contrabass", giai_doan: "TRUNG CẤP CHUYÊN SÂU", grade: "Grade 6, Grade 7", hoc_phi_buoi: 650000, khoa_12_buoi: 7800000, khoa_16_buoi: 10400000, ghi_chu: "" },

  { id: 11, nhom: "Cá nhân 60p - Sax/Trumpet/Flute/Violin/Cello/Contrabass", giai_doan: "SƠ CẤP", grade: "Pre - Grade, Grade 1", hoc_phi_buoi: 600000, khoa_12_buoi: 7200000, khoa_16_buoi: 9600000, ghi_chu: "" },
  { id: 12, nhom: "Cá nhân 60p - Sax/Trumpet/Flute/Violin/Cello/Contrabass", giai_doan: "SƠ TRUNG CẤP CƠ BẢN", grade: "Grade 2, Grade 3", hoc_phi_buoi: 650000, khoa_12_buoi: 7800000, khoa_16_buoi: 10400000, ghi_chu: "" },
  { id: 13, nhom: "Cá nhân 60p - Sax/Trumpet/Flute/Violin/Cello/Contrabass", giai_doan: "SƠ TRUNG CẤP NÂNG CAO - TRUNG CẤP", grade: "Grade 4, Grade 5", hoc_phi_buoi: 700000, khoa_12_buoi: 8400000, khoa_16_buoi: 11200000, ghi_chu: "" },
  { id: 14, nhom: "Cá nhân 60p - Sax/Trumpet/Flute/Violin/Cello/Contrabass", giai_doan: "TRUNG CẤP CHUYÊN SÂU", grade: "Grade 6, Grade 7", hoc_phi_buoi: 750000, khoa_12_buoi: 9000000, khoa_16_buoi: 12000000, ghi_chu: "" },
  { id: 15, nhom: "Cá nhân 60p - Sax/Trumpet/Flute/Violin/Cello/Contrabass", giai_doan: "TIỀN CHUYÊN NGHIỆP", grade: "Grade 8", hoc_phi_buoi: 800000, khoa_12_buoi: 9600000, khoa_16_buoi: 12800000, ghi_chu: "" },

  { id: 16, nhom: "Nhóm 3 - 60p (Piano/Guitar/Thanh nhạc)", giai_doan: "SƠ CẤP", grade: "Pre - Grade", hoc_phi_buoi: 350000, khoa_12_buoi: null, khoa_16_buoi: 5600000, ghi_chu: "Áp dụng cho riêng Quận 2" },
  { id: 17, nhom: "Nhóm 3 - 60p (Piano/Guitar/Thanh nhạc)", giai_doan: "SƠ TRUNG CẤP CƠ BẢN", grade: "Grade 1, Grade 2, Grade 3", hoc_phi_buoi: 375000, khoa_12_buoi: null, khoa_16_buoi: 6000000, ghi_chu: "Đối với Quận 7 HP từ Pre đến G3 như nhau" },
  { id: 18, nhom: "Nhóm 3 - 60p (Piano/Guitar/Thanh nhạc)", giai_doan: "SƠ TRUNG CẤP NÂNG CAO - TRUNG CẤP", grade: "Grade 4, Grade 5", hoc_phi_buoi: 412500, khoa_12_buoi: null, khoa_16_buoi: 6600000, ghi_chu: "Áp dụng cho cả 2 Quận như nhau" },

  { id: 19, nhom: "Lớp giải trí người lớn - 60p", giai_doan: "LỚP GIẢI TRÍ", grade: "Lớp giải trí", hoc_phi_buoi: 600000, khoa_12_buoi: 7200000, khoa_16_buoi: null, ghi_chu: "Áp dụng 2 quận như nhau" },
];

// ============================= Helpers =======================================
const LS_KEY = "ras_courses1";
const vnd = (n) => (n == null || n === "" ? "—" : Number(n).toLocaleString("vi-VN"));
function toNumberOrNull(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function SortableTh({ label, sortKey, activeKey, dir, onSort, className = "" }) {
  const isActive = activeKey === sortKey;
  return (
    <th
      className={`text-left p-3 cursor-pointer select-none ${className}`}
      onClick={() => onSort(sortKey)}
      title="Bấm để sắp xếp"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? <span className="text-slate-400">{dir === "asc" ? "▲" : "▼"}</span> : <span className="text-slate-300">△</span>}
      </span>
    </th>
  );
}

function InlineInput({ value, onChange, type = "text", placeholder = "", className = "input w-full" }) {
  return (
    <input
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className={`border rounded px-2 py-1 text-sm ${className}`}
    />
  );
}

// =============================== Main Page ===================================
export default function Courses1() {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState("nhom");
  const [sortDir, setSortDir] = useState("asc");
  const [rows, setRows] = useState(() => {
    try {
      const fromLS = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      return Array.isArray(fromLS) && fromLS.length ? fromLS : INITIAL_COURSES;
    } catch { return INITIAL_COURSES; }
  });

  // editing
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(rows));
  }, [rows]);

  function onSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    let arr = rows.filter((r) =>
      k ? `${r.nhom} ${r.giai_doan} ${r.grade} ${r.ghi_chu}`.toLowerCase().includes(k) : true
    );
    arr.sort((a, b) => {
      const A = a[sortKey];
      const B = b[sortKey];
      const cmp = (typeof A === "number" && typeof B === "number")
        ? (A - B)
        : String(A ?? "").localeCompare(String(B ?? ""), "vi");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [rows, q, sortKey, sortDir]);

  function beginEdit(row) {
    setEditId(row.id);
    setDraft({ ...row });
  }
  function cancelEdit() { setEditId(null); setDraft(null); }
  function saveEdit() {
    if (!draft) return;
    const cleaned = {
      ...draft,
      hoc_phi_buoi: toNumberOrNull(draft.hoc_phi_buoi),
      khoa_12_buoi: toNumberOrNull(draft.khoa_12_buoi),
      khoa_16_buoi: toNumberOrNull(draft.khoa_16_buoi),
    };
    setRows((prev) => prev.map((r) => (r.id === editId ? cleaned : r)));
    setEditId(null); setDraft(null);
  }
  function removeRow(id) {
    if (!confirm("Xóa khoá này?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  }
  function addNew() {
    const nextId = (rows.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
    const base = { id: nextId, nhom: "", giai_doan: "", grade: "", hoc_phi_buoi: null, khoa_12_buoi: null, khoa_16_buoi: null, ghi_chu: "" };
    setRows((prev) => [base, ...prev]);
    setEditId(nextId); setDraft(base);
  }

  function exportCSV() {
    const header = ["id","nhom","giai_doan","grade","hoc_phi_buoi","khoa_12_buoi","khoa_16_buoi","ghi_chu"]; 
    const lines = [header.join(",")].concat(rows.map(r => header.map(k => JSON.stringify(r[k] ?? "")).join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "courses1.csv"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Khoá học</h1>
          <div className="text-slate-500 text-sm"></div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={addNew}>+ Thêm khoá</button>
          <button className="px-3 py-2 rounded border" onClick={exportCSV}>Xuất CSV</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="border rounded px-3 py-2 w-full md:w-96"
          placeholder="Tìm theo nhóm / giai đoạn / grade / ghi chú..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-y">
            <tr>
              <SortableTh label="Nhóm" sortKey="nhom" activeKey={sortKey} dir={sortDir} onSort={onSort} className="min-w-[260px]" />
              <SortableTh label="Giai đoạn" sortKey="giai_doan" activeKey={sortKey} dir={sortDir} onSort={onSort} />
              <SortableTh label="Grade" sortKey="grade" activeKey={sortKey} dir={sortDir} onSort={onSort} className="min-w-[180px]" />
              <SortableTh label="HP/buổi" sortKey="hoc_phi_buoi" activeKey={sortKey} dir={sortDir} onSort={onSort} />
              <SortableTh label="Khoá 12" sortKey="khoa_12_buoi" activeKey={sortKey} dir={sortDir} onSort={onSort} />
              <SortableTh label="Khoá 16" sortKey="khoa_16_buoi" activeKey={sortKey} dir={sortDir} onSort={onSort} />
              <th className="text-left p-3">Ghi chú</th>
              <th className="text-left p-3 w-36">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b">
                {editId === r.id ? (
                  <>
                    <td className="p-2"><InlineInput value={draft.nhom} onChange={(v) => setDraft({ ...draft, nhom: v })} /></td>
                    <td className="p-2"><InlineInput value={draft.giai_doan} onChange={(v) => setDraft({ ...draft, giai_doan: v })} /></td>
                    <td className="p-2"><InlineInput value={draft.grade} onChange={(v) => setDraft({ ...draft, grade: v })} /></td>
                    <td className="p-2"><InlineInput type="number" value={draft.hoc_phi_buoi ?? ""} onChange={(v) => setDraft({ ...draft, hoc_phi_buoi: v })} /></td>
                    <td className="p-2"><InlineInput type="number" value={draft.khoa_12_buoi ?? ""} onChange={(v) => setDraft({ ...draft, khoa_12_buoi: v })} /></td>
                    <td className="p-2"><InlineInput type="number" value={draft.khoa_16_buoi ?? ""} onChange={(v) => setDraft({ ...draft, khoa_16_buoi: v })} /></td>
                    <td className="p-2"><InlineInput value={draft.ghi_chu} onChange={(v) => setDraft({ ...draft, ghi_chu: v })} /></td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button className="px-2 py-1 rounded bg-emerald-600 text-white" onClick={saveEdit}>Lưu</button>
                        <button className="px-2 py-1 rounded border" onClick={cancelEdit}>Huỷ</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{r.nhom}</td>
                    <td className="p-3 whitespace-nowrap">{r.giai_doan}</td>
                    <td className="p-3">{r.grade}</td>
                    <td className="p-3 whitespace-nowrap">{vnd(r.hoc_phi_buoi)}</td>
                    <td className="p-3 whitespace-nowrap">{vnd(r.khoa_12_buoi)}</td>
                    <td className="p-3 whitespace-nowrap">{vnd(r.khoa_16_buoi)}</td>
                    <td className="p-3">{r.ghi_chu}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button className="px-2 py-1 rounded border" onClick={() => beginEdit(r)}>Sửa</button>
                        <button className="px-2 py-1 rounded border text-red-600" onClick={() => removeRow(r.id)}>Xoá</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
