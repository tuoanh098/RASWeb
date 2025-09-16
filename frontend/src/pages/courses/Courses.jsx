// src/pages/course/Course.jsx
import { useEffect, useMemo, useState } from "react";
import CoursesApi from "../../lib/coursesApi.js";
const RAS = {
  primary: "#4434C2",
  accent1: "#FF6F61",
  accent2: "#22B8B5",
  softBg: "linear-gradient(135deg,#f6f5ff 0%, #fffdf7 100%)",
};

const LoaiLopOptions = [
  { value: "ca_nhan", label: "Cá nhân" },
  { value: "nhom2", label: "Nhóm 2" },
  { value: "nhom3_4", label: "Nhóm 3-4" },
  { value: "nhom5_8", label: "Nhóm 5-8" },
];

const Section = ({ title, right, children }) => (
  <div className="rounded-2xl overflow-hidden border shadow-sm">
    <div className="px-4 py-3 flex items-center justify-between" style={{ background: RAS.softBg, borderBottom: "1px solid #ECE9FF" }}>
      <h3 className="font-semibold" style={{ color: RAS.primary }}>{title}</h3>
      <div className="flex items-center gap-2">{right}</div>
    </div>
    <div className="p-3 bg-white">{children}</div>
  </div>
);

function CourseForm({ open, initial, onClose, onSaved }) {
  const [f, setF] = useState(initial || { mon_hoc_id: "", loai_lop: "ca_nhan", thoi_luong_phut: 60, ma: "", ten_hien_thi: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { setF(initial || { mon_hoc_id: "", loai_lop: "ca_nhan", thoi_luong_phut: 60, ma: "", ten_hien_thi: "" }); }, [initial]);

  async function save() {
    try {
      setErr(""); setSaving(true);
      const body = {
        mon_hoc_id: Number(f.mon_hoc_id) || null,
        loai_lop: f.loai_lop,
        thoi_luong_phut: Number(f.thoi_luong_phut) || null,
        ma: f.ma?.trim() || null,
        ten_hien_thi: f.ten_hien_thi?.trim() || "",
      };
      if (!body.mon_hoc_id || !body.loai_lop || !body.thoi_luong_phut || !body.ten_hien_thi) {
        setErr("Vui lòng nhập đủ thông tin bắt buộc."); return;
      }
      if (initial?.id) await CoursesApi.update(initial.id, body);
      else await CoursesApi.create(body);
      onSaved?.();
      onClose?.();
    } catch (e) {
      setErr(e?.message || "Lỗi lưu khoá học");
    } finally { setSaving(false); }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl border shadow-lg overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: RAS.softBg }}>
          <div className="font-semibold" style={{ color: RAS.primary }}>{initial?.id ? "Sửa khoá học" : "Tạo khoá học"}</div>
          <button className="px-3 py-1 rounded border" onClick={onClose}>Đóng</button>
        </div>
        <div className="p-4 space-y-3">
          {err && <div className="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2">{err}</div>}
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              <div className="mb-1">Môn học ID *</div>
              <input className="border rounded w-full px-3 py-2" value={f.mon_hoc_id}
                onChange={e=>setF(s=>({...s, mon_hoc_id:e.target.value}))} placeholder="vd: 101" />
            </label>
            <label className="text-sm">
              <div className="mb-1">Loại lớp *</div>
              <select className="border rounded w-full px-3 py-2" value={f.loai_lop}
                onChange={e=>setF(s=>({...s, loai_lop:e.target.value}))}>
                {LoaiLopOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
            <label className="text-sm">
              <div className="mb-1">Thời lượng (phút) *</div>
              <input className="border rounded w-full px-3 py-2" value={f.thoi_luong_phut}
                onChange={e=>setF(s=>({...s, thoi_luong_phut:e.target.value}))} placeholder="vd: 60" />
            </label>
            <label className="text-sm">
              <div className="mb-1">Mã khóa học</div>
              <input className="border rounded w-full px-3 py-2" value={f.ma}
                onChange={e=>setF(s=>({...s, ma:e.target.value}))} placeholder="vd: PIANO60_CN" />
            </label>
            <label className="text-sm col-span-2">
              <div className="mb-1">Tên hiển thị *</div>
              <input className="border rounded w-full px-3 py-2" value={f.ten_hien_thi}
                onChange={e=>setF(s=>({...s, ten_hien_thi:e.target.value}))} placeholder="vd: Piano 1-1 60 phút" />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button className="px-4 py-2 rounded border" onClick={onClose}>Huỷ</button>
            <button className="px-4 py-2 rounded text-white disabled:opacity-50"
              style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
              onClick={save} disabled={saving}>
              {saving ? "Đang lưu…" : (initial?.id ? "Cập nhật" : "Tạo mới")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursePage() {
  const [q, setQ] = useState("");
  const [monHocId, setMonHocId] = useState("");
  const [loaiLop, setLoaiLop] = useState("");
  const [thoiLuong, setThoiLuong] = useState("");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const filters = useMemo(() => ({
    q: q || undefined,
    mon_hoc_id: monHocId ? Number(monHocId) : undefined,
    loai_lop: loaiLop || undefined,
    thoi_luong_phut: thoiLuong ? Number(thoiLuong) : undefined,
  }), [q, monHocId, loaiLop, thoiLuong]);

  async function load() {
    try {
      setErr(""); setLoading(true);
      const list = await CoursesApi.search(filters);
      setItems(list || []);
    } catch (e) {
      setErr(e?.message || "Lỗi tải danh sách");
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  function openCreate() { setEditing(null); setOpenForm(true); }
  function openEdit(row) { setEditing(row); setOpenForm(true); }

  async function onDelete(id) {
    if (!confirm("Xoá khoá học này?")) return;
    await CoursesApi.remove(id);
    load();
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm" style={{ background: RAS.softBg }}>
        <h2 className="font-semibold" style={{ color: RAS.primary }}>Quản lý Khóa học</h2>
        <div className="text-sm opacity-80">RAS Academics · courses</div>
      </div>

      {/* Filters */}
      <Section
        title="Bộ lọc"
        right={
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded border" onClick={()=>{ setQ(""); setMonHocId(""); setLoaiLop(""); setThoiLuong(""); load(); }}>
              Xoá lọc
            </button>
            <button className="px-3 py-2 rounded text-white" style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }} onClick={load}>
              Tìm kiếm
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="text-sm">
            <div className="mb-1">Từ khoá</div>
            <input className="border rounded w-full px-3 py-2" placeholder="tên/ mã khóa học…" value={q} onChange={e=>setQ(e.target.value)} />
          </label>
          <label className="text-sm">
            <div className="mb-1">Môn học ID</div>
            <input className="border rounded w-full px-3 py-2" placeholder="vd 101" value={monHocId} onChange={e=>setMonHocId(e.target.value)} />
          </label>
          <label className="text-sm">
            <div className="mb-1">Loại lớp</div>
            <select className="border rounded w-full px-3 py-2" value={loaiLop} onChange={e=>setLoaiLop(e.target.value)}>
              <option value="">-- Tất cả --</option>
              {LoaiLopOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <div className="mb-1">Thời lượng (phút)</div>
            <input className="border rounded w-full px-3 py-2" placeholder="vd 60" value={thoiLuong} onChange={e=>setThoiLuong(e.target.value)} />
          </label>
        </div>
      </Section>

      {/* List */}
      <Section
        title="Danh sách khóa học"
        right={<button className="px-3 py-2 rounded text-white" style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }} onClick={openCreate}>+ Tạo khóa học</button>}
      >
        {err && <div className="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2 mb-2">Lỗi: {err}</div>}
        {loading ? "Đang tải…" : (
          <div className="overflow-auto">
            <table className="min-w-[840px] w-full">
              <thead className="bg-gray-50">
                <tr className="[&>th]:px-3 [&>th]:py-2 text-left text-sm">
                  <th>ID</th>
                  <th>Môn học ID</th>
                  <th>Loại lớp</th>
                  <th>Thời lượng</th>
                  <th>Mã</th>
                  <th>Tên hiển thị</th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {items.map(it => (
                  <tr key={it.id} className="border-t">
                    <td className="px-3 py-2">{it.id}</td>
                    <td className="px-3 py-2">{it.mon_hoc_id}</td>
                    <td className="px-3 py-2">{it.loai_lop}</td>
                    <td className="px-3 py-2">{it.thoi_luong_phut}’</td>
                    <td className="px-3 py-2">{it.ma || "—"}</td>
                    <td className="px-3 py-2">{it.ten_hien_thi}</td>
                    <td className="px-3 py-2 text-right">
                      <button className="px-2 py-1 rounded hover:bg-gray-50" onClick={()=>openEdit(it)}>Sửa</button>
                      <button className="px-2 py-1 text-red-600 rounded hover:bg-red-50" onClick={()=>onDelete(it.id)}>Xoá</button>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr><td className="px-3 py-6 text-center text-gray-500" colSpan={7}>Chưa có dữ liệu.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Form modal */}
      <CourseForm
        open={openForm}
        initial={editing}
        onClose={()=>setOpenForm(false)}
        onSaved={load}
      />

      {/* (Tuỳ chọn) Preview giá áp dụng khi đang sửa */}
      {editing?.id && (
        <Section title="Giá đang áp dụng" right={<button className="px-2 py-1 rounded border" onClick={()=>CoursesApi.pricing(editing.id).then(console.log)}>Debug API</button>}>
          <div className="text-sm text-gray-600">Nếu muốn hiển thị chi tiết bảng giá, mình có thể render thêm table từ <code>/api/courses/{editing.id}/pricing</code>.</div>
        </Section>
      )}
    </div>
  );
}
