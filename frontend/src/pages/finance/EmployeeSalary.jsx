// src/pages/finance/EmployeeSalary.jsx
import { useEffect, useMemo, useState } from "react";
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
    <div className="px-4 py-3 flex items-center justify-between"
         style={{ background: RAS.softBg, borderBottom: "1px solid #ECE9FF" }}>
      <h3 className="font-semibold" style={{ color: RAS.primary }}>{title}</h3>
      <div className="flex items-center gap-2">{right}</div>
    </div>
    <div className="p-3 bg-white">{children}</div>
  </div>
);

/* ------- helpers ------- */
function parsePeriodCode(code) {
  // "92025" -> { month: 9, year: 2025 }
  const s = String(code || "").trim();
  if (!/^\d{4,6}$/.test(s)) return null;
  const month = Number(s.slice(0, s.length - 4));
  const year = Number(s.slice(-4));
  if (month < 1 || month > 12) return null;
  return { month, year };
}
const fmtPeriod = ({ month, year }) => `Tháng ${month}/${year}`;

/* Thử resolve ky_luong_id từ backend nếu có (GET /api/payroll/resolve?month=&year=)
   nếu không có endpoint này thì fallback: dùng thẳng code như ky_luong_id (tương thích backend hiện tại) */
async function resolveKyLuongIdByPeriod(periodCode) {
  const p = parsePeriodCode(periodCode);
  if (!p) throw new Error("Mã ThángNăm không hợp lệ (vd: 92025 = tháng 9 năm 2025)");
  try {
    const r = await req("GET", `/api/payroll/resolve${qs({ month: p.month, year: p.year })}`);
    if (r?.id != null) return { kyLuongId: r.id, period: p };
  } catch (_) {
    /* ignore: fallback */
  }
  // fallback
  return { kyLuongId: Number(periodCode), period: p };
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
      default: return null;
    }
  }, [type, kyLuongId, nhanVienId]);

  async function load() {
    if (!api) return;
    try { setErr(""); setLoading(true); setItems(await api.list() || []); }
    catch (e) { setErr(e?.message || String(e)); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (kyLuongId && nhanVienId) load(); /* eslint-disable-next-line */ }, [kyLuongId, nhanVienId, type]);

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
    } finally { setSaving(false); }
  }
  async function onDelete(id) { if (confirm("Xoá mục này?")) { await api.remove(id); await load(); } }

  return (
    <Section
      title={title}
      right={
        <div className="flex items-end gap-2">
          <label className="text-xs">
            <div>Số tiền</div>
            <input className="border rounded px-2 py-1 w-40" inputMode="numeric"
                   value={draft.so_tien} onChange={e=>setDraft(d=>({...d,so_tien:e.target.value}))}
                   placeholder="vd 300000" />
          </label>
          <label className="text-xs">
            <div>Ghi chú</div>
            <input className="border rounded px-2 py-1 w-60"
                   value={draft.ghi_chu} onChange={e=>setDraft(d=>({...d,ghi_chu:e.target.value}))}
                   placeholder="tuỳ chọn" />
          </label>
          <button className="px-3 py-2 rounded text-white disabled:opacity-50"
                  style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
                  onClick={onAdd} disabled={saving}>
            {saving ? "Đang lưu…" : "Thêm"}
          </button>
        </div>
      }
    >
      {err && <div className="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2 mb-2">Lỗi: {err}</div>}
      {loading ? "Đang tải…" : (
        <div className="overflow-auto">
          <table className="min-w-[680px] w-full">
            <thead className="bg-gray-50">
              <tr className="[&>th]:px-3 [&>th]:py-2 text-left text-sm">
                <th>ID</th>
                {columns.map(c => <th key={c.key}>{c.label}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map(it => (
                <tr key={it.id} className="border-t">
                  <td className="px-3 py-2">{it.id}</td>
                  {columns.map(c => (
                    <td key={c.key} className="px-3 py-2">
                      {c.render ? c.render(it) : String(it[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <button className="px-2 py-1 text-red-600 hover:bg-red-50 rounded" onClick={()=>onDelete(it.id)}>Xoá</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={columns.length+2}>Chưa có dữ liệu.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}

/* ===================== PAGE ===================== */
export default function EmployeeSalary() {
  const [periodCode, setPeriodCode] = useState("");       // MYYYY (vd 92025)
  const [nhanVienId, setNhanVienId] = useState("");
  const [kyLuongId, setKyLuongId] = useState(null);
  const [period, setPeriod] = useState(null);             // {month, year}
  const [row, setRow] = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(false);

  const canQuery = useMemo(() => periodCode && nhanVienId, [periodCode, nhanVienId]);
  async function loadHeader() {
    if (!canQuery) return;
    setLoading(true);
    try {
      const { kyLuongId, period } = await resolveKyLuongIdByPeriod(periodCode);
      setKyLuongId(kyLuongId);
      setPeriod(period);

      // lấy tên nhân viên
      try {
        const emp = await EmployeesApi.get(Number(nhanVienId));
        setTeacherName(emp?.ho_ten || emp?.hoTen || `#${nhanVienId}`);
      } catch { setTeacherName(`#${nhanVienId}`); }

      // lấy 1 dòng tổng lương của NV
      const rows = (await SalaryApi.list(Number(kyLuongId))) || [];
      const found = rows.find((r) => String(r.nhan_vien_id) === String(nhanVienId));
      setRow(found || null);
    } catch (e) {
      alert(e.message || String(e));
    } finally { setLoading(false); }
  }

  useEffect(() => { setRow(null); }, [periodCode, nhanVienId]);

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

  function exportExcel() {
    // Xuất CSV (Excel mở được) cho nhanh gọn – không dùng lib ngoài
    const p = period || parsePeriodCode(periodCode);
    const header = ["Nhân viên","Tháng/Năm","Lương cứng","Hoa hồng","Thưởng","Trực","Phụ cấp khác","Phạt/KL","Tổng lương"];
    const data = [[
      teacherName || `#${nhanVienId}`,
      p ? `${p.month}/${p.year}` : periodCode,
      totals.luong_cung, totals.tong_hoa_hong, totals.tong_thuong,
      totals.tong_truc, totals.tong_phu_cap_khac, totals.tong_phat,
      totals.tong_luong,
    ]];
    const rows = [header, ...data]
      .map(cols => cols.map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF" + rows], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const fileName = `salary_${(teacherName||nhanVienId).toString().replace(/\s+/g,'_')}_${p?.year||''}_${p?.month||''}.csv`;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const periodOk = parsePeriodCode(periodCode);

  return (
    <div className="p-6 space-y-5">
      {/* Header brand */}
      <div className="rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm"
           style={{ background: RAS.softBg }}>
        <h2 className="font-semibold" style={{ color: RAS.primary }}>Bảng lương giáo viên</h2>
        <div className="text-sm opacity-80">RAS Finance · tra cứu & chỉnh sửa</div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-sm block">ThángNăm (MYYYY)</label>
          <input
            value={periodCode}
            onChange={(e) => setPeriodCode(e.target.value)}
            placeholder="vd: 92025 = 9/2025"
            className="border rounded px-3 py-2 w-48"
          />
          {!periodOk && periodCode && (
            <div className="text-xs text-red-600 mt-1">Định dạng không hợp lệ (MYYYY, ví dụ 92025)</div>
          )}
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
          disabled={!canQuery || !periodOk || loading}
        >
          Tải dữ liệu
        </button>
        <button
          onClick={exportExcel}
          className="px-4 py-2 rounded border"
          style={{ borderColor: "#ECE9FF", color: RAS.primary }}
          disabled={!row}
          title="Xuất Excel (CSV)"
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
              {teacherName ? teacherName : (nhanVienId ? `#${nhanVienId}` : "—")}
            </div>
          </div>
          <div className="h-10 w-px bg-gray-300" />
          <div>
            <div className="text-xs uppercase text-slate-500">Kỳ lương</div>
            <div className="text-lg font-semibold" style={{ color: RAS.primary }}>
              {period ? fmtPeriod(period) : (periodCode ? `#${periodCode}` : "—")}
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs uppercase text-slate-500">Tổng lương</div>
            <div className="text-2xl font-bold" style={{ color: RAS.accent1 }}>{currency(totals.tong_luong)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
          <div className="rounded-lg bg-white border p-3"><div className="text-xs text-gray-500">Lương cứng</div><div className="font-semibold">{currency(totals.luong_cung)}</div></div>
          <div className="rounded-lg bg-white border p-3"><div className="text-xs text-gray-500">Hoa hồng</div><div className="font-semibold">{currency(totals.tong_hoa_hong)}</div></div>
          <div className="rounded-lg bg-white border p-3"><div className="text-xs text-gray-500">Thưởng</div><div className="font-semibold">{currency(totals.tong_thuong)}</div></div>
          <div className="rounded-lg bg-white border p-3"><div className="text-xs text-gray-500">Trực</div><div className="font-semibold">{currency(totals.tong_truc)}</div></div>
          <div className="rounded-lg bg-white border p-3"><div className="text-xs text-gray-500">Phụ cấp</div><div className="font-semibold">{currency(totals.tong_phu_cap_khac)}</div></div>
          <div className="rounded-lg bg-white border p-3"><div className="text-xs text-gray-500">Phạt/KL</div><div className="font-semibold">{currency(totals.tong_phat)}</div></div>
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
        buildCreatePayload={(base) => ({ ...base, so_tien_phat: base.so_tien, ngay_thang: new Date().toISOString().slice(0, 10) })}
      />
    </div>
  );
}
