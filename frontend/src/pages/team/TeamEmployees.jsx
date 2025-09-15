import React, { useEffect, useMemo, useState } from "react";
import EmployeesApi from "../../lib/employeesApi.js";

/* ------------ small UI ------------ */
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
        <div className={`w-full max-w-6xl bg-white rounded-xl border shadow-lg ${compact ? 'compact-modal' : ''}`}>
          <div className={`${compact ? 'modal-header' : 'px-4 py-3 border-b'} flex items-center justify-between`}>
            <h3 className="font-semibold text-[var(--ras-ink)]">{title}</h3>
            <button className="text-slate-500 hover:text-slate-800" onClick={onClose}>✕</button>
          </div>
          <div className={compact ? 'p-3' : 'p-4'}>{children}</div>
          {footer && (
            <div className={`${compact ? 'modal-footer' : 'px-4 py-3 border-t bg-[var(--ras-bg)]'}`}>{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function pickErrorMessage(err) {
  const raw = err?.body?.message || err?.message || err;
  if (typeof raw === "string") {
    try { const j = JSON.parse(raw); return j.message || j.error || raw; } catch { return raw; }
  }
  return String(raw ?? "Có lỗi xảy ra");
}
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("vi-VN") : "—");
const fmtNum  = (n) => (n == null ? "—" : Number(n).toLocaleString("vi-VN"));
const pick = (o, ...keys) => { for (const k of keys) { const v = o?.[k]; if (v !== undefined && v !== null) return v; } };

const normalizeRow = (r = {}) => ({
  id: r.id ?? r.ID,
  fullName: r.ho_ten ?? r.hoTen,
  phone: r.so_dien_thoai ?? r.soDienThoai,
  email: r.email ?? r.Email,
  role: r.vai_tro ?? r.vaiTro,
  major: r.chuyen_mon ?? r.chuyenMon,
  title: r.chuc_danh ?? r.chucDanh,
  active: (r.hoat_dong ?? r.hoatDong) ?? false,
});

/* ------------ role badge / status pill ------------ */
function RoleBadge({ role }) {
  if (role === "TEACHER") return <span className="badge badge-teacher">Giáo viên</span>;
  if (role === "MANAGER") return <span className="badge badge-manager">Quản lý</span>;
  return <span className="badge badge-staff">Nhân viên</span>;
}
const StatusPill = ({ on }) =>
  <span className={`pill ${on ? 'pill-on' : 'pill-off'}`}>{on ? "Đang hoạt động" : "Ngưng"}</span>;

/* ------------ page ------------ */
export default function TeamEmployees() {
  const [kw, setKw] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 0, totalPages: 1, totalElements: 0, size: 10 });
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [reload, setReload] = useState(0);

  const emptyDraft = useMemo(() => ({
    id: null,
    ho_ten: "", so_dien_thoai: "", email: "", vai_tro: "STAFF",
    chuyen_mon: "", chuc_danh: "", hoat_dong: true,
    ngay_sinh: "", gioi_tinh: "", dia_chi: "", cccd: "", ma_so_thue: "",
    ngay_vao_lam: "", so_nam_kinh_nghiem: "",
    hinh_thuc_lam_viec: "", ghi_chu: "", avatar_url: "",
  }), []);
  const [openEdit, setOpenEdit] = useState(false);
  const [mode, setMode] = useState("create");
  const [draft, setDraft] = useState(emptyDraft);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [openView, setOpenView] = useState(false);
  const [detail, setDetail] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewErr, setViewErr] = useState("");
  const [confirmDel, setConfirmDel] = useState({ open: false, row: null });
  const [notice, setNotice] = useState({ open: false, type: "success", title: "", message: "" });

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setLoading(true); setErrMsg("");
        const res = await EmployeesApi.list({ page, size, q: kw || undefined, role: role || undefined });
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
      } finally { if (on) setLoading(false); }
    })();
    return () => { on = false; };
  }, [page, size, kw, role, reload]);

  function openCreate() {
    setMode("create");
    setDraft(emptyDraft);
    setAvatarFile(null);
    setAvatarPreview(null);
    setOpenEdit(true);
  }

  async function openEditRow(r) {
    try {
      setMode("edit");
      const d = await EmployeesApi.get(r.id);
      const newDraft = {
        id: pick(d, "id"),
        ho_ten: pick(d, "ho_ten", "hoTen") || "",
        so_dien_thoai: pick(d, "so_dien_thoai", "soDienThoai") || "",
        email: pick(d, "email") || "",
        vai_tro: pick(d, "vai_tro", "vaiTro") || "STAFF",
        chuyen_mon: pick(d, "chuyen_mon", "chuyenMon") || "",
        chuc_danh: pick(d, "chuc_danh", "chucDanh") || "",
        hoat_dong: !!pick(d, "hoat_dong", "hoatDong"),
        ngay_sinh: pick(d, "ngay_sinh", "ngaySinh") || "",
        gioi_tinh: pick(d, "gioi_tinh", "gioiTinh") || "",
        dia_chi: pick(d, "dia_chi", "diaChi") || "",
        cccd: pick(d, "cccd") || "",
        ma_so_thue: pick(d, "ma_so_thue", "maSoThue") || "",
        ngay_vao_lam: pick(d, "ngay_vao_lam", "ngayVaoLam") || "",
        so_nam_kinh_nghiem: pick(d, "so_nam_kinh_nghiem", "soNamKinhNghiem") ?? "",
        hinh_thuc_lam_viec: pick(d, "hinh_thuc_lam_viec", "hinhThucLamViec") || "",
        ghi_chu: pick(d, "ghi_chu", "ghiChu") || "",
        avatar_url: pick(d, "avatar_url", "avatarUrl") || "",
      };
      setDraft(newDraft);
      setAvatarFile(null);
      setAvatarPreview(null);
      setOpenEdit(true);
    } catch (e) { alert(`Không tải được chi tiết: ${e.message || e}`); }
  }

  function onAvatarChange(file) {
    setAvatarFile(file || null);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  }

  function ConfirmDialog({ open, title = "Xác nhận", message, onCancel, onOK, okText = "Đồng ý" }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-[100]">
        <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border">
            <div className="px-5 pt-5">
              <h3 className="text-lg font-semibold text-[var(--ras-ink)]">{title}</h3>
              <p className="mt-2 text-slate-600">{message}</p>
            </div>
            <div className="px-5 pb-5 pt-4 flex justify-end gap-2">
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
    const tone =
      type === "success"
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

  function buildUpsertPayload() {
    const v = draft;
    const toDec = (x) => (x === "" || x == null ? null : Number(x));
    const toInt = (x) => (x === "" || x == null ? null : parseInt(x, 10));
    const isTeacher = v.vai_tro === "TEACHER";
    return {
      ho_ten: v.ho_ten?.trim(),
      so_dien_thoai: v.so_dien_thoai?.trim(),
      email: v.email?.trim() || null,
      vai_tro: v.vai_tro || "STAFF",
      chuyen_mon: isTeacher ? (v.chuyen_mon?.trim() || null) : null,
      chuc_danh: !isTeacher ? (v.chuc_danh?.trim() || null) : null,
      hoat_dong: !!v.hoat_dong,
      ngay_sinh: v.ngay_sinh || null,
      gioi_tinh: v.gioi_tinh || null,
      dia_chi: v.dia_chi?.trim() || null,
      cccd: v.cccd?.trim() || null,
      ma_so_thue: v.ma_so_thue?.trim() || null,
      ngay_vao_lam: v.ngay_vao_lam || null,
      so_nam_kinh_nghiem: toInt(v.so_nam_kinh_nghiem),
      hinh_thuc_lam_viec: v.hinh_thuc_lam_viec?.trim() || null,
      ghi_chu: v.ghi_chu?.trim() || null,
      avatar_url: v.avatar_url || null,
    };
  }

  async function handleSave() {
    try {
      if (!draft.ho_ten?.trim()) return alert("Vui lòng nhập Họ tên");
      if (!draft.so_dien_thoai?.trim()) return alert("Vui lòng nhập SĐT");
      const payload = buildUpsertPayload();

      let id = draft.id;
      if (mode === "create") {
        const created = await EmployeesApi.create(payload);
        id = created?.id;
        if (!id) throw new Error("Không nhận được ID sau khi tạo");
      } else {
        if (!id) return alert("Thiếu ID để cập nhật");
        await EmployeesApi.update(id, payload);
      }

      if (avatarFile) {
        try {
          const r = await EmployeesApi.uploadAvatar(id, avatarFile);
          setDraft((d) => ({ ...d, avatar_url: r?.avatar_url || d.avatar_url }));
        } catch (e) {
          console.warn("Upload avatar lỗi:", e);
          alert(`Lưu xong dữ liệu, nhưng upload ảnh lỗi: ${e.message || e}`);
        }
      }

      setOpenEdit(false);
      setReload(x => x + 1);
      setPage(0);
    } catch (e) { alert(`Lỗi lưu: ${e.message || e}`); }
  }

  function askDelete(row) { setConfirmDel({ open: true, row }); }

  async function doDelete() {
    const row = confirmDel.row;
    setConfirmDel({ open: false, row: null });
    if (!row?.id) return;

    try {
      await EmployeesApi.delete(row.id);
      setNotice({
        open: true,
        type: "success",
        title: "Đã xoá nhân sự",
        message: `Nhân viên #${row.id} đã được xoá.`,
      });
      setReload((x) => x + 1);
    } catch (e) {
      const status = e?.status || e?.response?.status;
      const msg = pickErrorMessage(e);
      if (status === 409) {
        setNotice({
          open: true,
          type: "success",
          title: "Đã chuyển sang trạng thái 'Ngưng hoạt động'",
          message: "",
        });
        setReload((x) => x + 1);
        return;
      }
      setNotice({ open: true, type: "error", title: "Không thể xoá", message: msg });
    }
  }

  async function handleView(r) {
    try {
      if (!r?.id) return alert("Bản ghi không có ID hợp lệ");
      setOpenView(true); setViewLoading(true); setViewErr(""); setDetail(null);
      const d = await EmployeesApi.get(r.id);
      setDetail(d);
    } catch (e) { setViewErr(e.message || String(e)); }
    finally { setViewLoading(false); }
  }

  return (
    <div className="space-y-4">
      {/* Top bar màu RAS */}
      <div className="ras-gradient rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
        <h2 className="font-semibold">Nhân viên</h2>
        <div className="text-sm opacity-90">Quản lý đội ngũ nhân viên RAS</div>
      </div>

      {/* filters */}
      <div className="toolbar flex flex-wrap items-center">
        <select className="select" value={role} onChange={(e)=>{ setRole(e.target.value); setPage(0); }}>
          <option value="">Tất cả vai trò</option>
          <option value="TEACHER">Giáo viên</option>
          <option value="STAFF">Nhân viên</option>
          <option value="MANAGER">Quản lý</option>
        </select>
        <input
          className="input ml-auto w-64"
          placeholder="Tìm theo tên, SĐT, email…"
          value={kw}
          onChange={(e)=>{ setKw(e.target.value); setPage(0); }}
        />
        <select className="select" value={size} onChange={(e)=>{ setSize(Number(e.target.value)); setPage(0); }}>
          {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openCreate}>+ Thêm nhân sự</button>
      </div>

      {errMsg && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2">
          Lỗi tải danh sách: {errMsg}
        </div>
      )}

      <div className="card">
        <div className="card-header px-5 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-[var(--ras-ink)]">Danh sách nhân viên</h3>
        </div>
        <div className="card-body overflow-x-auto">
          {loading ? "Đang tải…" : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th><th>Họ tên</th><th>SĐT</th><th>Email</th>
                  <th>Vai trò</th><th>Chuyên môn/Chức danh</th><th>Trạng thái</th>
                  <th style={{width:260}}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.id ?? i}>
                    <td>{r.id != null ? `#${r.id}` : "#"}</td>
                    <td className="font-medium text-[var(--ras-ink)]">{r.fullName || "-"}</td>
                    <td>{r.phone || "-"}</td>
                    <td>{r.email || "-"}</td>
                    <td><RoleBadge role={r.role} /></td>
                    <td>{r.role === "TEACHER" ? (r.major || "-") : (r.title || "-")}</td>
                    <td><StatusPill on={r.active} /></td>
                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        <button className="btn btn-ras-soft" onClick={()=>handleView(r)}>Xem</button>
                        <button className="btn btn-ras-soft" onClick={()=>openEditRow(r)}>Sửa</button>
                        <button className="btn btn-primary" onClick={()=>askDelete(r)}>Dừng</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && !errMsg && (
                  <tr><td colSpan={8} className="text-center text-slate-500 py-6">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

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

      {/* ====== Modal create/edit ====== */}
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        title={mode === 'create' ? 'Thêm nhân sự' : `Sửa nhân sự #${draft?.id ?? ''}`}
        compact
        footer={
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Tip: Nhập số dùng dấu chấm (.) cho thập phân, để trống nếu không có.
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-ras-soft" onClick={()=>setOpenEdit(false)}>Huỷ</button>
              <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <div className="w-40 h-40 rounded-xl overflow-hidden bg-slate-100 border">
              {avatarPreview || draft.avatar_url
                ? <img src={avatarPreview || draft.avatar_url} alt="avatar" className="w-full h-full object-cover"/>
                : <div className="w-full h-full grid place-items-center text-slate-400">No image</div>}
            </div>
            <div className="mt-3 space-y-2">
              <input type="file" accept="image/*" onChange={(e)=>onAvatarChange(e.target.files?.[0])} />
              <Field label="Trạng thái">
                <select className="select" value={draft.hoat_dong ? "1" : "0"}
                        onChange={e=>setDraft({...draft, hoat_dong: e.target.value==="1"})}>
                  <option value="1">Đang hoạt động</option>
                  <option value="0">Ngưng</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:col-span-2">
            <Field label="Họ tên">
              <input className="input" value={draft.ho_ten}
                     onChange={e=>setDraft({...draft, ho_ten:e.target.value})}/>
            </Field>
            <Field label="SĐT">
              <input className="input" value={draft.so_dien_thoai}
                     onChange={e=>setDraft({...draft, so_dien_thoai:e.target.value})}/>
            </Field>
            <Field label="Email">
              <input className="input" value={draft.email || ""} onChange={e=>setDraft({...draft, email:e.target.value})}/>
            </Field>
            <Field label="Vai trò">
              <select className="select" value={draft.vai_tro} onChange={e=>setDraft({...draft, vai_tro:e.target.value})}>
                <option value="TEACHER">Giáo viên</option>
                <option value="STAFF">Nhân viên</option>
                <option value="MANAGER">Quản lý</option>
              </select>
            </Field>

            {draft.vai_tro === "TEACHER" ? (
              <Field label="Chuyên môn (GV)">
                <input className="input" value={draft.chuyen_mon || ""} onChange={e=>setDraft({...draft, chuyen_mon:e.target.value})}/>
              </Field>
            ) : (
              <Field label="Chức danh (NV/QL)">
                <input className="input" value={draft.chuc_danh || ""} onChange={e=>setDraft({...draft, chuc_danh:e.target.value})}/>
              </Field>
            )}
            <Field label="Hình thức làm việc">
              <input className="input" value={draft.hinh_thuc_lam_viec || ""} onChange={e=>setDraft({...draft, hinh_thuc_lam_viec:e.target.value})}/>
            </Field>

            <Field label="Ngày sinh">
              <input type="date" className="input" value={draft.ngay_sinh || ""} onChange={e=>setDraft({...draft, ngay_sinh:e.target.value})}/>
            </Field>
            <Field label="Giới tính">
              <select className="select" value={draft.gioi_tinh || ""} onChange={e=>setDraft({...draft, gioi_tinh:e.target.value})}>
                <option value="">—</option>
                <option value="NAM">Nam</option>
                <option value="NU">Nữ</option>
                <option value="KHAC">Khác</option>
              </select>
            </Field>
            <Field label="Địa chỉ">
              <input className="input" value={draft.dia_chi || ""} onChange={e=>setDraft({...draft, dia_chi:e.target.value})}/>
            </Field>
            <Field label="CCCD">
              <input className="input" value={draft.cccd || ""} onChange={e=>setDraft({...draft, cccd:e.target.value})}/>
            </Field>
            <Field label="Mã số thuế">
              <input className="input" value={draft.ma_so_thue || ""} onChange={e=>setDraft({...draft, ma_so_thue:e.target.value})}/>
            </Field>
            <Field label="Ngày vào làm">
              <input type="date" className="input" value={draft.ngay_vao_lam || ""} onChange={e=>setDraft({...draft, ngay_vao_lam:e.target.value})}/>
            </Field>

            <Field label="Số năm kinh nghiệm">
              <input type="number" className="input" value={draft.so_nam_kinh_nghiem ?? ""}
                     onChange={e=>setDraft({...draft, so_nam_kinh_nghiem:e.target.value})}/>
            </Field>
            <Field label="Ghi chú" >
              <textarea className="input min-h-[88px]" value={draft.ghi_chu || ""}
                        onChange={e=>setDraft({...draft, ghi_chu:e.target.value})}/>
            </Field>
          </div>
        </div>
      </Modal>

      {/* ====== Modal view detail ====== */}
      <Modal
        open={openView}
        onClose={()=>setOpenView(false)}
        title={detail ? `Chi tiết: ${pick(detail,"ho_ten","hoTen") ?? "—"}` : "Chi tiết nhân sự"}
        footer={<div className="flex justify-end"><button className="btn btn-ras-soft" onClick={()=>setOpenView(false)}>Đóng</button></div>}
      >
        {viewLoading && <div>Đang tải chi tiết…</div>}
        {viewErr && <div className="text-red-600">{viewErr}</div>}
        {detail && !viewLoading && !viewErr && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="w-40 h-40 rounded-xl overflow-hidden bg-slate-100 border">
                {pick(detail,"avatar_url","avatarUrl")
                  ? <img src={pick(detail,"avatar_url","avatarUrl")} alt="avatar" className="w-full h-full object-cover"/>
                  : <div className="w-full h-full grid place-items-center text-slate-400">No image</div>}
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="text-slate-500">ID</div><div>#{pick(detail,"id")}</div>
              <div className="text-slate-500">Họ tên</div><div>{pick(detail,"ho_ten","hoTen") ?? "—"}</div>
              <div className="text-slate-500">SĐT</div><div>{pick(detail,"so_dien_thoai","soDienThoai") ?? "—"}</div>
              <div className="text-slate-500">Email</div><div>{pick(detail,"email") ?? "—"}</div>
              <div className="text-slate-500">Vai trò</div>
              <div><RoleBadge role={pick(detail,"vai_tro","vaiTro")} /></div>
              <div className="text-slate-500">Chuyên môn</div><div>{pick(detail,"chuyen_mon","chuyenMon") ?? "—"}</div>
              <div className="text-slate-500">Chức danh</div><div>{pick(detail,"chuc_danh","chucDanh") ?? "—"}</div>
              <div className="text-slate-500">Giới tính</div><div>{pick(detail,"gioi_tinh","gioiTinh") ?? "—"}</div>
              <div className="text-slate-500">Ngày sinh</div><div>{fmtDate(pick(detail,"ngay_sinh","ngaySinh"))}</div>
              <div className="text-slate-500">Địa chỉ</div><div>{pick(detail,"dia_chi","diaChi") ?? "—"}</div>
              <div className="text-slate-500">CCCD</div><div>{pick(detail,"cccd") ?? "—"}</div>
              <div className="text-slate-500">Mã số thuế</div><div>{pick(detail,"ma_so_thue","maSoThue") ?? "—"}</div>
              <div className="text-slate-500">Ngày vào làm</div><div>{fmtDate(pick(detail,"ngay_vao_lam","ngayVaoLam"))}</div>
              <div className="text-slate-500">Số năm kinh nghiệm</div><div>{pick(detail,"so_nam_kinh_nghiem","soNamKinhNghiem") ?? "—"}</div>
              <div className="text-slate-500">Hình thức làm việc</div><div>{pick(detail,"hinh_thuc_lam_viec","hinhThucLamViec") ?? "—"}</div>
              <div className="text-slate-500">Hoạt động</div>
              <div><StatusPill on={!!pick(detail,"hoat_dong","hoatDong")} /></div>
              <div className="text-slate-500">Ghi chú</div><div>{pick(detail,"ghi_chu","ghiChu") ?? "—"}</div>
              <div className="text-slate-500">Tạo lúc</div><div>{fmtDate(pick(detail,"ngay_tao","ngayTao"))}</div>
              <div className="text-slate-500">Sửa lúc</div><div>{fmtDate(pick(detail,"ngay_sua","ngaySua"))}</div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmDel.open}
        title="Xác nhận ngưng nhân sự"
        message={
          confirmDel.row
            ? `Bạn có chắc muốn ngưng nhân sự "${confirmDel.row.hoTen || "-"}" (ID #${confirmDel.row.id})?`
            : ""
        }
        onCancel={() => setConfirmDel({ open: false, row: null })}
        onOK={doDelete}
        okText="Ngưng"
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
