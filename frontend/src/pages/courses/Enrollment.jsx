import { useEffect, useMemo, useState } from "react";


const API_BASE = import.meta.env.VITE_API_BASE || "";

// --------------------------- http helpers ---------------------------
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

// --------------------------- utils ---------------------------
function ymNow() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
function fmtVnd(v) {
  try {
    return new Intl.NumberFormat("vi-VN").format(Number(v || 0));
  } catch {
    return String(v ?? 0);
  }
}
 function parseVndInput(str) {
   if (str == null) return 0;
   // chỉ giữ chữ số, bỏ mọi ký tự định dạng (., khoảng trắng)
   const digits = String(str).replace(/\D/g, "");
   return digits ? Number(digits) : 0;
 }
function pickFirst(obj, keys, fallback) {
  for (const k of keys) if (obj && obj[k] != null) return obj[k];
  return fallback;
}
function normalizeItems(raw = []) {
  // map to {id, label, sub}
  return raw
    .map((r) => {
      const id =
        r.id ??
        r.hoc_vien_id ??
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

// --------------------------- debounced hook ---------------------------
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// --------------------------- Async dropdown ---------------------------
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
    `/api/students/search?q=${encodeURIComponent(q)}`,
    `/api/hoc-vien/search?q=${encodeURIComponent(q)}`,
  ]);

const fetchCourses = (q) =>
  searchViaCandidates([
    `/api/khoa-hoc-mau?size=20&q=${encodeURIComponent(q)}`,
    `/api/course-templates?size=20&q=${encodeURIComponent(q)}`,
    `/api/courses/templates?q=${encodeURIComponent(q)}`,
    `/api/courses?type=template&q=${encodeURIComponent(q)}`,
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

// --------------------------- tuition auto ---------------------------
async function getTuitionAuto({ courseTemplateId, branchId, date }) {
  const d = date || new Date().toISOString().slice(0, 10);
  const tryUrls = [
    `/api/pricing/tuition?khoaHocMauId=${courseTemplateId}&chiNhanhId=${branchId}&date=${d}`,
    `/api/pricing/tuition?khoa_hoc_mau_id=${courseTemplateId}&chi_nhanh_id=${branchId}&ngay=${d}`,
    `/api/khoa-hoc-mau/${courseTemplateId}/tuition?branchId=${branchId}&date=${d}`,
    `/api/tuition?courseTemplateId=${courseTemplateId}&branchId=${branchId}&date=${d}`,
  ];
  for (const u of tryUrls) {
    try {
      const res = await apiGet(u);
      const val = Number(
        res?.hoc_phi || res?.hoc_phi_khoa || res?.hoc_phi_buoi || res?.tuition || res,
      );
      if (val > 0) return val;
    } catch {
      /* try next */
    }
  }
  // fallback: thử lấy courseId rồi hỏi bảng giá theo course
  try {
    const detail = await apiGet(`/api/khoa-hoc-mau/${courseTemplateId}`);
    const khId = detail?.khoa_hoc_id ?? detail?.khoaHocId;
    if (khId) {
      const more = [
        `/api/pricing/tuition?khoaHocId=${khId}&chiNhanhId=${branchId}&date=${d}`,
        `/api/pricing/tuition?khoa_hoc_id=${khId}&chi_nhanh_id=${branchId}&ngay=${d}`,
        `/api/banggia/lookup?khoaHocId=${khId}&chiNhanhId=${branchId}&date=${d}`,
      ];
      for (const u of more) {
        try {
          const res = await apiGet(u);
          const val = Number(
            res?.hoc_phi || res?.hoc_phi_khoa || res?.hoc_phi_buoi || res?.tuition || res,
          );
          if (val > 0) return val;
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* ignore */
  }
  return 0;
}

// --------------------------- layout helpers ---------------------------
function Section({ title, right, children }) {
  return (
    <div className="bg-white/80 border rounded-2xl p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

// =========================== PAGE ===========================
export default function EnrollmentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // form selections (objects)
  const [studentOpt, setStudentOpt] = useState(null);
  const [courseOpt, setCourseOpt] = useState(null);
  const [teacherOpt, setTeacherOpt] = useState(null);
  const [staffOpt, setStaffOpt] = useState(null);
  const [branchOpt, setBranchOpt] = useState(null);

  const [manualBranchMode, setManualBranchMode] = useState(false);
  const [branchIdText, setBranchIdText] = useState("");
  
  const [hocPhiText, setHocPhiText] = useState("");
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [autoPrice, setAutoPrice] = useState(null);
  const [ngayDangKy, setNgayDangKy] = useState(() => new Date().toISOString().slice(0, 10));
  const [ghiChu, setGhiChu] = useState("");

  // listing
  const [listStudentId, setListStudentId] = useState("");
  const [items, setItems] = useState([]);

  // monthly summary
  const [month, setMonth] = useState(ymNow());
  const [summary, setSummary] = useState({
    month: ymNow(),
    total_enrollments: 0,
    total_tuition: 0,
    total_commission_2pct: 0,
  });

  useEffect(() => {
    document.title = "Đăng ký khóa học - RAS Enrollment";
  }, []);

    useEffect(() => {
    (async () => {
      try {
        setPriceError("");
        if (courseOpt?.id && branchOpt?.id) {
          setPriceLoading(true);
          // Ưu tiên gọi backend mới ở mục B (ổn định hơn)
          const tryUrls = [
            `/api/pricing/tuition?khoa_hoc_mau_id=${courseOpt.id}&chi_nhanh_id=${branchOpt.id}&ngay=${ngayDangKy}`,
            `/api/pricing/tuition?khoaHocMauId=${courseOpt.id}&chiNhanhId=${branchOpt.id}&date=${ngayDangKy}`,
          ];
          let price = 0;
          for (const u of tryUrls) {
            try {
              const r = await apiGet(u);
              price = Number(r?.hoc_phi || 0);
              if (price > 0) break;
            } catch {/* thử URL tiếp theo */}
          }
          // fallback sang client logic cũ nếu backend chưa có
          if (!(price > 0)) {
            const v = await getTuitionAuto({ courseTemplateId: courseOpt.id, branchId: branchOpt.id, date: ngayDangKy });
            price = Number(v || 0);
          }

          setAutoPrice(price > 0 ? price : null);
          setHocPhiText(price > 0 ? new Intl.NumberFormat("vi-VN").format(price) : "");
          if (!(price > 0)) setPriceError("Chưa thiết lập bảng giá cho chi nhánh/khóa này.");
        } else {
          setAutoPrice(null);
          setHocPhiText("");
        }
      } catch {
        setPriceError("Không lấy được học phí tự động.");
      } finally {
        setPriceLoading(false);
      }
    })();
  }, [courseOpt, branchOpt, ngayDangKy]);

  useEffect(() => {
    // load summary on month change
    (async () => {
      try {
        setError("");
        const data = await apiGet(`/api/signups/summary?month=${encodeURIComponent(month)}`);
        setSummary(data);
      } catch (e) {
        setError(normalizeErr(e));
      }
    })();
  }, [month]);

  // auto tuition when course + branch chosen
  useEffect(() => {
    (async () => {
      try {
        if (courseOpt?.id && branchOpt?.id) {
          const v = await getTuitionAuto({
            courseTemplateId: courseOpt.id,
            branchId: branchOpt.id,
            date: ngayDangKy,
          });
          if (v > 0) setHocPhiText(new Intl.NumberFormat("vi-VN").format(v));
        }
      } catch {
        /* ignore */
      }
    })();
  }, [courseOpt, branchOpt, ngayDangKy]);

  const hoaHongPreview = useMemo(() => {
    const v = parseVndInput(hocPhiText) * 0.02;
    return Math.round(v);
  }, [hocPhiText]);

  // ---------------- actions ----------------
  async function handleCreate(e) {
    e?.preventDefault?.();
    setError("");
    setNotice("");

    if (!studentOpt?.id || !courseOpt?.id) {
      setError("Vui lòng chọn Học viên và Khóa học.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        hoc_vien_id: Number(studentOpt.id),
        khoa_hoc_mau_id: Number(courseOpt.id),
        nhan_vien_tu_van_id: staffOpt?.id ? Number(staffOpt.id) : null,
        giao_vien_id: teacherOpt?.id ? Number(teacherOpt.id) : null,
        chi_nhanh_id: branchOpt?.id ? Number(branchOpt.id) : null,
        hoc_phi_ap_dung: parseVndInput(hocPhiText),
        ngay_dang_ky: ngayDangKy, // yyyy-mm-dd
        ghi_chu: ghiChu || null,
      };

      const created = await apiPost("/api/signups", payload);
      setNotice(
        `Đăng ký thành công cho học viên mới`,
      );

      if (String(listStudentId) === String(payload.hoc_vien_id)) {
        await loadListByStudent(listStudentId);
      }
      await loadSummary(month);

      // reset nhẹ
      // (giữ selections để có thể tạo tiếp cho cùng học viên/chi nhánh)
      setHocPhiText("");
      setGhiChu("");
    } catch (e2) {
      setError(normalizeErr(e2));
    } finally {
      setLoading(false);
    }
  }

  async function loadListByStudent(studentId) {
    if (!studentId) return;
    setError("");
    try {
      const data = await apiGet(`/api/signups?studentId=${encodeURIComponent(studentId)}`);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(normalizeErr(e));
    }
  }

  async function loadSummary(ym) {
    try {
      const data = await apiGet(`/api/signups/summary?month=${encodeURIComponent(ym)}`);
      setSummary(data);
    } catch (e) {
      setError(normalizeErr(e));
    }
  }

  function normalizeErr(err) {
    try {
      const msg = String(err?.message || err);
      if (msg.startsWith("{")) {
        const obj = JSON.parse(msg);
        return obj.message || msg;
      }
      return msg;
    } catch {
      return String(err);
    }
  }

  // ---------------- render ----------------
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Đăng ký khóa học</h1>
        <span className="text-sm text-gray-500">Quản lý đăng ký khóa học</span>
      </div>

      {(error || notice) && (
        <div
          className={`border rounded-xl p-3 text-sm ${
            error
              ? "bg-amber-50 border-amber-300 text-amber-800"
              : "bg-emerald-50 border-emerald-300 text-emerald-800"
          }`}
        >
          {error || notice}
        </div>
      )}

      {/* Create form */}
      <Section
        title="Tạo đăng ký mới"
        right={
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        }
      >
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Khóa học</label>
            <AsyncSearchSelect
              value={courseOpt}
              onChange={setCourseOpt}
              placeholder="Chọn mẫu khoá học…"
              fetcher={fetchCourses}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Giáo viên (tùy chọn)
            </label>
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Chi nhánh</label>
            <AsyncSearchSelect
              value={branchOpt}
              onChange={setBranchOpt}
              placeholder="Chọn chi nhánh…"
              fetcher={fetchBranches}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Học phí (VND)</label>
            <input
              inputMode="numeric"
              value={hocPhiText}
              onChange={(e) => setHocPhiText(e.target.value)} // vẫn giữ để khi auto đổ giá cập nhật UI
              placeholder={priceLoading ? "Đang tính giá..." : "Tự động theo bảng giá"}
              className="w-full border rounded-xl px-3 py-2 bg-gray-50"
              readOnly
              disabled
              title="Học phí tự động từ bảng giá — không cho sửa tay"
            />
            <div className="text-xs text-gray-500 mt-1">
              HH dự kiến: <b>{fmtVnd(hoaHongPreview)}</b>đ
            </div>
            {priceLoading && <div className="text-[11px] text-gray-500 mt-1">Đang lấy học phí…</div>}
            {priceError && !priceLoading && <div className="text-[11px] text-amber-700 mt-1">{priceError}</div>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ngày đăng ký</label>
            <input
              type="date"
              value={ngayDangKy}
              onChange={(e) => setNgayDangKy(e.target.value)}
              className="w-full border rounded-xl px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú</label>
            <input
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              placeholder="..."
              className="w-full border rounded-xl px-3 py-2"
            />
          </div>

          <div className="md:col-span-1 text-xs text-gray-500">
            Lưu ý: Hệ thống tự cộng hoa hồng <b>2%</b> cho NV tư vấn
          </div>
        </div>
      </Section>

      {/* List by student */}
      <Section
        title="Các khóa học học viên đã đăng ký"
        right={
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={listStudentId}
              onChange={(e) => setListStudentId(e.target.value)}
              placeholder="Học viên ID"
              className="w-40 border rounded-xl px-3 py-2"
            />
            <button
              onClick={() => loadListByStudent(listStudentId)}
              className="px-3 py-2 rounded-xl bg-slate-700 text-white hover:bg-slate-800"
            >
              Tải danh sách
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-slate-50">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Ngày</th>
                <th className="px-3 py-2">Học viên</th>
                <th className="px-3 py-2">Khóa học</th>
                <th className="px-3 py-2">Học phí</th>
                <th className="px-3 py-2">Giáo viên</th>
                <th className="px-3 py-2">NV tư vấn</th>
                <th className="px-3 py-2">Hh</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-gray-500">
                    Chưa có dữ liệu.
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">#{r.id}</td>
                    <td className="px-3 py-2">{r.ngay_dang_ky}</td>
                    <td className="px-3 py-2">{r.hoc_vien_id}</td>
                    <td className="px-3 py-2">{r.khoa_hoc_mau_id}</td>
                    <td className="px-3 py-2">{fmtVnd(r.hoc_phi_ap_dung)} đ</td>
                    <td className="px-3 py-2">{r.giao_vien_id ?? "-"}</td>
                    <td className="px-3 py-2">{r.nhan_vien_tu_van_id ?? "-"}</td>
                    <td className="px-3 py-2 font-medium">{fmtVnd(r.hoa_hong_2pct)} đ</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Monthly summary */}
      <Section
        title="Tổng đăng ký theo tháng"
        right={
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border rounded-xl px-3 py-2"
            />
            <button
              onClick={() => loadSummary(month)}
              className="px-3 py-2 rounded-xl bg-slate-700 text-white hover:bg-slate-800"
            >
              Làm mới
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-xl p-4 bg-slate-50">
            <div className="text-xs text-gray-500">Tháng/Năm</div>
            <div className="text-xl font-semibold">{summary?.month || month}</div>
          </div>
          <div className="border rounded-xl p-4 bg-slate-50">
            <div className="text-xs text-gray-500">Tổng đăng ký</div>
            <div className="text-xl font-semibold">{summary?.total_enrollments ?? 0}</div>
          </div>
          <div className="border rounded-xl p-4 bg-slate-50">
            <div className="text-xs text-gray-500">Tổng học phí</div>
            <div className="text-xl font-semibold">{fmtVnd(summary?.total_tuition)} đ</div>
            <div className="text-xs text-gray-500 mt-1">
              Phí hoa hồng: <b>{fmtVnd(summary?.total_commission_2pct)} đ</b>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
