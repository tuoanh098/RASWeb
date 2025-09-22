// src/pages/course/Courses.jsx
import { useEffect, useMemo, useState } from "react";
import CoursesApi from "../../lib/coursesApi.js";
import SubjectsApi from "../../lib/subjectsApi.js";

const RAS = {
  primary: "#4434C2",
  accent1: "#FF6F61",
  accent2: "#22B8B5",
  softBg: "linear-gradient(135deg,#f6f5ff 0%, #fffdf7 100%)",
};

const LoaiLopOptions = [
  { value: "ca_nhan", label: "Cá nhân" },
  { value: "nhom2",   label: "Nhóm 2" },
  { value: "nhom5",   label: "Nhóm 5" }, // theo mẫu bạn đưa
];

const Section = ({ title, right, children }) => (
  <div className="rounded-2xl overflow-hidden border shadow-sm">
    <div
      className="px-4 py-3 flex items-center justify-between"
      style={{ background: RAS.softBg, borderBottom: "1px solid #ECE9FF" }}
    >
      <h3 className="font-semibold" style={{ color: RAS.primary }}>{title}</h3>
      <div className="flex items-center gap-2">{right}</div>
    </div>
    <div className="p-3 bg-white">{children}</div>
  </div>
);

function CourseForm({ open, initial, subjects, onClose, onSaved }) {
  const [f, setF] = useState(
    initial || {
      mon_hoc_id: "",
      loai_lop: "ca_nhan",
      thoi_luong_phut: 60,
      ma: "",
      ten_hien_thi: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Công tắc auto compose: ON khi tạo mới, OFF khi sửa
  const [autoFill, setAutoFill] = useState(!initial?.id);

  useEffect(() => {
    setF(
      initial || {
        mon_hoc_id: "",
        loai_lop: "ca_nhan",
        thoi_luong_phut: 60,
        ma: "",
        ten_hien_thi: "",
      }
    );
    setAutoFill(!initial?.id);
  }, [initial]);

  // Bản đồ quy tắc sinh mã/nhãn loại lớp
  const codeMap = useMemo(() => ({ ca_nhan: "CN", nhom2: "N2", nhom5: "N5" }), []);
  const labelMap = useMemo(() => ({ ca_nhan: "cá nhân", nhom2: "nhóm 2", nhom5: "nhóm 5" }), []);

  // Tự động tạo mã + tên hiển thị khi thay đổi môn/loại lớp/thời lượng (nếu autoFill = true)
  useEffect(() => {
    if (!autoFill) return;
    const subj = (subjects || []).find((s) => String(s.id) === String(f.mon_hoc_id));
    const minutes = Number(f.thoi_luong_phut) || 0;
    const loai = f.loai_lop;

    if (!subj || !loai || !minutes) return;

    const classCode = codeMap[loai];
    const classLabel = labelMap[loai];

    const genMa = `${subj.ma_mon}_${classCode}_${minutes}`;
    const genTen = `${subj.ten_mon} — ${classLabel} — ${minutes}p`;

    // Chỉ set nếu khác để tránh re-render vô hạn
    setF((s) => ({
      ...s,
      ma: s.ma === genMa ? s.ma : genMa,
      ten_hien_thi: s.ten_hien_thi === genTen ? s.ten_hien_thi : genTen,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.mon_hoc_id, f.loai_lop, f.thoi_luong_phut, autoFill, subjects]);

  async function save() {
    try {
      setErr("");
      setSaving(true);
      const body = {
        mon_hoc_id: Number(f.mon_hoc_id) || null,
        loai_lop: f.loai_lop,
        thoi_luong_phut: Number(f.thoi_luong_phut) || null,
        ma: f.ma?.trim() || null,
        ten_hien_thi: f.ten_hien_thi?.trim() || "",
      };
      if (!body.mon_hoc_id || !body.loai_lop || !body.thoi_luong_phut || !body.ten_hien_thi) {
        setErr("Vui lòng chọn Môn học và nhập đủ thông tin bắt buộc.");
        return;
      }
      if (initial?.id) await CoursesApi.update(initial.id, body);
      else await CoursesApi.create(body);
      onSaved?.();
      onClose?.();
    } catch (e) {
      setErr(e?.message || "Lỗi lưu khoá học");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl border shadow-lg overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: RAS.softBg }}>
          <div className="font-semibold" style={{ color: RAS.primary }}>
            {initial?.id ? "Sửa khoá học" : "Tạo khoá học"}
          </div>
          <button className="px-3 py-1 rounded border" onClick={onClose}>Đóng</button>
        </div>

        <div className="p-4 space-y-3">
          {err && (
            <div className="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2">
              {err}
            </div>
          )}

          {/* Công tắc tự động */}
          <div className="flex items-center gap-2 text-sm">
            <input
              id="autoFill"
              type="checkbox"
              className="h-4 w-4"
              checked={autoFill}
              onChange={(e) => setAutoFill(e.target.checked)}
            />
            <label htmlFor="autoFill">Tự động đặt <b>Mã</b> & <b>Tên hiển thị</b> theo Môn/Loại lớp/Thời lượng</label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Dropdown Môn học */}
            <label className="text-sm">
              <div className="mb-1">Môn học *</div>
              <select
                className="border rounded w-full px-3 py-2"
                value={f.mon_hoc_id}
                onChange={(e) => setF((s) => ({ ...s, mon_hoc_id: e.target.value }))}
              >
                <option value="">-- Chọn môn --</option>
                {(subjects || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.ma_mon} — {s.ten_mon}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <div className="mb-1">Loại lớp *</div>
              <select
                className="border rounded w-full px-3 py-2"
                value={f.loai_lop}
                onChange={(e) => setF((s) => ({ ...s, loai_lop: e.target.value }))}
              >
                {LoaiLopOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <div className="mb-1">Thời lượng (phút) *</div>
              <input
                type="number"
                min={1}
                step={5}
                className="border rounded w-full px-3 py-2"
                value={f.thoi_luong_phut}
                onChange={(e) => setF((s) => ({ ...s, thoi_luong_phut: e.target.value }))}
                placeholder="vd: 45, 60"
              />
            </label>

            {/* Khi người dùng gõ tay vào hai ô này → tự động tắt autoFill để không bị override */}
            <label className="text-sm">
              <div className="mb-1">Mã khóa học</div>
              <input
                className="border rounded w-full px-3 py-2"
                value={f.ma}
                onChange={(e) => {
                  setF((s) => ({ ...s, ma: e.target.value }));
                  setAutoFill(false);
                }}
                placeholder="vd: PIANO_CN_45"
              />
            </label>

            <label className="text-sm col-span-2">
              <div className="mb-1">Tên hiển thị *</div>
              <input
                className="border rounded w-full px-3 py-2"
                value={f.ten_hien_thi}
                onChange={(e) => {
                  setF((s) => ({ ...s, ten_hien_thi: e.target.value }));
                  setAutoFill(false);
                }}
                placeholder="vd: Piano — cá nhân — 45p"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button className="px-4 py-2 rounded border" onClick={onClose}>
              Huỷ
            </button>
            <button
              className="px-4 py-2 rounded text-white disabled:opacity-50"
              style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
              onClick={save}
              disabled={saving}
            >
              {saving ? "Đang lưu…" : initial?.id ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [q, setQ] = useState("");
  const [monHocId, setMonHocId] = useState("");
  const [loaiLop, setLoaiLop] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    SubjectsApi.getAll().then(setSubjects).catch(() => {});
  }, []);

  const filters = useMemo(
    () => ({
      q: q || undefined,
      mon_hoc_id: monHocId ? Number(monHocId) : undefined,
      loai_lop: loaiLop || undefined,
    }),
    [q, monHocId, loaiLop]
  );

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const list = await CoursesApi.search(filters);
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setErr(e?.message || "Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setOpenForm(true);
  }
  function openEdit(row) {
    setEditing(row);
    setOpenForm(true);
  }
  async function onDelete(id) {
    if (!confirm("Xoá khoá học này?")) return;
    await CoursesApi.remove(id);
    load();
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm" style={{ background: RAS.softBg }}>
        <h2 className="font-semibold" style={{ color: RAS.primary }}>
          Quản lý Khóa học
        </h2>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded text-white"
            style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent1})` }}
            onClick={openCreate}
          >
            + Tạo khóa học
          </button>
        </div>
      </div>

      {/* Filters */}
      <Section
        title="Bộ lọc"
        right={
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded border"
              onClick={() => {
                setQ("");
                setMonHocId("");
                setLoaiLop("");
                load();
              }}
            >
              Xoá lọc
            </button>
            <button
              className="px-3 py-2 rounded text-white"
              style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
              onClick={load}
            >
              Tìm kiếm
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="text-sm">
            <div className="mb-1">Từ khoá</div>
            <input
              className="border rounded w-full px-3 py-2"
              placeholder="tên/ mã khóa học…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <label className="text-sm">
            <div className="mb-1">Môn học</div>
            <select
              className="border rounded w-full px-3 py-2"
              value={monHocId}
              onChange={(e) => setMonHocId(e.target.value)}
            >
              <option value="">-- Tất cả --</option>
              {(subjects || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.ma_mon} — {s.ten_mon}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <div className="mb-1">Loại lớp</div>
            <select
              className="border rounded w-full px-3 py-2"
              value={loaiLop}
              onChange={(e) => setLoaiLop(e.target.value)}
            >
              <option value="">-- Tất cả --</option>
              {LoaiLopOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              className="w-full px-3 py-2 rounded text-white"
              style={{ background: `linear-gradient(90deg, ${RAS.primary}, ${RAS.accent2})` }}
              onClick={load}
            >
              Áp dụng
            </button>
          </div>
        </div>
      </Section>

      {/* List */}
      <Section title="Danh sách khóa học">
        {err && (
          <div className="rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2 mb-2">
            Lỗi: {err}
          </div>
        )}
        {loading ? (
          "Đang tải…"
        ) : (
          <div className="overflow-auto">
            <table className="min-w-[980px] w-full">
              <thead className="bg-gray-50">
                <tr className="[&>th]:px-3 [&>th]:py-2 text-left text-sm">
                  <th>ID</th>
                  <th>Môn học (mã)</th>
                  <th>Môn học (tên)</th>
                  <th>Loại lớp</th>
                  <th>Thời lượng</th>
                  <th>Mã</th>
                  <th>Tên hiển thị</th>
                  <th className="text-right"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {(Array.isArray(items) ? items : []).map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="px-3 py-2">{it.id}</td>
                    <td className="px-3 py-2">{it.mon_hoc_ma || "—"}</td>
                    <td className="px-3 py-2">{it.mon_hoc_ten || "—"}</td>
                    <td className="px-3 py-2">{it.loai_lop}</td>
                    <td className="px-3 py-2">{it.thoi_luong_phut}’</td>
                    <td className="px-3 py-2">{it.ma || "—"}</td>
                    <td className="px-3 py-2">{it.ten_hien_thi}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        className="px-2 py-1 rounded border hover:bg-gray-50"
                        onClick={() => openEdit(it)}
                        title="Sửa"
                      >
                        Sửa
                      </button>
                      <button
                        className="px-2 py-1 text-red-600 rounded border hover:bg-red-50"
                        onClick={() => onDelete(it.id)}
                        title="Xoá"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-500" colSpan={8}>
                      Chưa có dữ liệu.
                    </td>
                  </tr>
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
        subjects={subjects}
        onClose={() => setOpenForm(false)}
        onSaved={load}
      />
    </div>
  );
}
