import React, { useEffect, useMemo, useState } from "react";
import AccountsApi from "../../lib/accountsApi.js";
import { useDebounce } from "../../lib/useDebounce.js";

/* ================= RAS brand ================= */
const RAS = {
  primary: "#4434C2",       // tím chủ đạo
  accent1: "#FF6F61",       // coral
  accent2: "#22B8B5",       // teal
  softBg: "linear-gradient(135deg,#f6f5ff 0%, #fffdf7 100%)",
};

const BrandHeader = ({ title, right }) => (
  <div
    className="card-header flex items-center justify-between"
    style={{ background: RAS.softBg, borderBottom: "1px solid #ECE9FF" }}
  >
    <h3 className="font-semibold" style={{ color: RAS.primary }}>{title}</h3>
    <div className="flex items-center gap-2">{right}</div>
  </div>
);

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium mb-1">{label}</div>
      {children}
    </label>
  );
}

/* ================= Dialogs ================= */
function ConfirmDialog({
  open, title = "Xác nhận", message,
  onCancel, onOk, okText = "Xoá", loading
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border overflow-hidden">
          <div
            className="px-5 py-3"
            style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent1})` }}
          >
            <div className="text-white font-semibold">{title}</div>
          </div>
          <div className="p-5 text-slate-700">{message}</div>
          <div className="px-5 py-3 bg-slate-50 border-t flex items-center justify-end gap-2">
            <button className="btn" onClick={onCancel}>Huỷ</button>
            <button
              className="btn"
              style={{ borderColor: "#ffd2cc", color: RAS.accent1 }}
              onClick={onOk}
              disabled={loading}
            >
              {okText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoticeDialog({ open, type = "success", title, message, onClose }) {
  if (!open) return null;
  const tone =
    type === "success"
      ? "bg-[#f3e9ff] border-[#7c4dff] text-[#3b2b67]"
      : "bg-red-50 border-red-300 text-red-700";
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`w-full max-w-md rounded-2xl shadow-xl border ${tone}`}>
          <div className="px-5 pt-5">
            <h3 className="text-lg font-semibold">{title}</h3>
            {message && <p className="mt-2">{message}</p>}
          </div>
          <div className="px-5 pb-5 pt-4 flex justify-end">
            <button
              className="btn btn-primary"
              style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})`, border: "none" }}
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Helpers ================= */
const roleBadge = (role) => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  if (role === "MANAGER") return <span className={`${base}`} style={{ color: "#fff", background: RAS.primary }}>Quản lý</span>;
  if (role === "TEACHER") return <span className={`${base}`} style={{ color: "#fff", background: RAS.accent2 }}>Giáo viên</span>;
  return <span className={`${base}`} style={{ color: "#fff", background: RAS.accent1 }}>Nhân viên</span>;
};
const activeBadge = (a) => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  return a
    ? <span className={`${base} bg-emerald-100 text-emerald-700 border border-emerald-200`}>Đang hoạt động</span>
    : <span className={`${base} bg-slate-100 text-slate-600 border border-slate-200`}>Ngưng</span>;
};

/* ================= Page ================= */
export default function TeamAccounts() {
  const [q, setQ] = useState("");
  const qDeb = useDebounce(q, 300);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [role, setRole] = useState("");
  const [active, setActive] = useState("");
  const [reload, setReload] = useState(0);

  const [data, setData] = useState({ items: [], page: 0, totalPages: 1, totalElements: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // modal create/edit
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [draft, setDraft] = useState({
    id: null, username: "", email: "", role: "STAFF", active: true, id_nhan_vien: null, new_password: "",
  });

  // confirm delete + notice
  const [confirm, setConfirm] = useState({ open: false, row: null, loading: false });
  const [notice, setNotice] = useState({ open: false, type: "success", title: "", message: "" });

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setErr(""); setLoading(true);
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
  }, [page, size, qDeb, role, active, reload]);

  const items = useMemo(() => data?.items ?? [], [data]);

  function openCreate() {
    setMode("create");
    setDraft({ id: null, username: "", email: "", role: "STAFF", active: true, id_nhan_vien: null, new_password: "" });
    setOpen(true);
  }
  function openEdit(row) {
    setMode("edit");
    setDraft({
      id: row.id,
      username: row.username || "",
      email: row.email || "",
      role: row.vai_tro || row.role || "STAFF",
      active: !!(row.hoat_dong ?? row.active),
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
        email: draft.email?.trim() || null,
        role: draft.role,
        active: !!draft.active,
        id_nhan_vien: draft.id_nhan_vien ?? null,
      };
      if (mode === "create") {
        await AccountsApi.create({ ...payload, new_password: draft.new_password?.trim() || undefined });
        setNotice({
          open: true, type: "success",
          title: "Đã tạo tài khoản",
          message: `Tài khoản ${payload.username} đã được tạo.`,
        });
      } else {
        if (!draft.id) return alert("Thiếu ID tài khoản");
        await AccountsApi.update(draft.id, payload);
        if (draft.new_password?.trim()) {
          // fallback nếu bạn dùng update để đổi mật khẩu
          await AccountsApi.update(draft.id, { new_password: draft.new_password.trim() });
        }
        setNotice({
          open: true, type: "success",
          title: "Đã cập nhật tài khoản",
          message: `Cập nhật thông tin cho ${payload.username}.`,
        });
      }
      setOpen(false);
      setPage(0);
      setReload((x) => x + 1);
    } catch (e) {
      setNotice({ open: true, type: "error", title: "Lỗi lưu tài khoản", message: e.message || String(e) });
    }
  }

  function askDelete(row) { setConfirm({ open: true, row, loading: false }); }
  async function doDelete() {
    const row = confirm.row;
    try {
      setConfirm((s) => ({ ...s, loading: true }));
      await AccountsApi.delete(row.id);
      setConfirm({ open: false, row: null, loading: false });
      setNotice({ open: true, type: "success", title: "Đã xoá tài khoản", message: `Tài khoản ${row.username} đã được xoá.` });
      setPage(0);
      setReload((x) => x + 1);
    } catch (e) {
      setConfirm({ open: false, row: null, loading: false });
      setNotice({ open: true, type: "error", title: "Lỗi xoá", message: e.message || String(e) });
    }
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <BrandHeader
          title="Tài khoản nhân viên"
          right={
            <>
              <input
                className="input w-64"
                placeholder="Tìm username, email…"
                value={q}
                onChange={e => { setQ(e.target.value); setPage(0); }}
              />
              <select className="select" value={role} onChange={e => { setRole(e.target.value); setPage(0); }}>
                <option value="">Tất cả vai trò</option>
                <option value="TEACHER">Giáo viên</option>
                <option value="STAFF">Nhân viên</option>
                <option value="MANAGER">Quản lý</option>
              </select>
              <select className="select" value={active} onChange={e => { setActive(e.target.value); setPage(0); }}>
                <option value="">Tất cả trạng thái</option>
                <option value="1">Đang hoạt động</option>
                <option value="0">Ngưng</option>
              </select>
              <button
                className="btn btn-primary"
                style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})`, border: "none" }}
                onClick={openCreate}
              >
                + Tạo tài khoản
              </button>
            </>
          }
        />

        {err && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2">
            Lỗi: {err}
          </div>
        )}

        <div className="card-body overflow-x-auto">
          {loading ? "Đang tải…" : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Nhân viên</th>
                  <th>Đăng nhập cuối</th>
                  <th>Trạng thái</th>
                  <th style={{ width: 180 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map(r => {
                  const roleVal = r.vai_tro || r.role || "-";
                  const activeVal = (r.hoat_dong ?? r.active) ? 1 : 0;
                  return (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td className="font-medium" style={{ color: RAS.primary }}>{r.username}</td>
                      <td>{r.email || "-"}</td>
                      <td>{roleBadge(roleVal)}</td>
                      <td>{r.nhan_vien_ho_ten || (r.id_nhan_vien ? `#${r.id_nhan_vien}` : "-")}</td>
                      <td>{r.lan_dang_nhap_cuoi ? new Date(r.lan_dang_nhap_cuoi).toLocaleString("vi-VN") : "-"}</td>
                      <td>{activeBadge(activeVal)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button className="btn btn-sm" onClick={() => openEdit(r)}>Sửa</button>
                          <button className="btn btn-sm text-red-600 border-red-200" onClick={() => askDelete(r)}>Xoá</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {items.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-slate-500 py-6">Không có dữ liệu</td></tr>
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
            <button className="btn" disabled={(data.page ?? 0) <= 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Trước</button>
            <button className="btn" disabled={(data.page ?? 0) >= (data.totalPages ?? 1) - 1} onClick={() => setPage(p => p + 1)}>Sau</button>
          </div>
        </div>
      </div>

      {/* Create/Edit */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border">
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ background: RAS.softBg }}>
                <h3 className="font-semibold" style={{ color: RAS.primary }}>
                  {mode === "create" ? "Tạo tài khoản" : `Sửa tài khoản #${draft?.id}`}
                </h3>
                <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-800">✕</button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Username">
                  <input className="input" value={draft.username}
                         onChange={e => setDraft({ ...draft, username: e.target.value })} />
                </Field>
                <Field label="Email">
                  <input className="input" value={draft.email || ""}
                         onChange={e => setDraft({ ...draft, email: e.target.value })} />
                </Field>
                <Field label="Vai trò">
                  <select className="select" value={draft.role}
                          onChange={e => setDraft({ ...draft, role: e.target.value })}>
                    <option value="TEACHER">Giáo viên</option>
                    <option value="STAFF">Nhân viên</option>
                    <option value="MANAGER">Quản lý</option>
                  </select>
                </Field>
                <Field label="Gắn với nhân viên (ID)">
                  <input className="input" type="number" value={draft.id_nhan_vien ?? ""}
                         onChange={e => setDraft({ ...draft, id_nhan_vien: e.target.value ? Number(e.target.value) : null })} />
                </Field>
                <Field label="Trạng thái">
                  <select className="select" value={draft.active ? "1" : "0"}
                          onChange={e => setDraft({ ...draft, active: e.target.value === "1" })}>
                    <option value="1">Đang hoạt động</option>
                    <option value="0">Ngưng</option>
                  </select>
                </Field>
                <Field label={mode === "create" ? "Mật khẩu ban đầu" : "Đặt lại mật khẩu (tuỳ chọn)"}>
                  <input className="input" type="password" value={draft.new_password || ""}
                         onChange={e => setDraft({ ...draft, new_password: e.target.value })} />
                </Field>
              </div>
              <div className="px-4 py-3 border-t bg-slate-50">
                <div className="flex items-center justify-end gap-2">
                  <button className="btn" onClick={() => setOpen(false)}>Huỷ</button>
                  <button
                    className="btn btn-primary"
                    style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})`, border: "none" }}
                    onClick={handleSave}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        title="Xoá tài khoản"
        message={`Bạn chắc chắn muốn xoá tài khoản "${confirm.row?.username ?? ""}"?`}
        onCancel={() => setConfirm({ open: false, row: null, loading: false })}
        onOk={doDelete}
        loading={confirm.loading}
      />

      <NoticeDialog
        open={notice.open}
        type={notice.type}
        title={notice.title}
        message={notice.message}
        onClose={() => setNotice({ open: false, type: "success", title: "", message: "" })}
      />
    </div>
  );
}
