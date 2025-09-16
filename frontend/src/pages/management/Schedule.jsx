// src/pages/management/Schedule.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/* ========== Date helpers ========== */
const HOUR_START = 7;   // 7:00
const HOUR_END   = 21;  // 21:00
const MIN_SLOT   = 30;  // phút/ô

function startOfWeek(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (x.getDay() + 6) % 7; // Mon=0..Sun=6
  x.setDate(x.getDate() - dow);
  x.setHours(0,0,0,0);
  return x;
}
const addDays  = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const addMins  = (d, m) => new Date(d.getTime() + m*60000);
const fmtHour  = (h, m=0) => `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
const toISODate = (d) => new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);
const toISOTime = (d) => new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(11,16);
const parseISO  = (s) => { const [Y,M,D] = s.split("-").map(Number); return new Date(Y, M-1, D); };

/* ========== HTTP helpers (self-contained) ========== */
async function httpGet(url){ const r=await fetch(url); if(!r.ok) throw new Error(await r.text()); return r.json(); }
async function httpPost(url, body){ const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
// --- Enrollment/course lookup (thêm mới) ---
async function getCourseNameFromTemplateId(id) {
  // Trả về mo_ta hoặc tên khoá
  const detailTry = [
    `/api/khoa-hoc-mau/${id}`,
    `/api/course-templates/${id}`,
  ];
  for (const u of detailTry) {
    try {
      const d = await httpGet(u);
      // Ưu tiên mo_ta, sau đó ten/ten_khoa
      return (
        d?.mo_ta ||
        d?.ten ||
        d?.ten_khoa ||
        d?.name ||
        `#${id}`
      );
    } catch { /* thử URL khác */ }
  }
  return `#${id}`;
}

/**
 * Lấy danh sách khóa học (mẫu) của học viên theo giáo viên đã chọn
 * - Tìm trong bảng dang_ky_khoa_hoc (signups)
 * - Với mỗi khoa_hoc_mau_id -> tra tên từ bảng khoa_hoc_mau (mo_ta/ten)
 * - Trả về mảng [{id,label,sub}]
 */
async function fetchStudentCoursesForTeacher(studentId, teacherId) {
  if (!studentId) return [];
  const tryUrls = [
    `/api/signups?studentId=${studentId}${teacherId ? `&teacherId=${teacherId}` : ""}`,
    `/api/dang-ky-khoa-hoc?hoc_vien_id=${studentId}${teacherId ? `&giao_vien_id=${teacherId}` : ""}`,
  ];
  let rows = [];
  for (const u of tryUrls) {
    try {
      const data = await httpGet(u);
      rows = Array.isArray(data) ? data
           : Array.isArray(data?.items) ? data.items
           : Array.isArray(data?.content) ? data.content
           : [];
      if (rows.length) break;
    } catch { /* thử URL khác */ }
  }
  // gom theo khoa_hoc_mau_id (unique)
  const byTemplate = new Map();
  for (const r of rows) {
    const templateId = r.khoa_hoc_mau_id ?? r.khoaHocMauId ?? r.courseTemplateId;
    if (!templateId) continue;
    // giữ enroll id/branch để hiển thị phụ
    if (!byTemplate.has(templateId)) byTemplate.set(templateId, r);
  }
  // dựng danh sách chọn
  const out = [];
  for (const [templateId, r] of byTemplate.entries()) {
    const label = await getCourseNameFromTemplateId(templateId);
    const branch = r.chi_nhanh_id ?? r.chiNhanhId;
    const sub = [
      branch ? `CN #${branch}` : null,
      r.hoc_phi_ap_dung != null ? `${Number(r.hoc_phi_ap_dung).toLocaleString("vi-VN")}đ` : null,
    ].filter(Boolean).join(" · ");
    out.push({ id: templateId, label: String(label), sub });
  }
  // sắp xếp theo tên
  out.sort((a,b)=>a.label.localeCompare(b.label,'vi'));
  return out;
}

/* ========== API ========== */
const Api = {
  week: async ({ start, filters }) => {
    const p = new URLSearchParams({ start });
    if (filters?.studentId) p.set("studentId", filters.studentId);
    if (filters?.teacherId) p.set("teacherId", filters.teacherId);
    if (filters?.branchId)  p.set("branchId",  filters.branchId);
    if (filters?.q)         p.set("q",        filters.q);
    return httpGet(`/api/xep-lop/week?${p.toString()}`);
  },
  createOne: (payload) => httpPost(`/api/xep-lop`, payload),
  createRecurring: (payload) => httpPost(`/api/xep-lop/recurring`, payload),
};

/* ========== Small utils ========== */
function useDebounce(v, ms=350){ const [s,setS]=useState(v); useEffect(()=>{ const t=setTimeout(()=>setS(v),ms); return ()=>clearTimeout(t);},[v,ms]); return s; }
function pickFirst(o, keys, fb){ for(const k of keys) if(o && o[k]!=null) return o[k]; return fb; }
function normalizeItems(raw=[]){
  return raw.map(r=>{
    const id = r.id ?? r.hoc_vien_id ?? r.giao_vien_id ?? r.chi_nhanh_id ?? r.khoa_hoc_mau_id ?? r.code;
    const label = pickFirst(r,["ho_ten","ten","ten_hien_thi","name","title","ten_chi_nhanh","ten_khoa"], `#${id}`);
    const sub = pickFirst(r,["email","so_dien_thoai","ma","username"], "");
    return { id, label: String(label), sub: sub?String(sub):"" };
  }).filter(x=>x.id!=null);
}
async function searchVia(urls=[]){
  for(const u of urls){
    try{
      const data = await httpGet(u);
      const list = Array.isArray(data)?data: Array.isArray(data?.items)?data.items: Array.isArray(data?.content)?data.content: [];
      const n = normalizeItems(list);
      if(n.length) return n;
    }catch{/* try next */}
  }
  return [];
}
const fetchStudents = (q)=>searchVia([
  `/api/students?size=10&q=${encodeURIComponent(q)}`,
  `/api/hoc-vien?size=10&q=${encodeURIComponent(q)}`
]);
const fetchTeachers = (q)=>searchVia([
  `/api/nhan-vien?role=TEACHER&size=10&q=${encodeURIComponent(q)}`,
  `/api/employees?role=TEACHER&size=10&q=${encodeURIComponent(q)}`
]);
const fetchBranches = (q)=>searchVia([
  `/api/chi-nhanh?size=10&q=${encodeURIComponent(q)}`,
  `/api/branches?size=10&q=${encodeURIComponent(q)}`
]);
const fetchCourses = (q)=>searchVia([
  `/api/khoa-hoc-mau?size=20&q=${encodeURIComponent(q)}`,
  `/api/course-templates?size=20&q=${encodeURIComponent(q)}`
]);

/* ========== AsyncSearchSelect (inline, giống Enrollment) ========== */
function AsyncSearchSelect({ value, onChange, placeholder="Tìm...", fetcher, disabled }){
  const [q,setQ]=useState(""); const qDeb=useDebounce(q,350);
  const [open,setOpen]=useState(false); const [items,setItems]=useState([]); const [loading,setLoading]=useState(false);
  useEffect(()=>{ let on=true; (async()=>{ if(!open) return; setLoading(true);
    try{ const list=await fetcher(qDeb||""); if(on) setItems(list);} finally{ if(on) setLoading(false); }
  })(); return ()=>{on=false;} },[qDeb,open,fetcher]);
  return (
    <div className="relative">
      <button type="button" disabled={disabled}
        onClick={()=>!disabled && setOpen(s=>!s)}
        className={`w-full border rounded-xl px-3 py-2 bg-white text-left ${disabled?"opacity-60":""}`}>
        {value ? (<><span className="font-medium">{value.label}</span>{value.sub && <span className="text-xs text-gray-500 ml-2">{value.sub}</span>}</>) : <span className="text-gray-400">{placeholder}</span>}
        <span className="float-right text-gray-400">▾</span>
      </button>
      {open && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg">
          <input autoFocus className="w-full p-2 border-b outline-none rounded-t-xl" placeholder="Gõ để tìm..." value={q} onChange={(e)=>setQ(e.target.value)} />
          <div className="max-h-64 overflow-auto">
            {loading && <div className="p-2 text-sm text-gray-500">Đang tải…</div>}
            {!loading && items.length===0 && <div className="p-2 text-sm text-gray-500">Không có kết quả</div>}
            {items.map(it=>(
              <button key={it.id} type="button" onClick={()=>{onChange?.(it); setOpen(false);}}
                className={`w-full p-2 text-left hover:bg-slate-50 ${value?.id===it.id?"bg-indigo-50":""}`}>
                <div className="font-medium">{it.label}</div>
                <div className="text-xs text-gray-500">{it.sub?`${it.sub} · #${it.id}`:`#${it.id}`}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== Create Panel ========== */
function CreatePanel({ open, onClose, initial, onSave }) {
  // ... các state có sẵn
  const [title, setTitle] = useState("");
  const [date,  setDate]  = useState(toISODate(initial?.start || new Date()));
  const [time1, setTime1] = useState(toISOTime(initial?.start || new Date()));
  const [time2, setTime2] = useState(toISOTime(initial?.end || addMins(new Date(), 60)));

  const [student, setStudent] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [branch,  setBranch]  = useState(null);

  // === Khóa học: lấy theo học viên + giáo viên ===
  const [course, setCourse] = useState(null);
  const [courseOpts, setCourseOpts] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState("");

  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      // reset khi mở
      setCourse(null);
      setCourseOpts([]);
      setCourseError("");
      const s = initial?.start || new Date();
      const e = initial?.end || addMins(s, 60);
      setDate(toISODate(s));
      setTime1(toISOTime(s));
      setTime2(toISOTime(e));
    }
  }, [open, initial]);

  // Khi đã chọn Học viên (+ có/không có Giáo viên), tự tải danh sách khóa đã đăng ký
  useEffect(() => {
    (async () => {
      setCourseError("");
      setCourseOpts([]);
      setCourse(null);
      if (!student?.id) return;
      setCourseLoading(true);
      try {
        const list = await fetchStudentCoursesForTeacher(student.id, teacher?.id);
        setCourseOpts(list);
        // Nếu chỉ có 1 khoá → tự chọn luôn
        if (list.length === 1) setCourse(list[0]);
      } catch (e) {
        setCourseError("Không lấy được danh sách khóa học đã đăng ký.");
      } finally {
        setCourseLoading(false);
      }
    })();
  }, [student?.id, teacher?.id]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/20 z-30 flex items-start justify-center p-4 md:p-10" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl" onClick={(e)=>e.stopPropagation()}>
        {/* header, time, student/teacher/branch giữ nguyên ... */}

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ... các input khác ... */}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Học viên</label>
            <AsyncSearchSelect value={student} onChange={setStudent} fetcher={fetchStudents} placeholder="Tìm học viên…" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Giáo viên</label>
            <AsyncSearchSelect value={teacher} onChange={setTeacher} fetcher={fetchTeachers} placeholder="Tìm giáo viên…" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Chi nhánh</label>
            <AsyncSearchSelect value={branch} onChange={setBranch} fetcher={fetchBranches} placeholder="Chọn chi nhánh…" />
          </div>

          {/* === Khóa học (đã lọc theo học viên & giáo viên) === */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Khóa học (đã đăng ký)</label>
            <AsyncSearchSelect
              value={course}
              onChange={setCourse}
              placeholder={courseLoading ? "Đang tải..." : "Chọn khóa đã đăng ký…"}
              fetcher={async () => courseOpts} // dùng danh sách đã tải
              disabled={!student?.id || courseLoading}
            />
            {courseError && <div className="text-[11px] text-amber-700 mt-1">{courseError}</div>}
            {!courseError && !courseLoading && student?.id && courseOpts.length === 0 && (
              <div className="text-[11px] text-gray-500 mt-1">Học viên chưa đăng ký khóa nào.</div>
            )}
          </div>

          {/* Ghi chú */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú</label>
            <input className="w-full border rounded-xl px-3 py-2" value={note} onChange={(e)=>setNote(e.target.value)} placeholder="..." />
          </div>
        </div>

        <div className="p-4 border-t flex items-center justify-end gap-2">
          <button className="px-4 py-2 rounded-xl border" onClick={onClose}>Huỷ</button>
          <button
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={!student?.id || !teacher?.id || !branch?.id || !course?.id}
            onClick={()=>{
              if(!student?.id || !teacher?.id || !branch?.id || !course?.id){
                alert("Chọn Học viên / Giáo viên / Chi nhánh / Khóa học.");
                return;
              }
              const payload = {
                hoc_vien_id: Number(student.id),
                hoc_vien_ten: student.label,
                giao_vien_id: Number(teacher.id),
                giao_vien_ten: teacher.label,
                chi_nhanh_id: Number(branch.id),
                chi_nhanh_ten: branch.label,

                // KHÔNG còn dang_ky_khoa_hoc_id
                khoa_hoc_mau_id: Number(course.id), // <— id template
                khoa_hoc_ten: course.label,         // <— mo_ta/ten_khoa

                ngay: date,
                bat_dau_luc: time1 + ":00",
                ket_thuc_luc: time2 + ":00",
                ghi_chu: title ? `${title}${note?` · ${note}`:""}` : (note||""),
              };
              onSave?.(payload);
            }}
          >Lưu</button>
        </div>
      </div>
    </div>
  );
}



/* ========== Calendar grid (week) ========== */
function HourLines(){
  const rows=[];
  for(let h=HOUR_START; h<=HOUR_END; h++){
    rows.push(
      <div key={h} className="relative h-12 border-t last:border-b">
        <div className="absolute -left-1 -top-2 text-[11px] text-gray-400 select-none">{fmtHour(h)}</div>
      </div>
    );
  }
  return <>{rows}</>;
}

function DayColumn({ day, events, onSelectSlot }){
  // click chọn slot 60'
  return (
    <div className="border-l last:border-r">
      {Array.from({length: (HOUR_END-HOUR_START+1)* (60/MIN_SLOT)}, (_,i)=>{
        const mins = i*MIN_SLOT + HOUR_START*60;
        const h = Math.floor(mins/60), m = mins%60;
        return (
          <div key={i}
            className="h-6 border-t hover:bg-indigo-50/40 cursor-pointer"
            onClick={()=>{
              const start = new Date(day);
              start.setHours(h,m,0,0);
              const end = addMins(start, 60);
              onSelectSlot?.(start, end);
            }}
            title={`${fmtHour(h,m)} – ${fmtHour(h, m+MIN_SLOT)}`}
          />
        );
      })}
      {/* render events (simple pills) */}
      {events.map((ev,idx)=>{
        const s = new Date(`${ev.ngay}T${(ev.bat_dau_luc||"00:00").slice(0,5)}:00`);
        const e = new Date(`${ev.ngay}T${(ev.ket_thuc_luc||"00:00").slice(0,5)}:00`);
        const topMin = (s.getHours()*60+s.getMinutes()) - HOUR_START*60;
        const durMin = Math.max(30,(e - s)/60000);
        const top  = Math.max(0, (topMin/ MIN_SLOT)*24);  // 24px per 30'
        const height = Math.max(24, (durMin/ MIN_SLOT)*24 - 2);
        return (
          <div key={idx}
               className="absolute left-1 right-1 rounded-md bg-indigo-600/90 text-white text-[12px] px-2 py-1 shadow"
               style={{ top, height }}>
            <div className="font-semibold">{(ev.hoc_vien_ten||"")} · {(ev.giao_vien_ten||"")}</div>
            <div className="opacity-90">{(ev.bat_dau_luc||"").slice(0,5)}–{(ev.ket_thuc_luc||"").slice(0,5)} · {ev.khoa_hoc_ten||""}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ========== Page ========== */
export default function Schedule(){
  const [week0, setWeek0] = useState(startOfWeek());
  const [list, setList]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // filter bar (tối giản)
  const [studentF, setStudentF] = useState(null);
  const [teacherF, setTeacherF] = useState(null);
  const [branchF,  setBranchF]  = useState(null);
  const [q, setQ] = useState("");
  const qDeb = useDebounce(q, 300);

  // create panel state
  const [createOpen, setCreateOpen] = useState(false);
  const createInitRef = useRef({});

  const weekISO = useMemo(()=>toISODate(week0),[week0]);
  const days    = useMemo(()=>Array.from({length:7},(_,i)=>addDays(week0,i)),[week0]);

  async function load(){
    setLoading(true); setErr("");
    try{
      const data = await Api.week({
        start: weekISO,
        filters: {
          studentId: studentF?.id, teacherId: teacherF?.id, branchId: branchF?.id, q: qDeb || undefined
        }
      });
      setList(Array.isArray(data)?data:[]);
    }catch(e){ setErr(e.message||"Lỗi tải lịch"); }
    finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); /* eslint-disable-next-line */ },[weekISO, studentF, teacherF, branchF, qDeb]);

  const grouped = useMemo(()=>{
    const m = new Map();
    for(const x of list){ if(!m.has(x.ngay)) m.set(x.ngay, []); m.get(x.ngay).push(x); }
    for(const k of m.keys()) m.get(k).sort((a,b)=> (a.bat_dau_luc > b.bat_dau_luc ? 1 : -1));
    return m;
  },[list]);

  const onSelectSlot = (start, end)=>{
    createInitRef.current = { start, end };
    setCreateOpen(true);
  };

  async function handleSave(payload){
    try{
      await Api.createOne(payload);
      setCreateOpen(false);
      await load();
    }catch(e){ alert("Lỗi tạo buổi: "+(e.message||"")); }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-ras-blue">Xếp lớp trong tuần</h1>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-xl border" onClick={()=>setWeek0(addDays(week0,-7))}>← Tuần trước</button>
          <div className="px-3 py-2 font-semibold text-ras-blue hidden md:block">Tuần bắt đầu {week0.toLocaleDateString("vi-VN")}</div>
          <button className="px-3 py-2 rounded-xl border" onClick={()=>setWeek0(addDays(week0,+7))}>Tuần sau →</button>
        </div>
      </div>

      {/* filter bar */}
      <div className="bg-white/80 border rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Học viên</label>
            <AsyncSearchSelect value={studentF} onChange={setStudentF} fetcher={fetchStudents} placeholder="Tìm học viên…" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Giáo viên</label>
            <AsyncSearchSelect value={teacherF} onChange={setTeacherF} fetcher={fetchTeachers} placeholder="Tìm giáo viên…" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Chi nhánh</label>
            <AsyncSearchSelect value={branchF} onChange={setBranchF} fetcher={fetchBranches} placeholder="Chọn chi nhánh…" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Tìm nhanh (tên/SĐT)</label>
            <input className="w-full border rounded-xl px-3 py-2" value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Ví dụ: An · 0903…" />
          </div>
        </div>
        {(err || loading) && <div className="text-sm mt-2">{err? <span className="text-rose-600">API lỗi: {err}</span>: <span className="text-slate-500">Đang tải…</span>}</div>}
      </div>

      {/* calendar grid */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-8">
          <div className="bg-slate-50 border-r p-2 text-xs text-gray-600">GMT+07</div>
          {days.map((d,i)=>(
            <div key={i} className="border-r p-2 text-sm font-medium text-ras-blue">
              {d.toLocaleDateString("vi-VN",{ weekday:"short", day:"2-digit"})} ({toISODate(d)})
            </div>
          ))}
        </div>
        <div className="grid grid-cols-8 relative">
          <div className="bg-slate-50 border-r">
            <HourLines/>
          </div>
          {days.map((d,i)=>{
            const key = toISODate(d);
            const events = grouped.get(key)||[];
            return (
              <div key={i} className="relative">
                <DayColumn day={d} events={events} onSelectSlot={onSelectSlot}/>
              </div>
            );
          })}
        </div>
      </div>

      {/* create panel (Google Calendar-like) */}
      <CreatePanel
        open={createOpen}
        onClose={()=>setCreateOpen(false)}
        initial={createInitRef.current}
        onSave={handleSave}
      />
    </div>
  );
}
