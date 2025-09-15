import React, { useEffect, useMemo, useState } from "react";
import StudentsApi from "../../lib/studentsApi.js";

/* ---------------- Small UI ---------------- */
function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium mb-1 text-[var(--ras-ink)]">{label}</div>
      {children}
    </label>
  );
}

function Modal({ open, onClose, title, children, footer, compact = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`w-full max-w-4xl bg-white rounded-xl border shadow-lg ${compact ? "compact-modal" : ""}`}>
          <div className={`${compact ? "modal-header" : "px-4 py-3 border-b"} flex items-center justify-between`}>
            <h3 className="font-semibold text-[var(--ras-ink)]">{title}</h3>
            <button className="text-slate-500 hover:text-slate-800" onClick={onClose}>✕</button>
          </div>
          <div className={compact ? "p-3" : "p-4"}>{children}</div>
          {footer && (
            <div className={`${compact ? "modal-footer" : "px-4 py-3 border-t bg-[var(--ras-soft-bg)]"}`}>{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title = "Xác nhận", message, onCancel, onOK, okText = "Đồng ý" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="px-5 py-3 text-white font-semibold"
               style={{ background: `linear-gradient(90deg, var(--ras-primary), var(--ras-accent1))` }}>
            {title}
          </div>
          <div className="p-5 text-slate-700">{message}</div>
          <div className="px-5 py-3 bg-slate-50 border-t flex justify-end gap-2">
            <button className="btn btn-ras-soft" onClick={onCancel}>Huỷ</button>
            <button className="btn btn-primary" onClick={onOK}>{okText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoticeDialog({ open, type = "success", title, message, onClose }) {
  if (!open) return null;
  const tone = type === "success"
    ? "bg-[#f3e9ff] border-[#7c4dff] text-[var(--ras-ink)]"
    : "bg-red-50 border-red-300 text-red-700";
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`w-full max-w-md rounded-2xl shadow-xl border ${tone}`}>
          <div className="px-5 pt-5">
            <h3 className="text-lg font-semibold">{title}</h3>
            {message && <p className="mt-2">{message}</p>}
          </div>
          <div className="px-5 pb-5 pt-4 flex justify-end">
            <button className="btn btn-primary" onClick={onClose}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "—");
const pick = (o, ...keys) => { for (const k of keys) { const v = o?.[k]; if (v !== undefined && v !== null) return v; } };

function pickErrorMessage(err) {
  const raw = err?.body?.message || err?.message || err;
  if (typeof raw === "string") {
    try { const j = JSON.parse(raw); return j.message || j.error || raw; } catch { return raw; }
  }
  return String(raw ?? "Có lỗi xảy ra");
}

/* API → UI map cho 1 dòng danh sách */
const normalizeRow = (s = {}) => ({
  id: s.id,
  fullName: s.hoc_sinh,
  phone: s.hs_phone,
  email: s.email,
  parentName: s.phu_huynh,
  parentPhone: s.phu_huynh_phone,
  supportBranch: s.chi_nhanh_ho_tro,
  startedAt: s.thoi_gian_bat_dau_hoc,
});

export default function TeamStudents() {
  /* filters + paging */
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  /* data */
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 0, totalPages: 1, totalElements: 0, size: 10 });
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [reload, setReload] = useState(0);

  /* create/edit */
  const [openEdit, setOpenEdit] = useState(false);
  const [mode, setMode] = useState("create");
  const emptyDraft = useMemo(() => ({
    id: null,
    fullName: "", phone: "", email: "",
    parentName: "", parentPhone: "", supportBranch: "",
    startedAt: "",
  }), []);
  const [draft, setDraft] = useState(emptyDraft);

  /* view */
  const [openView, setOpenView] = useState(false);
  const [detail, setDetail] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewErr, setViewErr] = useState("");

  /* confirm & notice */
  const [confirmDel, setConfirmDel] = useState({ open: false, row: null });
  const [notice, setNotice] = useState({ open: false, type: "success", title: "", message: "" });

  /* load list */
  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setErrMsg(""); setLoading(true);
        const res = await StudentsApi.list({ page, size, q: q || undefined });
        const items = (res?.items || []).map(normalizeRow);
        if (!on) return;
        setRows(items);
        setMeta({
          page: res?.page ?? page,
          size: res?.size ?? size,
          totalElements: res?.totalElements ?? items.length,
          totalPages: res?.totalPages ?? 1,
        });
      } catch (e) {
        if (on) setErrMsg(e.message || String(e));
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, [page, size, q, reload]);

  /* open modals */
  function openCreate() {
    setMode("create");
    setDraft(emptyDraft);
    setOpenEdit(true);
  }
  async function openEditRow(r) {
    try {
      setMode("edit");
      const d = await StudentsApi.get(r.id);
      setDraft({
        id: d.id,
        fullName: d.hoc_sinh || "",
        phone: d.hs_phone || "",
        email: d.email || "",
        parentName: d.phu_huynh || "",
        parentPhone: d.phu_huynh_phone || "",
        supportBranch: d.chi_nhanh_ho_tro || "",
        startedAt: d.thoi_gian_bat_dau_hoc || "",
      });
      setOpenEdit(true);
    } catch (e) {
      alert(`Không tải được chi tiết: ${e.message || e}`);
    }
  }

  /* save */
  function toPayload(v) {
    return {
      hoc_sinh: v.fullName?.trim(),
      hs_phone: v.phone?.trim(),
      email: v.email?.trim() || null,
      phu_huynh: v.parentName?.trim() || null,
      phu_huynh_phone: v.parentPhone?.trim() || null,
      chi_nhanh_ho_tro: v.supportBranch?.trim() || null,
      thoi_gian_bat_dau_hoc: v.startedAt || null,
    };
  }
  async function handleSave() {
    try {
      if (!draft.fullName?.trim()) return alert("Vui lòng nhập Họ tên");
      if (!draft.phone?.trim()) return alert("Vui lòng nhập SĐT");

      const payload = toPayload(draft);
      if (mode === "create") {
        await StudentsApi.create(payload);
      } else {
        if (!draft.id) return alert("Thiếu ID học viên");
        await StudentsApi.update(draft.id, payload);
      }
      setOpenEdit(false);
      setPage(0);
      setReload(x => x + 1);
    } catch (e) {
      alert(`Lỗi lưu học viên: ${e.message || e}`);
    }
  }

  /* delete with dialogs */
  function askDelete(row){ setConfirmDel({ open:true, row }); }
  async function doDelete(){
    const row = confirmDel.row;
    setConfirmDel({ open:false, row:null });
    if(!row?.id) return;

    try{
      await StudentsApi.delete(row.id);
      setNotice({ open:true, type:"success", title:"Đã xoá học viên", message:`Học viên #${row.id} đã được xoá.` });
      setReload(x=>x+1);
    }catch(e){
      // phòng trường hợp backend trả lỗi đặc biệt
      setNotice({ open:true, type:"error", title:"Không thể xoá", message: pickErrorMessage(e) });
    }
  }

  /* view */
  async function handleView(r){
    try{
      if(!r?.id) return alert("Bản ghi không có ID hợp lệ");
      setOpenView(true); setViewLoading(true); setViewErr(""); setDetail(null);
      const d = await StudentsApi.get(r.id);
      setDetail(d);
    }catch(e){ setViewErr(e.message || String(e)); }
    finally{ setViewLoading(false); }
  }

  const items = useMemo(()=>rows,[rows]);

  return (
    <div className="space-y-4">
      {/* Header RAS */}
      <div className="ras-gradient rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
        <h2 className="font-semibold">Học viên</h2>
        <div className="text-sm opacity-90">Quản lý danh sách học viên RAS</div>
      </div>

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="input ml-auto w-64"
          placeholder="Tìm theo tên, SĐT, email…"
          value={q}
          onChange={e => { setQ(e.target.value); setPage(0); }}
        />
        <select className="select" value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0); }}>
          {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openCreate}>+ Thêm học viên</button>
      </div>

      {/* error */}
      {errMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2">
          Lỗi tải danh sách: {errMsg}
        </div>
      )}

      {/* table */}
      <div className="card">
        <div className="card-header px-5 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-[var(--ras-ink)]">Danh sách học viên</h3>
        </div>
        <div className="card-body overflow-x-auto">
          {loading ? "Đang tải…" : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Email</th>
                  <th>Phụ huynh</th>
                  <th>SĐT Phụ huynh</th>
                  <th>CS hỗ trợ</th>
                  <th>Bắt đầu</th>
                  <th style={{width:220}}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s,i)=>(
                  <tr key={s.id ?? i}>
                    <td>{s.id != null ? `#${s.id}` : "#"}</td>
                    <td className="font-medium text-[var(--ras-ink)]">{s.fullName || "-"}</td>
                    <td>{s.phone || "-"}</td>
                    <td>{s.email || "-"}</td>
                    <td>{s.parentName || "-"}</td>
                    <td>{s.parentPhone || "-"}</td>
                    <td>{s.supportBranch || "-"}</td>
                    <td>{fmtDate(s.startedAt)}</td>
                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        <button className="btn btn-ras-soft" onClick={()=>handleView(s)}>Xem</button>
                        <button className="btn btn-ras-soft" onClick={()=>openEditRow(s)}>Sửa</button>
                        <button className="btn btn-primary" onClick={()=>askDelete(s)}>Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && !loading && !errMsg && (
                  <tr><td colSpan={9} className="text-center text-slate-500 py-6">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* paging */}
        <div className="px-5 py-3 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Trang {meta.page + 1}/{meta.totalPages} · Tổng {meta.totalElements}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ras-soft" disabled={meta.page <= 0} onClick={()=>setPage(p=>Math.max(0,p-1))}>Trước</button>
            <button className="btn btn-ras-soft" disabled={meta.page >= meta.totalPages-1} onClick={()=>setPage(p=>p+1)}>Sau</button>
          </div>
        </div>
      </div>

      {/* Create/Edit */}
      <Modal
        open={openEdit}
        onClose={()=>setOpenEdit(false)}
        title={mode === "create" ? "Thêm học viên" : `Sửa học viên #${draft?.id ?? ""}`}
        compact
        footer={
          <div className="flex items-center justify-end gap-2">
            <button className="btn btn-ras-soft" onClick={()=>setOpenEdit(false)}>Huỷ</button>
            <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Họ tên">
            <input className="input" value={draft.fullName} onChange={e=>setDraft({...draft, fullName:e.target.value})}/>
          </Field>
          <Field label="SĐT">
            <input className="input" value={draft.phone} onChange={e=>setDraft({...draft, phone:e.target.value})}/>
          </Field>
          <Field label="Email">
            <input className="input" value={draft.email || ""} onChange={e=>setDraft({...draft, email:e.target.value})}/>
          </Field>
          <Field label="Phụ huynh">
            <input className="input" value={draft.parentName || ""} onChange={e=>setDraft({...draft, parentName:e.target.value})}/>
          </Field>
          <Field label="SĐT phụ huynh">
            <input className="input" value={draft.parentPhone || ""} onChange={e=>setDraft({...draft, parentPhone:e.target.value})}/>
          </Field>
          <Field label="Chi nhánh hỗ trợ">
            <input className="input" value={draft.supportBranch || ""} onChange={e=>setDraft({...draft, supportBranch:e.target.value})}/>
          </Field>
          <Field label="Ngày bắt đầu học">
            <input type="date" className="input" value={draft.startedAt || ""} onChange={e=>setDraft({...draft, startedAt:e.target.value})}/>
          </Field>
        </div>
      </Modal>

      {/* View detail */}
      <Modal
        open={openView}
        onClose={()=>setOpenView(false)}
        title="Chi tiết học viên"
        footer={<div className="flex justify-end"><button className="btn btn-ras-soft" onClick={()=>setOpenView(false)}>Đóng</button></div>}
      >
        {viewLoading && <div>Đang tải chi tiết…</div>}
        {viewErr && <div className="text-red-600">{viewErr}</div>}
        {detail && !viewLoading && !viewErr && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="text-slate-500">ID</div><div>#{detail.id}</div>
            <div className="text-slate-500">Họ tên</div><div>{detail.hoc_sinh || "—"}</div>
            <div className="text-slate-500">SĐT</div><div>{detail.hs_phone || "—"}</div>
            <div className="text-slate-500">Email</div><div>{detail.email || "—"}</div>
            <div className="text-slate-500">Phụ huynh</div><div>{detail.phu_huynh || "—"}</div>
            <div className="text-slate-500">SĐT phụ huynh</div><div>{detail.phu_huynh_phone || "—"}</div>
            <div className="text-slate-500">Chi nhánh hỗ trợ</div><div>{detail.chi_nhanh_ho_tro || "—"}</div>
            <div className="text-slate-500">Ngày bắt đầu</div><div>{fmtDate(detail.thoi_gian_bat_dau_hoc)}</div>
            <div className="text-slate-500">Tạo lúc</div><div>{fmtDate(detail.ngay_tao)}</div>
            <div className="text-slate-500">Sửa lúc</div><div>{fmtDate(detail.ngay_sua)}</div>
          </div>
        )}
      </Modal>

      {/* Dialogs */}
      <ConfirmDialog
        open={confirmDel.open}
        title="Xác nhận xoá"
        message={
          confirmDel.row
            ? `Bạn có chắc muốn xoá học viên "${confirmDel.row.fullName || "-"}" (ID #${confirmDel.row.id})?`
            : ""
        }
        onCancel={()=>setConfirmDel({ open:false, row:null })}
        onOK={doDelete}
        okText="Xoá"
      />
      <NoticeDialog
        open={notice.open}
        type={notice.type}
        title={notice.title}
        message={notice.message}
        onClose={()=>setNotice({ open:false, type:"success", title:"", message:"" })}
      />
    </div>
  );
}
