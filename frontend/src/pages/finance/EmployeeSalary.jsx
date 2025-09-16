// src/pages/finance/EmployeeSalary.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { SalaryApi } from "../../lib/salaryApi.js";
import EmployeesApi from "../../lib/employeesApi.js";
import { req, qs } from "../../lib/http.js";

/* ===== RAS brand ===== */
const RAS = {
  primary: "#4434C2",
  accent1: "#FF6F61",
  accent2: "#22B8B5",
  softBg: "linear-gradient(135deg,#f6f5ff 0%, #fffdf7 100%)",
};
const currency = (v) =>
  (Number(v ?? 0)).toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

const Section = ({ title, right, children }) => (
  <div className="rounded-2xl overflow-hidden border shadow-sm">
    <div
      className="px-4 py-3 flex items-center justify-between"
      style={{ background: RAS.softBg, borderBottom: "1px solid #ECE9FF" }}
    >
      <h3 className="font-semibold" style={{ color: RAS.primary }}>
        {title}
      </h3>
      <div className="flex items-center gap-2">{right}</div>
    </div>
    <div className="p-3 bg-white">{children}</div>
  </div>
);

/* ===== helpers ===== */
const fmtYYYYMM_toLabel = (yyyyMM) => {
  // "2025-09" -> "09/2025"
  if (!yyyyMM) return "";
  const [y, m] = yyyyMM.split("-");
  return `${m}/${y}`;
};

/* ====== Period Selector (scrollable dropdown) ====== */
function PeriodSelect({ value, onChange }) {
  // value: { id, nam_thang | namThang }
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]); // [{id, nam_thang}]
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const boxRef = useRef(null);

  async function fetchPeriods() {
    try {
      setErr("");
      setLoading(true);
      const list = (await req("GET", `/api/payroll/periods`)) || [];
      const getYYYYMM = (x) => x.nam_thang || x.namThang || "";
      list.sort((a, b) => (getYYYYMM(a) < getYYYYMM(b) ? 1 : getYYYYMM(a) > getYYYYMM(b) ? -1 : 0));
      setItems(list);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function onDocClick(e) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !items.length) fetchPeriods();
  }

  const label = value ? fmtYYYYMM_toLabel(value.nam_thang || value.namThang) : "Chọn kỳ lương";

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={toggle}
        className="px-3 py-2 rounded border min-w-[160px] flex items-center justify-between gap-2"
        style={{ borderColor: "#ECE9FF", color: "#111" }}
        title="Chọn kỳ lương (tháng/năm)"
      >
        <span>{value ? `Tháng ${label}` : "Chọn kỳ lương"}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" className={open ? "rotate-180" : ""}>
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-20 mt-2 w-64 rounded-xl border bg-white shadow-lg overflow-hidden"
          style={{ borderColor: "#ECE9FF" }}
        >
          <div className="px-3 py-2 text-sm font-medium" style={{ color: RAS.primary, background: RAS.softBg }}>
            Kỳ lương (mới → cũ)
          </div>
          {err && <div className="px-3 py-2 text-sm text-red-600">Lỗi: {err}</div>}
          <div className="max-h-72 overflow-auto">
            {loading ? (
              <div className="px-3 py-3 text-sm">Đang tải…</div>
            ) : items.length ? (
              items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    onChange(it);
                    setOpen(false);
                  }}
                  className={
                    "w-full text-left px-3 py-2 text-sm hover:bg-gray-50 " + (value?.id === it.id ? "bg-gray-50" : "")
                  }
                >
                  <div className="font-medium">Tháng {fmtYYYYMM_toLabel(it.nam_thang || it.namThang)}</div>
                  <div className="text-xs opacity-60">ID: {it.id}</div>
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-sm text-gray-500">Chưa có kỳ lương.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------- list editor tái sử dụng (hoa hồng/thưởng/...) ------- */
function ListEditor({ title, type, kyLuongId, nhanVienId, columns, buildCreatePayload }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ so_tien: "", ghi_chu: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const api = useMemo(() => {
    switch (type) {
      case "commissions":
        return {
          list: () => SalaryApi.commissions.list(kyLuongId, nhanVienId),
          upsert: (body) => SalaryApi.commissions.upsert(body),
          remove: (id) => SalaryApi.commissions.remove(id, kyLuongId, nhanVienId),
        };
      case "bonus_tiers":
        return {
          list: () => SalaryApi.bonuses.tiers.list(kyLuongId, nhanVienId),
          upsert: (body) => SalaryApi.bonuses.tiers.upsert(body),
          remove: (id) => SalaryApi.bonuses.tiers.remove(id, kyLuongId, nhanVienId),
        };
      case "bonus_others":
        return {
          list: () => SalaryApi.bonuses.others.list(kyLuongId, nhanVienId),
          upsert: (body) => SalaryApi.bonuses.others.upsert(body),
          remove: (id) => SalaryApi.bonuses.others.remove(id, kyLuongId, nhanVienId),
        };
      case "shifts":
        return {
          list: () => SalaryApi.shifts.list(kyLuongId, nhanVienId),
          upsert: (body) => SalaryApi.shifts.upsert(body),
          remove: (id) => SalaryApi.shifts.remove(id, kyLuongId, nhanVienId),
        };
      case "allowances":
        return {
          list: () => SalaryApi.allowances.list(kyLuongId, nhanVienId),
          upsert: (body) => SalaryApi.allowances.upsert(body),
          remove: (id) => SalaryApi.allowances.remove(id, kyLuongId, nhanVienId),
        };
      case "deductions":
        return {
          list: () => SalaryApi.deductions.list(kyLuongId, nhanVienId),
          upsert: (body) => SalaryApi.deductions.upsert(body),
          remove: (id) => SalaryApi.deductions.remove(id, kyLuongId, nhanVienId),
        };
      default:
        return null;
    }
  }, [type, kyLuongId, nhanVienId]);

  async function load() {
    if (!api) return;
    try {
      setErr("");
      setLoading(true);
      setItems((await api.list()) || []);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (kyLuongId && nhanVienId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kyLuongId, nhanVienId, type]);

  async function onAdd() {
    try {
      setSaving(true);
      const base = {
        ky_luong_id: Number(kyLuongId),
        nhan_vien_id: Number(nhanVienId),
        so_tien: Number(String(draft.so_tien).replaceAll(",", "") || 0),
        ghi_chu: draft.ghi_chu || null,
      };
      await api.upsert(buildCreatePayload ? buildCreatePayload(base) : base);
      setDraft({ so_tien: "", ghi_chu: "" });
      await load();
    } finally {
      setSaving(false);
    }
  }
  async function onDelete(id) {
    if (confirm("Xoá mục này?")) {
      await api.remove(id);
      await load();
    }
  }

  return (
    <Section
      title={title}
      right={
        <div className="flex items-end gap-2">
          <label className="text-xs">
            <div>Số tiền</div>
            <input
              className="border rounded px-2 py-1 w-40"
              inputMode="numeric"
              value={draft.so_tien}
              onChange={(e) => setDraft((d) => ({ ...d, so_tien: e.target.value }))}
              placeholder="vd 300000"
            />
          </label>
          <label className="text-xs">
            <div>Ghi chú</div>
            <input
              className="border rounded px-2 py-1 w-60"
              value={draft.ghi_chu}
              onChange={(e) => setDraft((d) => ({ ...d, ghi_chu: e.target.value }))}
              placeholder="tuỳ chọn"
            />
          </label>
          <button
            className="px-3 py-2 rounded text-white disabled:opacity-50"
            style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
            onClick={onAdd}
            disabled={saving}
          >
            {saving ? "Đang lưu…" : "Thêm"}
          </button>
        </div>
      }
    >
      {err && <div className="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2 mb-2">Lỗi: {err}</div>}
      {loading ? (
        "Đang tải…"
      ) : (
        <div className="overflow-auto">
          <table className="min-w-[680px] w-full">
            <thead className="bg-gray-50">
              <tr className="[&>th]:px-3 [&>th]:py-2 text-left text-sm">
                <th>ID</th>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="px-3 py-2">{it.id}</td>
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-2">
                      {c.render ? c.render(it) : String(it[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <button className="px-2 py-1 text-red-600 hover:bg-red-50 rounded" onClick={() => onDelete(it.id)}>
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-500" colSpan={columns.length + 2}>
                    Chưa có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

/* ===================== PAGE ===================== */
export default function EmployeeSalary() {
  const [selectedPeriod, setSelectedPeriod] = useState(null); // {id, nam_thang|namThang}
  const [nhanVienId, setNhanVienId] = useState("");
  const kyLuongId = selectedPeriod?.id ?? null;

  const [row, setRow] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(false);

  const canQuery = useMemo(() => !!kyLuongId && !!nhanVienId, [kyLuongId, nhanVienId]);

  async function loadHeader() {
    if (!canQuery) return;
    setLoading(true);
    try {
      // Tên nhân viên
      try {
        const emp = await EmployeesApi.get(Number(nhanVienId));
        setTeacherName(emp?.ho_ten || emp?.hoTen || `#${nhanVienId}`);
      } catch {
        setTeacherName(`#${nhanVienId}`);
      }

      // Dòng tổng cho NV
      const rows = (await SalaryApi.list(Number(kyLuongId))) || [];
      const getEmpId = (r) => r.nhan_vien_id ?? r.nhanVienId;
      const found = rows.find((r) => String(getEmpId(r)) === String(nhanVienId));
      setRow(found || null);
    } catch (e) {
      alert(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setRow(null);
  }, [selectedPeriod, nhanVienId]);

  const totals = useMemo(() => {
    const r = row || {};
    return {
      luong_cung: r.luong_cung ?? 0,
      tong_hoa_hong: r.tong_hoa_hong ?? 0,
      tong_thuong: r.tong_thuong ?? 0,
      tong_truc: r.tong_truc ?? 0,
      tong_phu_cap_khac: r.tong_phu_cap_khac ?? 0,
      tong_phat: r.tong_phat ?? 0,
      tong_luong: r.tong_luong ?? 0,
    };
  }, [row]);

  // ------------- EXPORT EXCEL (đã fix biến m/yyyyMM) -------------
  async function exportExcel() {
    if (!selectedPeriod || !row) return;

    const yyyyMM = selectedPeriod.nam_thang || selectedPeriod.namThang; // "YYYY-MM"
    const [y, m] = String(yyyyMM).split("-");
    const monthNum = parseInt(m, 10);
    const [{ Workbook }, { saveAs }] = await Promise.all([import("exceljs"), import("file-saver")]);

    const wb = new Workbook();
    const ws = wb.addWorksheet("Bang luong");

    const COLORS = {
      title: "F5CBA7",
      header: "FFEB3B",
      name: "90CAF9",
      month: "BBDEFB",
      luongCung: "A5D6A7",
      hoaHong: "E91E63",
      thuong: "BA68C8",
      truc: "E0E0E0",
      phuCap: "FFF9C4",
      phat: "FFE0B2",
      tong: "B3E5FC",
      section: "CFE1F8",
    };
    const currencyFmt = '#,##0" đ"';

    function setBorder(r) {
      r.eachCell((c) => {
        c.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      });
    }

    const periodLabelShort = (() => {
      const short = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][monthNum - 1];
      return `${short}-${String(y).slice(-2)}`;
    })();

    // Title
    ws.mergeCells("A1:I1");
    const title = ws.getCell("A1");
    title.value = `BẢNG LƯƠNG THÁNG ${monthNum}`;
    title.alignment = { vertical: "middle", horizontal: "center" };
    title.font = { bold: true, size: 16 };
    title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.title } };
    ws.getRow(1).height = 24;

    // Header
    const headerRow = ws.addRow([
      "Nhân viên",
      "Tháng/Năm",
      "Lương cứng",
      "Hoa hồng",
      "Thưởng",
      "Trực",
      "Phụ cấp khác",
      "Phạt/KL",
      "Tổng lương",
    ]);
    headerRow.eachCell((c) => {
      c.font = { bold: true };
      c.alignment = { vertical: "middle", horizontal: "center" };
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.header } };
    });
    setBorder(headerRow);

    // Totals row
    const totalsRow = ws.addRow([
      teacherName || `#${nhanVienId}`,
      periodLabelShort,
      totals.luong_cung,
      totals.tong_hoa_hong,
      totals.tong_thuong,
      totals.tong_truc,
      totals.tong_phu_cap_khac,
      totals.tong_phat,
      totals.tong_luong,
    ]);

    ws.getColumn(1).width = 24;
    ws.getColumn(2).width = 12;
    for (let i = 3; i <= 9; i++) {
      ws.getColumn(i).numFmt = currencyFmt;
      ws.getColumn(i).width = 14;
    }

    const fills = [null, null, COLORS.luongCung, COLORS.hoaHong, COLORS.thuong, COLORS.truc, COLORS.phuCap, COLORS.phat, COLORS.tong];
    totalsRow.eachCell((c, i) => {
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fills[i] || "FFFFFF" } };
      c.font = { bold: i === 9 };
    });
    totalsRow.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.name } };
    totalsRow.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.month } };
    setBorder(totalsRow);

    ws.addRow([]);

    // Load details
    const kyLuongIdNum = Number(kyLuongId);
    const nhanVienIdNum = Number(nhanVienId);
    const [commissions, bonusTiers, bonusOthers, shifts, allowances, deductions] = await Promise.all(
      [
        SalaryApi.commissions.list(kyLuongIdNum, nhanVienIdNum),
        SalaryApi.bonuses.tiers.list(kyLuongIdNum, nhanVienIdNum),
        SalaryApi.bonuses.others.list(kyLuongIdNum, nhanVienIdNum),
        SalaryApi.shifts.list(kyLuongIdNum, nhanVienIdNum),
        SalaryApi.allowances.list(kyLuongIdNum, nhanVienIdNum),
        SalaryApi.deductions.list(kyLuongIdNum, nhanVienIdNum),
      ].map((p) => p.catch(() => []))
    );

    function printSection(titleTxt, color, columns, rows, mapRow) {
      const startRowIdx = ws.lastRow.number + 1;
      ws.mergeCells(`A${startRowIdx}:I${startRowIdx}`);
      const t = ws.getCell(`A${startRowIdx}`);
      t.value = titleTxt;
      t.font = { bold: true };
      t.alignment = { vertical: "middle" };
      t.fill = { type: "pattern", pattern: "solid", fgColor: { argb: color } };
      ws.getRow(startRowIdx).height = 18;

      const head = ws.addRow(columns.map((c) => c.header));
      head.eachCell((c) => {
        c.font = { bold: true };
        c.alignment = { vertical: "middle", horizontal: "center" };
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDE7" } };
      });
      setBorder(head);

      rows.forEach((r) => {
        const arr = mapRow(r);
        const row = ws.addRow(arr);
        columns.forEach((c, i) => {
          if (c.money) row.getCell(i + 1).numFmt = currencyFmt;
          if (c.width) ws.getColumn(i + 1).width = Math.max(ws.getColumn(i + 1).width ?? 10, c.width);
        });
        setBorder(row);
      });

      ws.addRow([]);
    }

    printSection(
      "Hoa hồng chốt lớp",
      COLORS.section,
      [
        { header: "ID", width: 8 },
        { header: "Số tiền", money: true, width: 14 },
        { header: "Ghi chú", width: 60 },
      ],
      commissions || [],
      (it) => [it.id, it.so_tien || 0, it.ghi_chu || ""]
    );

    printSection(
      "Thưởng bậc",
      COLORS.section,
      [
        { header: "ID", width: 8 },
        { header: "Mức thưởng", money: true, width: 14 },
        { header: "Số HV mới", width: 12 },
        { header: "Ghi chú", width: 60 },
      ],
      bonusTiers || [],
      (it) => [it.id, it.muc_thuong || 0, it.so_hv_moi ?? "", it.ghi_chu || ""]
    );

    printSection(
      "Thưởng khác",
      COLORS.section,
      [
        { header: "ID", width: 8 },
        { header: "Số tiền", money: true, width: 14 },
        { header: "Nội dung", width: 60 },
      ],
      bonusOthers || [],
      (it) => [it.id, it.so_tien || 0, it.noi_dung || it.ghi_chu || ""]
    );

    printSection(
      "Trực",
      COLORS.section,
      [
        { header: "ID", width: 8 },
        { header: "Ngày", width: 14 },
        { header: "Ca", width: 12 },
        { header: "Số tiền", money: true, width: 14 },
        { header: "Ghi chú", width: 60 },
      ],
      shifts || [],
      (it) => [it.id, it.ngay || "", it.ca || "", it.so_tien || 0, it.ghi_chu || ""]
    );

    printSection(
      "Phụ cấp khác",
      COLORS.section,
      [
        { header: "ID", width: 8 },
        { header: "Nội dung", width: 50 },
        { header: "Số tiền", money: true, width: 14 },
      ],
      allowances || [],
      (it) => [it.id, it.noi_dung || it.ghi_chu || "", it.so_tien || 0]
    );

    printSection(
      "Phạt / Kỷ luật",
      COLORS.section,
      [
        { header: "ID", width: 8 },
        { header: "Nội dung", width: 50 },
        { header: "Số tiền phạt", money: true, width: 16 },
        { header: "Ngày", width: 14 },
      ],
      deductions || [],
      (it) => [it.id, it.noi_dung || it.ghi_chu || "", it.so_tien_phat || 0, it.ngay_thang || ""]
    );

    const buf = await wb.xlsx.writeBuffer();
    const fileName = `BangLuong_${(teacherName || nhanVienId).toString().replace(/\s+/g, "_")}_${yyyyMM}.xlsx`;
    saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fileName);
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header brand */}
      <div className="rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm" style={{ background: RAS.softBg }}>
        <h2 className="font-semibold" style={{ color: RAS.primary }}>
          Bảng lương nhân viên
        </h2>
        <div className="text-sm opacity-80">RAS Finance · tra cứu & chỉnh sửa</div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm block">Kỳ lương (scroll để chọn)</label>
          <PeriodSelect value={selectedPeriod} onChange={setSelectedPeriod} />
        </div>
        <div>
          <label className="text-sm block">Nhân viên ID</label>
          <input
            value={nhanVienId}
            onChange={(e) => setNhanVienId(e.target.value)}
            placeholder="vd: 3001"
            className="border rounded px-3 py-2 w-40"
          />
        </div>
        <button
          onClick={loadHeader}
          className="px-4 py-2 rounded text-white disabled:opacity-50"
          style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
          disabled={!canQuery || loading}
        >
          Tải dữ liệu
        </button>
        <button
          onClick={exportExcel}
          className="px-4 py-2 rounded border"
          style={{ borderColor: "#ECE9FF", color: RAS.primary }}
          disabled={!row}
          title="Xuất Excel"
        >
          ⤓ Xuất Excel
        </button>
      </div>

      {/* Summary */}
      <div className="rounded-2xl p-4" style={{ background: RAS.softBg }}>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <div className="text-xs uppercase text-slate-500">Nhân viên</div>
            <div className="text-lg font-semibold" style={{ color: RAS.primary }}>
              {teacherName ? teacherName : nhanVienId ? `#${nhanVienId}` : "—"}
            </div>
          </div>
        <div className="h-10 w-px bg-gray-300" />
          <div>
            <div className="text-xs uppercase text-slate-500">Kỳ lương</div>
            <div className="text-lg font-semibold" style={{ color: RAS.primary }}>
              {selectedPeriod ? `Tháng ${fmtYYYYMM_toLabel(selectedPeriod.nam_thang || selectedPeriod.namThang)}` : "—"}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs uppercase text-slate-500">Tổng lương</div>
            <div className="text-2xl font-bold" style={{ color: RAS.accent1 }}>
              {currency(totals.tong_luong)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
          <div className="rounded-lg bg-white border p-3">
            <div className="text-xs text-gray-500">Lương cứng</div>
            <div className="font-semibold">{currency(totals.luong_cung)}</div>
          </div>
          <div className="rounded-lg bg-white border p-3">
            <div className="text-xs text-gray-500">Hoa hồng</div>
            <div className="font-semibold">{currency(totals.tong_hoa_hong)}</div>
          </div>
          <div className="rounded-lg bg-white border p-3">
            <div className="text-xs text-gray-500">Thưởng</div>
            <div className="font-semibold">{currency(totals.tong_thuong)}</div>
          </div>
          <div className="rounded-lg bg-white border p-3">
            <div className="text-xs text-gray-500">Trực</div>
            <div className="font-semibold">{currency(totals.tong_truc)}</div>
          </div>
          <div className="rounded-lg bg-white border p-3">
            <div className="text-xs text-gray-500">Phụ cấp</div>
            <div className="font-semibold">{currency(totals.tong_phu_cap_khac)}</div>
          </div>
          <div className="rounded-lg bg-white border p-3">
            <div className="text-xs text-gray-500">Phạt/KL</div>
            <div className="font-semibold">{currency(totals.tong_phat)}</div>
          </div>
        </div>
      </div>

      {/* Chi tiết */}
      <ListEditor
        title="Hoa hồng chốt lớp"
        type="commissions"
        kyLuongId={kyLuongId}
        nhanVienId={nhanVienId}
        columns={[
          { key: "so_tien", label: "Số tiền", render: (it) => currency(it.so_tien) },
          { key: "ghi_chu", label: "Ghi chú" },
        ]}
      />
      <ListEditor
        title="Thưởng bậc"
        type="bonus_tiers"
        kyLuongId={kyLuongId}
        nhanVienId={nhanVienId}
        columns={[
          { key: "muc_thuong", label: "Mức thưởng", render: (it) => currency(it.muc_thuong) },
          { key: "so_hv_moi", label: "Số HV mới" },
          { key: "ghi_chu", label: "Ghi chú" },
        ]}
        buildCreatePayload={(base) => ({ ...base, muc_thuong: base.so_tien, so_hv_moi: 0 })}
      />
      <ListEditor
        title="Thưởng khác"
        type="bonus_others"
        kyLuongId={kyLuongId}
        nhanVienId={nhanVienId}
        columns={[
          { key: "so_tien", label: "Số tiền", render: (it) => currency(it.so_tien) },
          { key: "noi_dung", label: "Nội dung", render: (it) => it.noi_dung || it.ghi_chu || "" },
        ]}
        buildCreatePayload={(base) => ({ ...base, noi_dung: base.ghi_chu || "Khác" })}
      />
      <ListEditor
        title="Trực"
        type="shifts"
        kyLuongId={kyLuongId}
        nhanVienId={nhanVienId}
        columns={[
          { key: "ngay", label: "Ngày" },
          { key: "ca", label: "Ca" },
          { key: "so_tien", label: "Số tiền", render: (it) => currency(it.so_tien) },
          { key: "ghi_chu", label: "Ghi chú" },
        ]}
        buildCreatePayload={(base) => ({ ...base, ngay: new Date().toISOString().slice(0, 10), ca: "ca_ngay" })}
      />
      <ListEditor
        title="Phụ cấp khác"
        type="allowances"
        kyLuongId={kyLuongId}
        nhanVienId={nhanVienId}
        columns={[
          { key: "noi_dung", label: "Nội dung", render: (it) => it.noi_dung || it.ghi_chu || "" },
          { key: "so_tien", label: "Số tiền", render: (it) => currency(it.so_tien) },
        ]}
        buildCreatePayload={(base) => ({ ...base, noi_dung: base.ghi_chu || "Khác" })}
      />
      <ListEditor
        title="Phạt / Kỷ luật"
        type="deductions"
        kyLuongId={kyLuongId}
        nhanVienId={nhanVienId}
        columns={[
          { key: "noi_dung", label: "Nội dung", render: (it) => it.noi_dung || it.ghi_chu || "" },
          { key: "so_tien_phat", label: "Số tiền phạt", render: (it) => currency(it.so_tien_phat) },
          { key: "ngay_thang", label: "Ngày" },
        ]}
        buildCreatePayload={(base) => ({
          ...base,
          so_tien_phat: base.so_tien,
          ngay_thang: new Date().toISOString().slice(0, 10),
        })}
      />
    </div>
  );
}
