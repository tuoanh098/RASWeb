import React, { useEffect, useMemo, useRef, useState } from "react";

const DAYS = ["Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Chủ Nhật"];
const DURATION_PRESETS = [45, 60, 90, 120, 180];
const REPEAT_WEEKS = 12; // lặp hàng tuần trong N tuần

function Chip({ selected, onClick, onDoubleClick, children }) {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`mb-1 mr-1 inline-flex items-center gap-1 rounded px-2 py-1 text-xs leading-5 cursor-pointer
        ${selected ? "ring-2 ring-amber-500" : ""}
        bg-amber-100 text-amber-900 border border-amber-200`}
      title="Click to chọn / Double-click để xóa"
    >
      {children}
    </div>
  );
}

// safe array
const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

// YYYY-MM-DD theo LOCAL (tránh lệch múi giờ khi dùng toISOString)
function ymdLocal(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function hhmm(dt) {
  const d = new Date(dt);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function SearchSelect({ label, items = [], value, onChange, getLabel = (x) => String(x?.ten || x?.name || x?.id), placeholder = "Tìm theo tên..." }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const selectedItem = items.find((i) => i?.id === value) || null;
  const display = q !== "" ? q : (selectedItem ? getLabel(selectedItem) : "");

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return items.slice(0, 50);
    return items.filter((it) => getLabel(it)?.toLowerCase().includes(k)).slice(0, 50);
  }, [items, q, getLabel]);

  // close on click outside
  useEffect(() => {
    function onClickOutside(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      {label && <label className="label">{label}</label>}
      <input
        className="input w-full"
        placeholder={placeholder}
        value={display}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow max-h-56 overflow-auto">
          {filtered.length === 0 ? (
            <div className="px-2 py-2 text-sm text-slate-500">Không tìm thấy</div>
          ) : (
            filtered.map((it) => (
              <div
                key={it.id}
                className="px-2 py-1 hover:bg-slate-100 cursor-pointer text-sm"
                onMouseDown={() => { onChange(it.id); setQ(getLabel(it)); setOpen(false); }}
                title={getLabel(it)}
              >
                {getLabel(it)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Schedule() {
  // --- option data (keys VN) ---
  const [classes, setClasses] = useState([]); // [{id, ten_lop, chi_nhanh_id}]
  const [teachers, setTeachers] = useState([]); // [{id, ho_ten}]
  const [rooms, setRooms] = useState([]); // [{id, ten}]
  const [classId, setClassId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [roomId, setRoomId] = useState("");

  // --- date/time & duration ---
  const [teachDate, setTeachDate] = useState(() => new Date());
  const [timeStr, setTimeStr] = useState("07:00"); // HH:mm
  const [duration, setDuration] = useState(60);
  const [repeatWeekly, setRepeatWeekly] = useState(false);

  // --- student search (keys VN) ---
  const [studentQuery, setStudentQuery] = useState("");
  const [suggest, setSuggest] = useState([]);
  const [studentIds, setStudentIds] = useState([]);
  const [studentChips, setStudentChips] = useState([]);
  const debRef = useRef();

  // --- current week (Mon..Sun) ---
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const wd = (d.getDay() + 6) % 7; // Mon=0
    d.setDate(d.getDate() - wd);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const weekText = useMemo(() => {
    const s = new Date(weekStart);
    const e = new Date(weekStart); e.setDate(e.getDate() + 6);
    return `${s.toLocaleDateString("en-GB")} - ${e.toLocaleDateString("en-GB")}`;
  }, [weekStart]);

  // --- load options ---
  useEffect(() => {
    (async () => {
      try {
        const [classesRes, teachersRes] = await Promise.all([
          Api.classes.list({ size: 500 }),
          Api.teachers.list({ size: 500 }),
        ]);
        const cs = asArray(classesRes);
        const ts = asArray(teachersRes);
        setClasses(cs);
        setTeachers(ts);

        // default select first if not set
        if (!classId && cs.length) setClassId(cs[0].id);
        if (!teacherId && ts.length) setTeacherId(ts[0].id);
      } catch (e) {
        console.error(e);
        setClasses([]);
        setTeachers([]);
        alert("Không tải được danh sách Lớp/Giáo viên");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- load rooms by branch of selected class ---
  useEffect(() => {
    (async () => {
      const cls = classes.find((x) => x.id === classId);
      const branchId = cls?.chi_nhanh_id;

      if (!branchId) {
        setRooms([]);
        setRoomId("");
        return;
      }
      try {
        const data = await Api.rooms.byBranch(branchId);
        const arr = asArray(data);
        setRooms(arr);
        setRoomId(arr?.[0]?.id ?? "");
      } catch (e) {
        console.error(e);
        setRooms([]);
        setRoomId("");
      }
    })();
  }, [classId, classes]);

  // --- fetch calendar data for week ---
  const [loading, setLoading] = useState(false);
  const [weekLessons, setWeekLessons] = useState([]); // flat arr of lessons
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const weekDates = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [weekStart]);

  const fetchWeek = async () => {
    setLoading(true);
    try {
      const start = ymdLocal(weekDates[0]);
      const data = await Api.lessons.week({ start });
      setWeekLessons(asArray(data?.items ?? data));
    } catch (e) {
      console.error(e);
      setWeekLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeek(); /* eslint-disable-next-line */ }, [weekStart]);

  // --- student search suggest ---
  useEffect(() => {
    clearTimeout(debRef.current);
    if (!studentQuery?.trim()) { setSuggest([]); return; }
    debRef.current = setTimeout(async () => {
      try {
        const data = await Api.students.search({ q: studentQuery, size: 10 });
        setSuggest(asArray(data));
      } catch {
        setSuggest([]);
      }
    }, 250);
  }, [studentQuery]);

  function addHV(s) {
    if (studentIds.includes(s.id)) return;
    setStudentIds((x) => [...x, s.id]);
    setStudentChips((x) => [...x, s]);
  }
  function removeHV(id) {
    setStudentIds((x) => x.filter((i) => i !== id));
    setStudentChips((x) => x.filter((i) => i.id !== id));
  }

  // --- create/cancel ---
  async function handleAdd() {
    if (!classId || !teacherId || !roomId) return alert("Chọn Lớp, Giáo viên, Chi nhánh");
    const date = ymdLocal(teachDate);

    const [h, m] = timeStr.split(":").map((n) => Number(n));
    const start = new Date(date + "T" + timeStr + ":00");
    const end = new Date(start.getTime() + duration * 60000);

    const payload = {
      lop_id: classId,
      giao_vien_id: teacherId,
      phong_id: roomId, // = chi_nhanh.id
      bat_dau_luc: start.toISOString(),
      ket_thuc_luc: end.toISOString(),
      thoi_luong_phut: duration,
      hoc_vien_ids: studentIds,
      tao_luc: new Date().toISOString(),
    };

    try {
      if (repeatWeekly) {
        await Api.lessons.createRecurring({ ...payload, repeat_weeks: REPEAT_WEEKS });
      } else {
        await Api.lessons.createOne(payload);
      }
      await fetchWeek();
      setSelectedLessonId(null);
      // reset students
      setStudentIds([]); setStudentChips([]);
    } catch (e) {
      console.error(e);
      alert("Thêm buổi thất bại!");
    }
  }

  const hasCancelOne = !!Api?.lessons?.cancelOne;
  const hasUpdate = !!Api?.lessons?.update;

  async function handleCancel() {
    const sel = weekLessons.find((x) => x.id === selectedLessonId);
    if (!sel) return;

    if (sel.group_id) {
      const opt = confirm(
        "Đây là lịch lặp tuần.\nOK = Chỉ xóa buổi này\nCancel = Chọn xóa cả chuỗi."
      );
      if (opt) {
        await Api.lessons.removeOne(sel.id).catch(() =>
          alert("Xóa thất bại!")
        );
      } else {
        const sure = confirm(
          "Xóa TOÀN BỘ chuỗi từ tuần này trở đi?"
        );
        if (!sure) return;
        const from = sel.bat_dau_luc.slice(0, 10);
        await Api.lessons
          .removeRecurring({ group_id: sel.group_id, from })
          .catch(() => alert("Xóa chuỗi thất bại!"));
      }
    } else {
      const ok = confirm("Hủy buổi học này?");
      if (!ok) return;
      try {
        if (hasCancelOne) await Api.lessons.cancelOne(sel.id);
        else if (hasUpdate)
          await Api.lessons.update(sel.id, { runtime_status: "cancelled" });
        else {
          await Api.lessons.removeOne(sel.id);
          alert("(Backend chưa hỗ trợ hủy) Đã xóa thay cho hủy.");
        }
      } catch (e) {
        return alert("Hủy thất bại!");
      }
    }
    await fetchWeek();
    setSelectedLessonId(null);
  }

  const classById = useMemo(() => Object.fromEntries(classes.map(c => [c.id, c])), [classes]);
  const teacherById = useMemo(() => Object.fromEntries(teachers.map(t => [t.id, t])), [teachers]);
  const roomById = useMemo(() => Object.fromEntries(rooms.map(r => [r.id, r])), [rooms]);

  // --- header actions
  function gotoPrevWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  }
  function gotoNextWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  }
  function gotoThisWeek() {
    const d = new Date();
    const wd = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - wd);
    d.setHours(0, 0, 0, 0);
    setWeekStart(d);
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">Xếp lịch lớp học</h2>
            <div className="text-sm text-slate-500">Tuần: {weekText}</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn" onClick={gotoPrevWeek}>◀ Tuần trước</button>
            <button className="btn" onClick={gotoThisWeek}>Hôm nay</button>
            <button className="btn" onClick={gotoNextWeek}>Tuần sau ▶</button>
          </div>
        </div>
        <div className="card-body">
          <div className="flex gap-6">
            {/* Sidebar config */}
            <div className="w-[300px] shrink-0 space-y-4 border-r pr-4">
              <div>
                <SearchSelect
                  label="Lớp"
                  items={classes}
                  value={classId ?? ""}
                  onChange={(id) => setClassId(Number(id))}
                  getLabel={(l) => l.ten_lop}
                  placeholder="Tìm lớp theo tên"
                />
              </div>

              <div>
                <SearchSelect
                  label="Giáo viên"
                  items={teachers}
                  value={teacherId ?? ""}
                  onChange={(id) => setTeacherId(Number(id))}
                  getLabel={(t) => t.ho_ten}
                  placeholder="Tìm giáo viên theo tên"
                />
              </div>

              <div>
                <SearchSelect
                  label="Chi nhánh"
                  items={rooms}
                  value={roomId ?? ""}
                  onChange={(id) => setRoomId(Number(id))}
                  getLabel={(r) => r.ten}
                  placeholder="Tìm chi nhánh theo tên"
                />
                <div className="mt-1 text-xs text-slate-500">* Phòng theo chi nhánh của Lớp</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Ngày dạy</label>
                  <input
                    type="date"
                    className="input w-full"
                    value={ymdLocal(teachDate)}
                    onChange={(e) => setTeachDate(new Date(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label">Giờ bắt đầu</label>
                  <input
                    type="time"
                    className="input w-full"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">Thời lượng (phút)</label>
                <div className="flex gap-2">
                  <select
                    className="input"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  >
                    {DURATION_PRESETS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={15}
                    step={5}
                    className="input w-full"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="repeat"
                  type="checkbox"
                  checked={repeatWeekly}
                  onChange={(e) => setRepeatWeekly(e.target.checked)}
                />
                <label htmlFor="repeat" className="select-none">
                  Lặp mỗi tuần ({REPEAT_WEEKS} tuần)
                </label>
              </div>

              <div>
                <label className="label">Học viên</label>
                <input
                  type="text"
                  placeholder="Tìm theo tên/số điện thoại"
                  className="input w-full"
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                />
                {studentQuery && (
                  <div className="mt-1 border rounded shadow bg-white max-h-56 overflow-auto">
                    {suggest.map((s) => (
                      <div
                        key={s.id}
                        className="px-2 py-1 hover:bg-slate-100 cursor-pointer text-sm"
                        onMouseDown={() => addHV(s)}
                      >
                        {s.ho_ten}{s.so_dien_thoai ? ` — ${s.so_dien_thoai}` : ""}
                      </div>
                    ))}
                  </div>
                )}
                {/* Đã chọn */}
                <div className="mt-2">
                  {studentChips.map((s) => (
                    <Chip key={s.id} onDoubleClick={() => removeHV(s.id)}>
                      {s.ho_ten} <span className="opacity-70">×</span>
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button className="btn btn-primary" onClick={handleAdd}>
                  ➕ Thêm buổi
                </button>
                <button className="btn" onClick={() => { setStudentIds([]); setStudentChips([]); }}>
                  Xóa chọn HV
                </button>
              </div>

              <div className="pt-2 flex gap-2">
                <button className="btn btn-warning" onClick={handleCancel} disabled={!selectedLessonId}>
                  Hủy buổi đã chọn
                </button>
              </div>
            </div>

            {/* Main calendar */}
            <div className="flex-1 overflow-x-auto">
              <table className="table w-full text-center">
                <thead>
                  <tr>
                    {DAYS.map((d, i) => (
                      <th key={d} className="w-48 align-bottom">
                        <div className="font-semibold">{d}</div>
                        <div className="text-xs text-slate-500">{weekDates[i].toLocaleDateString("en-GB")}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {weekDates.map((day) => {
                      const arr = weekLessons.filter(
                        (it) => new Date(it.bat_dau_luc).toDateString() === day.toDateString()
                      ).sort((a, b) => new Date(a.bat_dau_luc) - new Date(b.bat_dau_luc));

                      return (
                        <td key={day.toISOString()} className="align-top">
                          {loading && <div className="py-8 text-slate-400 text-sm">Đang tải...</div>}
                          {!loading && arr.length === 0 && (
                            <div className="py-8 text-slate-300 text-sm">—</div>
                          )}
                          <div className="px-1">
                            {arr.map((it) => {
                              const cls = classById[it.lop_id];
                              const t = teacherById[it.giao_vien_id];
                              const r = roomById[it.phong_id];
                              const isSel = selectedLessonId === it.id;
                              return (
                                <div
                                  key={it.id}
                                  className={`text-left mb-2 rounded border p-2 shadow-sm cursor-pointer transition
                                  ${isSel ? "ring-2 ring-amber-500" : "hover:bg-slate-50"}`}
                                  onClick={() => setSelectedLessonId(it.id)}
                                  title={it.group_id ? "Buổi thuộc chuỗi lặp tuần" : ""}
                                >
                                  <div className="text-sm font-semibold">
                                    {hhmm(it.bat_dau_luc)}–{hhmm(it.ket_thuc_luc)}
                                    {it.group_id ? <span className="ml-1 text-[10px] bg-amber-100 text-amber-800 px-1 rounded">REPEAT</span> : null}
                                  </div>
                                  {(() => {
                                    const mon = cls?.ten_mon || cls?.mon_hoc_ten || cls?.mon || null;
                                    return (
                                      <>
                                        <div className="text-sm">
                                          {mon ? `Môn: ${mon}` : (cls?.ten_lop ? `Lớp: ${cls.ten_lop}` : `Lớp #${it.lop_id}`)}
                                        </div>
                                        <div className="text-xs text-slate-600">GV: {t?.ho_ten || `#${it.giao_vien_id || '—'}`}</div>
                                        <div className="text-xs text-slate-600">Chi nhánh: {r?.ten || `#${it.phong_id || '—'}`}</div>
                                      </>
                                    );
                                  })()}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
