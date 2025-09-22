// src/pages/finance/EmployeeSalary.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { SalaryApi } from "../../lib/salaryApi.js";
import { req } from "../../lib/http.js";

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
const fmtYYYYMM_toLabel = (yyyyMM) => (yyyyMM ? `${yyyyMM.split("-")[1]}/${yyyyMM.split("-")[0]}` : "");
const toNumber = (v) => Number(String(v ?? 0).replaceAll(",", "").replace(/\s/g, "") || 0);

/* ================= Period selector ================= */
function PeriodSelect({ value, onChange, reloadKey }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const boxRef = useRef(null);

  async function fetchPeriods() {
    try {
      setErr("");
      setLoading(true);
      const list = (await req("GET", "/api/payroll/periods")) || [];
      const getYYYYMM = (x) => x.thang_ky || x.nam_thang || x.namThang || "";
      list.sort((a, b) => (getYYYYMM(a) < getYYYYMM(b) ? 1 : -1));
      setItems(list);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchPeriods();
  }, [reloadKey]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const label = value ? fmtYYYYMM_toLabel(value.thang_ky || value.nam_thang || value.namThang) : "Chọn kỳ lương";

  return (
    <div className="relative" ref={boxRef}>
      <button
        type="button"
        onClick={() => {
          const n = !open;
          setOpen(n);
          if (n && !items.length) fetchPeriods();
        }}
        className="px-3 py-2 rounded border min-w-[160px] flex items-center justify-between gap-2"
        style={{ borderColor: "#ECE9FF", color: "#111" }}
        title="Chọn kỳ lương"
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
                  <div className="font-medium">Tháng {fmtYYYYMM_toLabel(it.thang_ky || it.nam_thang || it.namThang)}</div>
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

/* ========= shared: debounce + normalizer + async dropdown ========= */
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
function pickFirst(obj, keys, fallback) {
  for (const k of keys) if (obj && obj[k] != null) return obj[k];
  return fallback;
}
function normalizeItems(raw = []) {
  return raw
    .map((r) => {
      const id = r.id ?? r.nhan_vien_id ?? r.employee_id ?? r.code;
      const label = pickFirst(r, ["ho_ten", "hoTen", "ten", "name", "full_name"], `#${id}`);
      const sub = pickFirst(r, ["email", "so_dien_thoai", "phone", "username"], "");
      return { id, label: String(label), sub: sub ? String(sub) : "" };
    })
    .filter((x) => x.id != null);
}
async function searchViaCandidates(urls = []) {
  for (const url of urls) {
    try {
      const data = await req("GET", url);
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.content)
        ? data.content
        : [];
      const norm = normalizeItems(list);
      if (norm.length) return norm;
    } catch {
      /* try next */
    }
  }
  return [];
}
const fetchEmployees = (q) =>
  searchViaCandidates([
    `/api/employees?size=20&q=${encodeURIComponent(q)}`,
    `/api/nhan-vien?size=20&q=${encodeURIComponent(q)}`,
    `/api/employees/search?q=${encodeURIComponent(q)}`,
    `/api/nhan-vien/search?q=${encodeURIComponent(q)}`,
  ]);

/* ========= Employee async select ========= */
function AsyncSearchSelect({ value, onChange, placeholder = "Tìm...", fetcher, disabled }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const qDeb = useDebounce(q, 350);

  useEffect(() => {
    let on = true;
    (async () => {
      if (!open) return;
      setLoading(true);
      try {
        const list = await fetcher(qDeb || "");
        if (on) setItems(list);
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, [qDeb, open, fetcher]);

  function onKeyDown(e) {
    if (e.key === "Enter") {
      const digits = String(q).trim();
      if (/^\d+$/.test(digits)) {
        onChange?.({ id: Number(digits), label: `#${digits}` });
        setOpen(false);
      }
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        className={`w-64 border rounded-xl px-3 py-2 bg-white flex items-center justify-between ${
          disabled ? "opacity-60" : ""
        }`}
        onClick={() => !disabled && setOpen((s) => !s)}
      >
        <div className="truncate">
          {value ? (
            <>
              <span className="font-medium">{value.label}</span>
              {value.sub && <span className="text-xs text-gray-500 ml-2">{value.sub}</span>}
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-30 left-0 mt-1 w-80 bg-white border rounded-xl shadow-lg">
          <input
            autoFocus
            className="w-full p-2 border-b outline-none rounded-t-xl"
            placeholder="Gõ tên hoặc ID rồi Enter…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <div className="max-h-64 overflow-auto">
            {loading && <div className="p-2 text-sm text-gray-500">Đang tải…</div>}
            {!loading && items.length === 0 && <div className="p-2 text-sm text-gray-500">Không có kết quả</div>}
            {items.map((it) => (
              <button
                key={it.id}
                type="button"
                className={`w-full p-2 text-left hover:bg-slate-50 ${value?.id === it.id ? "bg-indigo-50" : ""}`}
                onClick={() => {
                  onChange?.(it);
                  setOpen(false);
                }}
              >
                <div className="font-medium">{it.label}</div>
                <div className="text-xs text-gray-500">{it.sub ? `${it.sub} · #${it.id}` : `#${it.id}`}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================== Percent cell (commissions) ================== */
function PercentCell({ id, value, onSaved }) {
  const [val, setVal] = useState(value ?? 0);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setVal(value ?? 0);
  }, [value, id]);
  async function save() {
    const pct = Number(val);
    if (!isFinite(pct)) return;
    setBusy(true);
    try {
      await SalaryApi.commissions.updatePercent(id, pct, true);
      onSaved?.();
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min="0"
        max="100"
        step="0.1"
        className="border rounded px-2 py-1 w-24"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={save}
        disabled={busy}
      />
      <span className="text-xs opacity-60">%</span>
    </div>
  );
}

/* ================== List editor (Hoa hồng chốt lớp) ================== */
function ListEditor({ title, kyLuongId, nhanVienId, onChanged }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⬇️ chỉnh: thêm nhập học phí & tỷ lệ %
  const [draft, setDraft] = useState({ hoc_phi_ap_dung: "", ty_le_pct: "2", ghi_chu: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const hpNum = toNumber(draft.hoc_phi_ap_dung);
  const pctNum = Number(draft.ty_le_pct || 0);
  const hhPreview = Math.round(hpNum * (isFinite(pctNum) ? pctNum : 0) / 100);

  async function load() {
    if (!kyLuongId || !nhanVienId) return;
    try {
      setErr("");
      setLoading(true);
      setItems((await SalaryApi.commissions.list(kyLuongId, nhanVienId)) || []);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [kyLuongId, nhanVienId]);

  async function onAdd() {
    try {
      setSaving(true);
      const body = {
        ky_luong_id: Number(kyLuongId),
        nhan_vien_id: Number(nhanVienId),
        hoc_phi_ap_dung: hpNum,
        ty_le_pct: isFinite(pctNum) ? pctNum : 0,
        so_tien: hhPreview, // tự tính trước khi gửi
        ghi_chu: draft.ghi_chu || null,
      };
      await SalaryApi.commissions.upsert(body);
      setDraft({ hoc_phi_ap_dung: "", ty_le_pct: draft.ty_le_pct, ghi_chu: "" });
      await load();
      onChanged?.();
    } finally {
      setSaving(false);
    }
  }
  async function onDelete(id) {
    if (confirm("Xoá mục này?")) {
      await SalaryApi.commissions.remove(id);
      await load();
      onChanged?.();
    }
  }

  return (
    <Section
      title={title}
      right={
        <div className="flex items-end gap-2">
          <label className="text-xs">
            <div>Học phí áp dụng</div>
            <input
              className="border rounded px-2 py-1 w-40"
              inputMode="numeric"
              value={draft.hoc_phi_ap_dung}
              onChange={(e) => setDraft((d) => ({ ...d, hoc_phi_ap_dung: e.target.value }))}
              placeholder="vd 6000000"
            />
          </label>
          <label className="text-xs">
            <div>Tỷ lệ %</div>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="border rounded px-2 py-1 w-24"
              value={draft.ty_le_pct}
              onChange={(e) => setDraft((d) => ({ ...d, ty_le_pct: e.target.value }))}
              placeholder="vd 2"
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
          <div className="text-xs text-gray-600 mb-1">
            HH dự kiến: <b>{currency(hhPreview)}</b>
          </div>
          <button
            className="px-3 py-2 rounded text-white disabled:opacity-50"
            style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
            onClick={onAdd}
            disabled={saving || !kyLuongId || !nhanVienId || hpNum <= 0}
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
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-50">
              <tr className="[&>th]:px-3 [&>th]:py-2 text-left text-sm">
                <th>ID</th>
                <th>Học phí áp dụng</th>
                <th>Tỷ lệ %</th>
                <th>Tiền hoa hồng</th>
                <th>Ghi chú</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="px-3 py-2">{it.id}</td>
                  <td className="px-3 py-2">{currency(it.hoc_phi_ap_dung)}</td>
                  <td className="px-3 py-2">
                    <PercentCell id={it.id} value={it.ty_le_pct} onSaved={() => { load(); onChanged?.(); }} />
                  </td>
                  <td className="px-3 py-2">{currency(it.so_tien)}</td>
                  <td className="px-3 py-2">{it.ghi_chu || ""}</td>
                  <td className="px-3 py-2 text-right">
                    <button className="px-2 py-1 text-red-600 hover:bg-red-50 rounded" onClick={() => onDelete(it.id)}>
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-500" colSpan={6}>
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
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [reloadPeriodsKey, setReloadPeriodsKey] = useState(0);

  const [employeeOpt, setEmployeeOpt] = useState(null);
  const [manualEmp, setManualEmp] = useState(false);
  const [empIdText, setEmpIdText] = useState("");

  const nhanVienId = useMemo(
    () => (manualEmp ? (empIdText ? Number(empIdText) : null) : employeeOpt?.id ?? null),
    [manualEmp, empIdText, employeeOpt]
  );
  const kyLuongIdNum = useMemo(
    () => (selectedPeriod?.id != null ? Number(selectedPeriod.id) : null),
    [selectedPeriod]
  );
  const nhanVienIdNum = useMemo(() => (nhanVienId != null ? Number(nhanVienId) : null), [nhanVienId]);
  const isValidId = (n) => Number.isFinite(n) && n > 0;

  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);

  const [editTotals, setEditTotals] = useState({
    luong_cung: "",
    tong_hoa_hong: "",
    tong_thuong: "",
    tong_truc: "",
    tong_phu_cap_khac: "",
    tong_phat: "",
  });
  const onEditChange = (key) => (e) => setEditTotals((s) => ({ ...s, [key]: e.target.value }));

  const canQuery = useMemo(() => isValidId(kyLuongIdNum) && isValidId(nhanVienIdNum), [kyLuongIdNum, nhanVienIdNum]);

  async function loadHeader() {
    if (!isValidId(kyLuongIdNum) || !isValidId(nhanVienIdNum)) return;
    setLoading(true);
    try {
      const rows = (await SalaryApi.list(kyLuongIdNum)) || [];
      const found =
        rows.find((r) => String(r.nhan_vien_id ?? r.nhanVienId) === String(nhanVienIdNum)) || null;

      setRow(found || { ky_luong_id: kyLuongIdNum, nhan_vien_id: nhanVienIdNum });
      setEditTotals({
        luong_cung: String(found?.luong_cung ?? 0),
        tong_hoa_hong: String(found?.tong_hoa_hong ?? 0),
        tong_thuong: String(found?.tong_thuong ?? 0),
        tong_truc: String(found?.tong_truc ?? 0),
        tong_phu_cap_khac: String(found?.tong_phu_cap_khac ?? 0),
        tong_phat: String(found?.tong_phat ?? 0),
      });
    } catch (e) {
      alert(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setRow(null);
  }, [selectedPeriod?.id, nhanVienIdNum]);

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

  function nextYYYYMM(base) {
    if (base && /^\d{4}-(0[1-9]|1[0-2])$/.test(base)) {
      const d = new Date(+base.slice(0, 4), +base.slice(5, 7) - 1, 1);
      d.setMonth(d.getMonth() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  async function createNewPeriod() {
    const suggest = nextYYYYMM(
      (selectedPeriod && (selectedPeriod.thang_ky || selectedPeriod.nam_thang || selectedPeriod.namThang)) || ""
    );
    const input = prompt("Nhập kỳ lương mới (YYYY-MM):", suggest);
    if (!input) return;
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(input)) {
      alert("Sai định dạng YYYY-MM");
      return;
    }
    const created = await SalaryApi.periods.create(input);
    setSelectedPeriod({ id: created?.id ?? created, thang_ky: input });
    setReloadPeriodsKey((k) => k + 1);
    alert("Đã tạo kỳ lương mới.");
  }

  async function saveTotals() {
    if (!isValidId(kyLuongIdNum)) return alert("Chưa chọn kỳ lương hợp lệ.");
    if (!isValidId(nhanVienIdNum)) return alert("Chưa chọn nhân viên hợp lệ.");

    try {
      await SalaryApi.salaries.update({
        ky_luong_id: kyLuongIdNum,
        nhan_vien_id: nhanVienIdNum,
        luong_cung: toNumber(editTotals.luong_cung),
        tong_hoa_hong: toNumber(editTotals.tong_hoa_hong),
        tong_thuong: toNumber(editTotals.tong_thuong),
        tong_truc: toNumber(editTotals.tong_truc),
        tong_phu_cap_khac: toNumber(editTotals.tong_phu_cap_khac),
        tong_phat: toNumber(editTotals.tong_phat),
      });
      alert("Đã lưu các khoản tổng.");
      await loadHeader();
    } catch (e) {
      alert(e?.message || String(e));
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div className="rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm" style={{ background: RAS.softBg }}>
        <h2 className="font-semibold" style={{ color: RAS.primary }}>
          Bảng lương nhân viên
        </h2>
        <div className="text-sm opacity-80">RAS Finance · tra cứu & chỉnh sửa</div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm block">Kỳ lương</label>
          <div className="flex items-center gap-2">
            <PeriodSelect value={selectedPeriod} onChange={setSelectedPeriod} reloadKey={reloadPeriodsKey} />
            <button
              onClick={createNewPeriod}
              className="px-3 py-2 rounded text-white"
              style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
            >
              ➕ Tạo kỳ lương
            </button>
          </div>
        </div>

        {/* Nhân viên */}
        <div className="flex flex-col gap-1">
          <label className="text-sm block">Nhập tên</label>
          <div className="flex items-center gap-2">
            {!manualEmp ? (
              <AsyncSearchSelect
                value={employeeOpt}
                onChange={setEmployeeOpt}
                placeholder="Tìm nhân viên…"
                fetcher={fetchEmployees}
              />
            ) : (
              <input
                className="w-64 border rounded-xl px-3 py-2"
                inputMode="numeric"
                placeholder="Nhập ID nhân viên, ví dụ 3004"
                value={empIdText}
                onChange={(e) => setEmpIdText(e.target.value)}
              />
            )}
            <button
              type="button"
              className="px-3 py-2 rounded border"
              onClick={() => setManualEmp((s) => !s)}
              title="Bật/tắt nhập ID thủ công"
              style={{ borderColor: "#ECE9FF", color: RAS.primary }}
            >
              {manualEmp ? "Dùng ô tìm kiếm" : "Nhập ID thủ công"}
            </button>
          </div>
        </div>

        <button
          onClick={loadHeader}
          className="px-4 py-2 rounded text-white disabled:opacity-50"
          style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
          disabled={!canQuery || loading}
        >
          Tải dữ liệu
        </button>
      </div>

      {/* Summary */}
      <div className="rounded-2xl p-4" style={{ background: RAS.softBg }}>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <div className="text-xs uppercase text-slate-500">Nhân viên</div>
            <div className="text-lg font-semibold" style={{ color: RAS.primary }}>
              {employeeOpt?.label || (nhanVienIdNum ? `#${nhanVienIdNum}` : "—")}
            </div>
          </div>
          <div className="h-10 w-px bg-gray-300" />
          <div>
            <div className="text-xs uppercase text-slate-500">Kỳ lương</div>
            <div className="text-lg font-semibold" style={{ color: RAS.primary }}>
              {selectedPeriod ? `Tháng ${fmtYYYYMM_toLabel(selectedPeriod.thang_ky || selectedPeriod.nam_thang || selectedPeriod.namThang)}` : "—"}
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

      {/* Chỉnh các khoản tổng */}
      <Section
        title="Chỉnh các khoản tổng"
        right={
          <button
            onClick={saveTotals}
            className="px-3 py-2 rounded text-white"
            style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
          >
            Lưu các khoản
          </button>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <label className="text-sm">
            <div className="mb-1">Lương cứng</div>
            <input
              className="border rounded w-full px-3 py-2"
              inputMode="numeric"
              value={editTotals.luong_cung}
              onChange={onEditChange("luong_cung")}
              placeholder="0"
            />
          </label>
          <label className="text-sm">
            <div className="mb-1">Thưởng</div>
            <input
              className="border rounded w-full px-3 py-2"
              inputMode="numeric"
              value={editTotals.tong_thuong}
              onChange={onEditChange("tong_thuong")}
              placeholder="0"
            />
          </label>
          <label className="text-sm">
            <div className="mb-1">Trực</div>
            <input
              className="border rounded w-full px-3 py-2"
              inputMode="numeric"
              value={editTotals.tong_truc}
              onChange={onEditChange("tong_truc")}
              placeholder="0"
            />
          </label>
          <label className="text-sm">
            <div className="mb-1">Phụ cấp khác</div>
            <input
              className="border rounded w-full px-3 py-2"
              inputMode="numeric"
              value={editTotals.tong_phu_cap_khac}
              onChange={onEditChange("tong_phu_cap_khac")}
              placeholder="0"
            />
          </label>
          <label className="text-sm">
            <div className="mb-1">Phạt/Kỷ luật</div>
            <input
              className="border rounded w-full px-3 py-2"
              inputMode="numeric"
              value={editTotals.tong_phat}
              onChange={onEditChange("tong_phat")}
              placeholder="0"
            />
          </label>
        </div>
      </Section>
      
    </div>
  );
}
