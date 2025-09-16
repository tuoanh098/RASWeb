// src/pages/management/DutySchedule.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/* ================= Date helpers ================= */
function startOfWeek(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (x.getDay() + 6) % 7; // Mon=0..Sun=6
  x.setDate(x.getDate() - dow);
  x.setHours(0, 0, 0, 0);
  return x;
}
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const toISODate = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const fmtVNDay = (d) => d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });

/* ================= HTTP ================= */
async function httpGet(url) { const r = await fetch(url); if (!r.ok) throw new Error(await r.text()); return r.json(); }
async function httpPost(url, body) { const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (!r.ok) throw new Error(await r.text()); return r.json(); }
async function httpPut(url, body) { const r = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (!r.ok) throw new Error(await r.text()); return r.json(); }
async function httpDelete(url) { const r = await fetch(url, { method: "DELETE" }); if (!r.ok && r.status !== 204) throw new Error(await r.text()); return true; }

/* ================= API ================= */
const Api = {
  list: async ({ from, to, staffId, branchId, q, page = 0, size = 500 }) => {
    const p = new URLSearchParams({ from, to, page, size });
    if (staffId)  p.set("nhan_vien_id", staffId);
    if (branchId) p.set("chi_nhanh_id", branchId);
    if (q)        p.set("q", q);
    const data = await httpGet(`/api/lich-truc?` + p.toString());
    // Chuẩn hoá: items/page…
    if (Array.isArray(data)) return data;
    if (data?.items) return data.items;
    if (data?.content) return data.content;
    return [];
  },
  create: (payload) => httpPost(`/api/lich-truc`, payload),
  update: (id, payload) => httpPut(`/api/lich-truc/${id}`, payload),
  remove: (id) => httpDelete(`/api/lich-truc/${id}`),
};

/* ================= Async Search utils ================= */
function useDebounce(v, ms = 350) { const [s, setS] = useState(v); useEffect(() => { const t = setTimeout(() => setS(v), ms); return () => clearTimeout(t); }, [v, ms]); return s; }
function pickFirst(o, keys, fb) { for (const k of keys) if (o && o[k] != null) return o[k]; return fb; }
function normalizeItems(raw = []) {
  return raw.map(r => {
    const id = r.id ?? r.nhan_vien_id ?? r.chi_nhanh_id ?? r.code;
    const label = pickFirst(r, ["ho_ten", "ten", "ten_hien_thi", "name", "title", "ten_chi_nhanh"], `#${id}`);
    const sub = pickFirst(r, ["email", "so_dien_thoai", "ma", "username"], "");
    return { id, label: String(label), sub: sub ? String(sub) : "" };
  }).filter(x => x.id != null);
}
async function searchVia(urls = []) {
  for (const u of urls) {
    try {
      const d = await httpGet(u);
      const list = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.content) ? d.content : [];
      const n = normalizeItems(list);
      if (n.length) return n;
    } catch { /* try next */ }
  }
  return [];
}
const fetchEmployees = (q) => searchVia([
  `/api/nhan-vien?size=10&q=${encodeURIComponent(q)}`,
  `/api/employees?size=10&q=${encodeURIComponent(q)}`
]);
const fetchBranches = (q) => searchVia([
  `/api/chi-nhanh?size=10&q=${encodeURIComponent(q)}`,
  `/api/branches?size=10&q=${encodeURIComponent(q)}`
]);

/* ================= AsyncSearchSelect ================= */
function AsyncSearchSelect({ value, onChange, placeholder = "Tìm...", fetcher, disabled }) {
  const [q, setQ] = useState("");
  const qDeb = useDebounce(q, 350);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { let on = true; (async () => {
    if (!open) return;
    setLoading(true);
    try { const list = await fetcher(qDeb || ""); if (on) setItems(list); }
    finally { if (on) setLoading(false); }
  })(); return () => { on = false; }; }, [qDeb, open, fetcher]);

  return (
    <div className="relative">
      <button type="button" disabled={disabled}
        onClick={() => !disabled && setOpen(s => !s)}
        className={`w-full border rounded-xl px-3 py-2 bg-white text-left ${disabled ? "opacity-60" : ""}`}>
        {value ? (<><span className="font-medium">{value.label}</span>{value.sub && <span className="text-xs text-gray-500 ml-2">{value.sub}</span>}</>) : <span className="text-gray-400">{placeholder}</span>}
        <span className="float-right text-gray-400">▾</span>
      </button>
      {open && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg">
          <input autoFocus className="w-full p-2 border-b outline-none rounded-t-xl" placeholder="Gõ để tìm..." value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="max-h-64 overflow-auto">
            {loading && <div className="p-2 text-sm text-gray-500">Đang tải…</div>}
            {!loading && items.length === 0 && <div className="p-2 text-sm text-gray-500">Không có kết quả</div>}
            {items.map(it => (
              <button key={it.id} type="button" onClick={() => { onChange?.(it); setOpen(false); }}
                className={`w-full p-2 text-left hover:bg-slate-50 ${value?.id === it.id ? "bg-indigo-50" : ""}`}>
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

/* ================= Create Duty Panel ================= */
function CreateDutyPanel({ open, onClose, initialDate, onSaved }) {
  const [date, setDate] = useState(toISODate(initialDate || new Date()));
  const [employee, setEmployee] = useState(null);
  const [branch, setBranch] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => { if (open) {
    setDate(toISODate(initialDate || new Date()));
    setEmployee(null);
    setBranch(null);
    setNote("");
  }}, [open, initialDate]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/20 z-30 flex items-start justify-center p-4 md:p-10" onClick={onClose}>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="text-lg font-semibold">Tạo lịch trực</div>
          <button className="text-gray-500 hover:text-black" onClick={onClose}>✕</button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ngày trực</label>
            <input type="date" className="w-full border rounded-xl px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nhân viên</label>
            <AsyncSearchSelect value={employee} onChange={setEmployee} fetcher={fetchEmployees} placeholder="Tìm nhân viên…" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Chi nhánh</label>
            <AsyncSearchSelect value={branch} onChange={setBranch} fetcher={fetchBranches} placeholder="Chọn chi nhánh…" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú</label>
            <input className="w-full border rounded-xl px-3 py-2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="VD: Ca sáng / thay ca ..." />
          </div>
        </div>

        <div className="p-4 border-t flex items-center justify-end gap-2">
          <button className="px-4 py-2 rounded-xl border" onClick={onClose}>Huỷ</button>
          <button
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={!employee?.id || !branch?.id || !date}
            onClick={async () => {
              try {
                const payload = {
                  nhan_vien_id: Number(employee.id),
                  nhan_vien_ten: employee.label,
                  chi_nhanh_id: Number(branch.id),
                  chi_nhanh_ten: branch.label,
                  ngay: date,
                  ghi_chu: note || "",
                };
                await Api.create(payload);
                onSaved?.();
                onClose();
              } catch (e) {
                alert("Lỗi tạo lịch trực: " + (e.message || ""));
              }
            }}
          >Lưu</button>
        </div>
      </div>
    </div>
  );
}

/* ================= Day Column (all-day lane) ================= */
function DayColumn({ day, events, onClickDay, onDelete }) {
  const key = toISODate(day);
  return (
    <div className="border-l last:border-r min-h-[120px]">
      {/* khu vực click tạo lịch */}
      <div className="h-10 border-b bg-slate-50/60 flex items-center justify-center text-xs text-gray-400">
        <button className="px-2 py-1 rounded hover:bg-white border" onClick={() => onClickDay?.(day)}>+ Thêm trực</button>
      </div>
      <div className="p-2 space-y-2">
        {(events || []).filter(x => x.ngay === key).map(ev => (
          <div key={ev.id} className="flex items-center gap-2">
            <div className="flex-1 rounded-md bg-indigo-600/90 text-white text-[12px] px-2 py-1 shadow">
              <div className="font-semibold truncate">{ev.nhan_vien_ten}</div>
              <div className="opacity-90 truncate">{ev.chi_nhanh_ten}{ev.chi_nhanh_id ? ` (#${ev.chi_nhanh_id})` : ""}</div>
              {ev.ghi_chu && <div className="opacity-90 truncate italic">“{ev.ghi_chu}”</div>}
            </div>
            <button title="Xoá" className="text-rose-600 hover:text-rose-800 text-lg leading-none" onClick={() => onDelete?.(ev.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= Page ================= */
export default function DutySchedule() {
  const [week0, setWeek0] = useState(startOfWeek());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // filters
  const [staffF, setStaffF] = useState(null);
  const [branchF, setBranchF] = useState(null);
  const [q, setQ] = useState("");
  const qDeb = useDebounce(q, 300);

  // create panel
  const [createOpen, setCreateOpen] = useState(false);
  const createDateRef = useRef(new Date());

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(week0, i)), [week0]);
  const fromISO = toISODate(days[0]);
  const toISO = toISODate(days[6]);

  async function load() {
    setErr(""); setLoading(true);
    try {
      const list = await Api.list({
        from: fromISO, to: toISO,
        staffId: staffF?.id, branchId: branchF?.id, q: qDeb || undefined,
      });
      // Chuẩn hoá field ngày (API dùng 'ngay' hoặc 'ngay_truc')
      const normalized = list.map(x => ({
        ...x,
        ngay: x.ngay || x.ngay_truc || x.date || x.day || "",
      }));
      setItems(normalized);
    } catch (e) {
      setErr(e.message || "Lỗi tải lịch trực");
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [week0, staffF?.id, branchF?.id, qDeb]);

  const grouped = useMemo(() => {
    const m = new Map();
    for (const x of items) {
      const k = x.ngay;
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(x);
    }
    for (const k of m.keys()) m.get(k).sort((a, b) => (a.nhan_vien_ten || "").localeCompare(b.nhan_vien_ten || "", "vi"));
    return m;
  }, [items]);

  const onClickDay = (day) => { createDateRef.current = day; setCreateOpen(true); };
  const onDelete = async (id) => {
    if (!id) return;
    if (!confirm(`Xoá lịch trực #${id}?`)) return;
    try { await Api.remove(id); await load(); } catch (e) { alert("Xoá thất bại: " + (e.message || "")); }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-ras-blue">Lịch trực (tuần)</h1>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-xl border" onClick={() => setWeek0(addDays(week0, -7))}>← Tuần trước</button>
          <div className="px-3 py-2 font-semibold text-ras-blue hidden md:block">
            {fmtVNDay(days[0])} — {fmtVNDay(days[6])}
          </div>
          <button className="px-3 py-2 rounded-xl border" onClick={() => setWeek0(addDays(week0, +7))}>Tuần sau →</button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white/80 border rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Nhân viên</label>
            <AsyncSearchSelect value={staffF} onChange={setStaffF} fetcher={fetchEmployees} placeholder="Tìm nhân viên…" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Chi nhánh</label>
            <AsyncSearchSelect value={branchF} onChange={setBranchF} fetcher={fetchBranches} placeholder="Chọn chi nhánh…" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-600 mb-1">Tìm nhanh</label>
            <input className="w-full border rounded-xl px-3 py-2" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tên NV / chi nhánh…" />
          </div>
        </div>
        {(err || loading) && <div className="text-sm mt-2">{err ? <span className="text-rose-600">API lỗi: {err}</span> : <span className="text-slate-500">Đang tải…</span>}</div>}
      </div>

      {/* Week grid (all-day lane) */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-8">
          <div className="bg-slate-50 border-r p-2 text-xs text-gray-600">ALL-DAY</div>
          {days.map((d, i) => (
            <div key={i} className="border-r p-2 text-sm font-medium text-ras-blue">{fmtVNDay(d)} ({toISODate(d)})</div>
          ))}
        </div>
        <div className="grid grid-cols-8">
          <div className="bg-slate-50 border-r p-2 text-xs text-gray-600">
            <div className="text-[11px] text-gray-500"></div>
          </div>
          {days.map((d, i) => {
            const key = toISODate(d);
            const events = grouped.get(key) || [];
            return (
              <DayColumn
                key={i}
                day={d}
                events={events}
                onClickDay={onClickDay}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      </div>

      {/* Create panel */}
      <CreateDutyPanel
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initialDate={createDateRef.current}
        onSaved={load}
      />
    </div>
  );
}
