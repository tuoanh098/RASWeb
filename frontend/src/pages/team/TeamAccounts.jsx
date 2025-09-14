// src/pages/TeamAccounts.jsx
import React, { useEffect, useState } from "react";
import AccountsApi from "../../lib/accountsApi.js";
import { useDebounce } from "../lib/useDebounce.js";

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium mb-1">{label}</div>
      {children}
    </label>
  );
}

export default function TeamAccounts() {
  const [q, setQ] = useState("");
  const qDeb = useDebounce(q, 300);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [role, setRole] = useState("");
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState({ items: [], page: 0, totalPages: 1, totalElements: 0 });

  // modal
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [draft, setDraft] = useState({
    id: null,
    username: "",
    role: "STAFF",
    active: true,
    id_nhan_vien: null, // liên kết nhân viên
    new_password: "",
  });

  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true); setErr("");
      try {
        const res = await AccountsApi.list({
          page, size, q: qDeb || undefined,
          role: role || undefined,
          active: active === "" ? undefined : active === "1",
        });
        if (!on) return;
        setData(res);
      } catch (e) {
        if (!on) return;
        setErr(e.message || String(e));
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, [page, size, qDeb, role, active]);

  function openCreate() {
    setMode("create");
    setDraft({ id: null, username: "", role: "STAFF", active: true, id_nhan_vien: null, new_password: "" });
    setOpen(true);
  }
  function openEdit(row) {
    setMode("edit");
    setDraft({
      id: row.id,
      username: row.username || "",
      role: row.role || "STAFF",
      active: !!row.active,
      id_nhan_vien: row.id_nhan_vien ?? null,
      new_password: "",
    });
    setOpen(true);
  }

  async function handleSave() {
    try {
      if (!draft.username?.trim()) return alert("Vui lòng nhập username");
      const payload = {
        username: draft.username.trim(),
        role: draft.role,
        active: !!draft.active,
        id_nhan_vien: draft.id_nhan_vien ?? null,
        ...(mode === "create" && draft.new_password?.trim()
          ? { new_password: draft.new_password.trim() }
          : {}),
      };
      if (mode === "create") await AccountsApi.create(payload);
      else {
        if (!draft.id) return alert("Thiếu ID tài khoản");
        await AccountsApi.update(draft.id, payload);
        if (draft.new_password?.trim()) {
          await AccountsApi.resetPassword(draft.id, draft.new_password.trim());
        }
      }
      setOpen(false);
      setPage(0); // reload
    } catch (e) {
      alert(`Lỗi lưu tài khoản: ${e.message || e}`);
    }
  }

  async function handleDelete(row) {
    if (!confirm(`Xoá tài khoản "${row.username}"?`)) return;
    try {
      await AccountsApi.delete(row.id);
      setPage(0);
    } catch (e) {
      alert(`Lỗi xoá: ${e.message || e}`);
    }
  }

  const items = data?.items ?? [];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input className="input w-64" placeholder="Tìm username hoặc tên NV..."
               value={q} onChange={e => { setQ(e.target.value); setPage(0); }} />
        <select className="select" value={role} onChange={e=>{ setRole(e.target.value); setPage(0); }}>
          <option value="">Tất cả vai trò</option>
          <option value="TEACHER">Giáo viên</option>
          <option value="STAFF">Nhân viên</option>
          <option value="MANAGER">Quản lý</option>
        </select>
        <select className="select" value={active} onChange={e=>{ setActive(e.target.value); setPage(0); }}>
          <option value="">Tất cả trạng thái</option>
          <option value="1">Đang hoạt động</option>
          <option value="0">Ngưng</option>
        </select>
        <button className="btn btn-primary ml-auto" onClick={openCreate}>+ Tạo tài khoản</button>
      </div>

      {err && <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2">Lỗi: {err}</div>}

      <div className="card">
        <div className="card-header"><h3 className="font-semibold">Tài khoản</h3></div>
        <div className="card-body overflow-x-auto">
          {loading ? "Đang tải…" : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th><th>Username</th><th>Vai trò</th><th>Nhân viên</th><th>Lần đăng nhập</th><th>Trạng thái</th><th style={{width:150}}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map(r => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>{r.username}</td>
                    <td>{r.role || "-"}</td>
                    <td>{r.nhan_vien_ho_ten || `#${r.id_nhan_vien ?? "-"}`}</td>
                    <td>{r.last_login ? new Date(r.last_login).toLocaleString("vi-VN") : "-"}</td>
                    <td>{r.active ? "Đang hoạt động" : "Ngưng"}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="btn btn-sm" onClick={()=>openEdit(r)}>Sửa</button>
                        <button className="btn btn-sm text-red-600 border-red-200" onClick={()=>handleDelete(r)}>Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-slate-500 py-6">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-5 py-3 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Trang {(data.page ?? 0) + 1} / {(data.totalPages ?? 1)} · Tổng {(data.totalElements ?? items.length)}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn" disabled={(data.page ?? 0) <= 0} onClick={()=>setPage(p=>Math.max(0,p-1))}>Trước</button>
            <button className="btn" disabled={(data.page ?? 0) >= (data.totalPages ?? 1)-1} onClick={()=>setPage(p=>p+1)}>Sau</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={()=>setOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <h3 className="font-semibold">{mode === "create" ? "Tạo tài khoản" : `Sửa tài khoản #${draft?.id}`}</h3>
                <button onClick={()=>setOpen(false)} className="text-slate-500 hover:text-slate-800">✕</button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Username">
                  <input className="input" value={draft.username} onChange={e=>setDraft({...draft, username:e.target.value})}/>
                </Field>
                <Field label="Vai trò">
                  <select className="select" value={draft.role} onChange={e=>setDraft({...draft, role:e.target.value})}>
                    <option value="TEACHER">Giáo viên</option>
                    <option value="STAFF">Nhân viên</option>
                    <option value="MANAGER">Quản lý</option>
                  </select>
                </Field>
                <Field label="Gắn với nhân viên (ID)">
                  <input className="input" type="number" value={draft.id_nhan_vien ?? ""} onChange={e=>setDraft({...draft, id_nhan_vien:e.target.value ? Number(e.target.value) : null})}/>
                </Field>
                <Field label="Trạng thái">
                  <select className="select" value={draft.active ? "1" : "0"} onChange={e=>setDraft({...draft, active: e.target.value === "1"})}>
                    <option value="1">Đang hoạt động</option>
                    <option value="0">Ngưng</option>
                  </select>
                </Field>
                <Field label={mode === "create" ? "Mật khẩu" : "Đổi mật khẩu (tuỳ chọn)"}>
                  <input className="input" type="password" value={draft.new_password || ""} onChange={e=>setDraft({...draft, new_password:e.target.value})}/>
                </Field>
              </div>
              <div className="px-4 py-3 border-t bg-slate-50">
                <div className="flex items-center justify-end gap-2">
                  <button className="btn" onClick={()=>setOpen(false)}>Huỷ</button>
                  <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
