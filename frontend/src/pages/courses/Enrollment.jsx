// src/pages/enroll/Enrollment.jsx
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog.jsx"; // <-- chỉnh lại path nếu khác

/* ================= HTTP helpers ================= */
const API_BASE = import.meta.env.VITE_API_BASE || "";

async function apiGet(path) {
  const res = await fetch(API_BASE + path, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* ================= Utils ================= */
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function fmtVnd(v) {
  try {
    return new Intl.NumberFormat("vi-VN").format(Number(v || 0));
  } catch {
    return String(v ?? 0);
  }
}
function parseVndInput(str) {
  const digits = String(str ?? "").replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}
function pickFirst(obj, keys, fallback) {
  for (const k of keys) if (obj && obj[k] != null) return obj[k];
  return fallback;
}
function normalizeItems(raw = []) {
  return raw
    .map((r) => {
      const id =
        r.id ??
        r.hoc_vien_id ??
        r.khoa_hoc_id ??
        r.khoa_hoc_mau_id ??
        r.nhan_vien_id ??
        r.giao_vien_id ??
        r.chi_nhanh_id ??
        r.code;
      const label = pickFirst(
        r,
        ["ho_ten", "hoc_sinh", "ten", "ten_hien_thi", "name", "title", "ten_khoa", "ten_chi_nhanh"],
        `#${id}`,
      );
      const sub = pickFirst(r, ["email", "so_dien_thoai", "ma", "username"], "");
      return { id, label: String(label), sub: sub ? String(sub) : "" };
    })
    .filter((x) => x.id != null);
}
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/* ================= Async search dropdown ================= */
async function searchViaCandidates(urls = []) {
  for (const url of urls) {
    try {
      const data = await apiGet(url);
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

const fetchStudents = (q) =>
  searchViaCandidates([
    `/api/students?size=10&q=${encodeURIComponent(q)}`,
    `/api/hoc-vien?size=10&q=${encodeURIComponent(q)}`,
  ]);

const fetchRealCourses = (q) =>
  searchViaCandidates([
    `/api/khoa-hoc?size=20&q=${encodeURIComponent(q)}`,
    `/api/courses?size=20&q=${encodeURIComponent(q)}`,
    `/api/khoa-hoc/search?q=${encodeURIComponent(q)}`,
  ]);

const fetchCourseTemplates = (q) =>
  searchViaCandidates([
    `/api/khoa-hoc-mau?size=20&q=${encodeURIComponent(q)}`,
    `/api/course-templates?size=20&q=${encodeURIComponent(q)}`,
  ]);

const fetchTeachers = (q) =>
  searchViaCandidates([
    `/api/nhan-vien?role=TEACHER&size=10&q=${encodeURIComponent(q)}`,
    `/api/employees?role=TEACHER&size=10&q=${encodeURIComponent(q)}`,
  ]);

const fetchStaffs = (q) =>
  searchViaCandidates([
    `/api/nhan-vien?role=STAFF&size=10&q=${encodeURIComponent(q)}`,
    `/api/employees?role=STAFF&size=10&q=${encodeURIComponent(q)}`,
  ]);

const fetchBranches = (q) =>
  searchViaCandidates([
    `/api/chi-nhanh?size=10&q=${encodeURIComponent(q)}`,
    `/api/branches?size=10&q=${encodeURIComponent(q)}`,
  ]);

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
        if (!on) return;
        setItems(list);
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, [qDeb, open, fetcher]);

  return (
    <div className="relative">
      <button
        type="button"
        className={`w-full border rounded-xl px-3 py-2 bg-white flex items-center justify-between ${
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
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg">
          <input
            autoFocus
            className="w-full p-2 border-b outline-none rounded-t-xl"
            placeholder="Gõ để tìm..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="max-h-64 overflow-auto">
            {loading && <div className="p-2 text-sm text-gray-500">Đang tải…</div>}
            {!loading && items.length === 0 && (
              <div className="p-2 text-sm text-gray-500">Không có kết quả</div>
            )}
            {items.map((it) => (
              <button
                key={it.id}
                type="button"
                className={`w-full p-2 text-left hover:bg-slate-50 ${
                  value?.id === it.id ? "bg-indigo-50" : ""
                }`}
                onClick={() => {
                  onChange?.(it);
                  setOpen(false);
                }}
              >
                <div className="font-medium">{it.label}</div>
                {it.sub ? (
                  <div className="text-xs text-gray-500">
                    {it.sub} · #{it.id}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">#{it.id}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========= Options bảng giá ========= */
const GD_OPTIONS = [
  { value: "SO_CAP", label: "Sơ cấp" },
  { value: "SO_TRUNG_CAP_CO_BAN", label: "Sơ trung cấp cơ bản" },
  { value: "SO_TRUNG_CAP_NANG_CAO", label: "Sơ trung cấp nâng cao" },
  { value: "TRUNG_CAP", label: "Trung cấp" },
  { value: "TRUNG_CAP_CHUYEN_SAU", label: "Trung cấp chuyên sâu" },
  { value: "TIEN_CHUYEN_NGHIEP", label: "Tiền chuyên nghiệp" },
];
const CAPDO_OPTIONS = [
  { value: "PRE_GRADE", label: "Pre - Grade" },
  { value: "GRADE_1", label: "Grade 1" },
  { value: "GRADE_2", label: "Grade 2" },
  { value: "GRADE_3", label: "Grade 3" },
  { value: "GRADE_4", label: "Grade 4" },
  { value: "GRADE_5", label: "Grade 5" },
  { value: "GRADE_6", label: "Grade 6" },
  { value: "GRADE_7", label: "Grade 7" },
  { value: "GRADE_8", label: "Grade 8" },
];

/* ======================= PAGE ======================= */
export default function EnrollmentPage() {
  // chọn
  const [studentOpt, setStudentOpt] = useState(null);
  const [courseRealOpt, setCourseRealOpt] = useState(null); // bắt buộc ưu tiên
  const [courseTplOpt, setCourseTplOpt] = useState(null); // fallback (nếu backend có mapping)
  const [teacherOpt, setTeacherOpt] = useState(null);
  const [staffOpt, setStaffOpt] = useState(null);
  const [branchOpt, setBranchOpt] = useState(null);

  // filter giá
  const [giaiDoan, setGiaiDoan] = useState("SO_CAP");
  const [capDo, setCapDo] = useState("PRE_GRADE");
  const [soBuoi, setSoBuoi] = useState(12);

  // trạng thái
  const [hocPhiText, setHocPhiText] = useState("");
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [ngayDangKy, setNgayDangKy] = useState(() => todayISO());
  const [ghiChu, setGhiChu] = useState("");

  // confirm & banner
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");

  const khId = useMemo(() => {
    if (courseRealOpt?.id) return Number(courseRealOpt.id);
    // fallback từ template -> gọi detail để lấy khóa thật (nếu hệ thống bạn có)
    return null;
  }, [courseRealOpt]);

  const hoaHongPreview = useMemo(() => {
    const v = parseVndInput(hocPhiText) * 0.02;
    return Math.round(v);
  }, [hocPhiText]);

  function fmtErr(e) {
    try {
      const t = String(e?.message || e);
      if (t.startsWith("{")) {
        const o = JSON.parse(t);
        return o.message || o.error || t;
      }
      return t;
    } catch {
      return String(e);
    }
  }

  // Tự tính học phí từ bảng giá
  useEffect(() => {
    let alive = true;
    (async () => {
      setPriceError("");
      setHocPhiText("");
      if (!khId || !branchOpt?.id) return;

      setPriceLoading(true);
      try {
        const data = await apiGet(
          `/api/pricing/tuition?khoa_hoc_id=${khId}&chi_nhanh_id=${branchOpt.id}` +
            `&giai_doan=${encodeURIComponent(giaiDoan)}&cap_do=${encodeURIComponent(capDo)}&so_buoi=${soBuoi}`,
        );
        const price = Number(data?.hoc_phi_khoa || 0);
        if (!alive) return;
        if (price > 0) {
          setHocPhiText(new Intl.NumberFormat("vi-VN").format(price));
        } else {
          setPriceError("Chưa có cấu hình giá phù hợp trong bang_gia_hoc_phi_muc.");
        }
      } catch (e) {
        if (alive) setPriceError(fmtErr(e));
      } finally {
        if (alive) setPriceLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [khId, branchOpt, giaiDoan, capDo, soBuoi]);

  function validateBeforeSubmit() {
    if (!studentOpt?.id) return "Vui lòng chọn Học viên.";
    if (!khId) return "Vui lòng chọn Khóa học (thực tế).";
    if (!branchOpt?.id) return "Vui lòng chọn Chi nhánh.";
    if (!hocPhiText) return "Không lấy được học phí. Hãy kiểm tra bộ lọc giá.";
    return "";
  }

  async function submitCreate() {
    try {
      setFormError("");
      setSuccessMsg("");
      const err = validateBeforeSubmit();
      if (err) {
        setFormError(err);
        return;
      }
      const payload = {
        hoc_vien_id: Number(studentOpt.id),
        khoa_hoc_id: khId, // phải là khóa học thực tế
        giai_doan: giaiDoan,
        cap_do: capDo,
        so_buoi_khoa: soBuoi,
        chi_nhanh_id: Number(branchOpt.id), // BIGINT
        nhan_vien_tu_van_id: staffOpt?.id ? Number(staffOpt.id) : null,
        giao_vien_id: teacherOpt?.id ? Number(teacherOpt.id) : null,
        ngay_dang_ky: ngayDangKy, // yyyy-MM-dd
        hoc_phi_ap_dung: parseVndInput(hocPhiText),
        ghi_chu: ghiChu || null,
      };

      await apiPost("/api/signups", payload);
      setSuccessMsg("Đăng ký thành công!");
      // reset nhẹ ghi chú
      setGhiChu("");
    } catch (e) {
      setFormError(fmtErr(e));
    }
  }

  /* =========================== RENDER =========================== */
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Đăng ký khóa học</h1>
      </div>

      {/* banners */}
      {successMsg && (
        <div className="border rounded-xl p-3 text-sm bg-emerald-50 border-emerald-300 text-emerald-800">
          {successMsg}
        </div>
      )}
      {formError && (
        <div className="border rounded-xl p-3 text-sm bg-amber-50 border-amber-300 text-amber-800">
          {formError}
        </div>
      )}

      {/* Form */}
      <div className="bg-white/80 border rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Học viên</label>
            <AsyncSearchSelect
              value={studentOpt}
              onChange={setStudentOpt}
              placeholder="Tìm tên học viên…"
              fetcher={fetchStudents}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Khóa học (thực tế)</label>
            <AsyncSearchSelect
              value={courseRealOpt}
              onChange={setCourseRealOpt}
              placeholder="Tìm khóa học…"
              fetcher={fetchRealCourses}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Chi nhánh</label>
            <AsyncSearchSelect
              value={branchOpt}
              onChange={setBranchOpt}
              placeholder="Chọn chi nhánh…"
              fetcher={fetchBranches}
            />
          </div>

          {/* Bộ lọc bảng giá */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Giai đoạn</label>
            <select
              className="w-full border rounded-xl px-3 py-2 bg-white"
              value={giaiDoan}
              onChange={(e) => setGiaiDoan(e.target.value)}
            >
              {GD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Cấp độ (Grade)</label>
            <select
              className="w-full border rounded-xl px-3 py-2 bg-white"
              value={capDo}
              onChange={(e) => setCapDo(e.target.value)}
            >
              {CAPDO_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Số buổi khoá</label>
            <select
              className="w-full border rounded-xl px-3 py-2 bg-white"
              value={soBuoi}
              onChange={(e) => setSoBuoi(Number(e.target.value))}
            >
              {[12, 16].map((n) => (
                <option key={n} value={n}>
                  {n} buổi
                </option>
              ))}
            </select>
          </div>

          {/* Giá tự động */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Học phí khoá (VND)</label>
            <input
              readOnly
              className="w-full border rounded-xl px-3 py-2 bg-gray-50"
              value={
                priceLoading
                  ? "Đang tính giá…"
                  : hocPhiText
                  ? `${hocPhiText} đ`
                  : priceError
                  ? `⚠ ${priceError}`
                  : ""
              }
            />
            {!!hoaHongPreview && !priceLoading && !priceError && (
              <div className="text-[11px] text-gray-500 mt-1">
                Hoa hồng dự kiến (2%): <b>{fmtVnd(hoaHongPreview)} đ</b>
              </div>
            )}
          </div>

          {/* Tuỳ chọn khác */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Giáo viên (tùy chọn)</label>
            <AsyncSearchSelect
              value={teacherOpt}
              onChange={setTeacherOpt}
              placeholder="Tìm giáo viên…"
              fetcher={fetchTeachers}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nhân viên tư vấn</label>
            <AsyncSearchSelect
              value={staffOpt}
              onChange={setStaffOpt}
              placeholder="Tìm nhân viên…"
              fetcher={fetchStaffs}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ngày đăng ký</label>
            <input
              type="date"
              className="w-full border rounded-xl px-3 py-2"
              value={ngayDangKy}
              onChange={(e) => setNgayDangKy(e.target.value)}
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú</label>
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              placeholder="…"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={() => {
              const err = validateBeforeSubmit();
              if (err) {
                setFormError(err);
                return;
              }
              setConfirmOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Đăng ký
          </button>
        </div>
      </div>

      {/* Confirm */}
      <ConfirmDialog
        open={confirmOpen}
        title="Xác nhận tạo đăng ký"
        message="Bạn muốn tạo đăng ký cho học viên này?"
        confirmText="Tạo đăng ký"
        cancelText="Huỷ"
        onConfirm={submitCreate}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
