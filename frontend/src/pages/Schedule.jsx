// pages/Schedule.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Api } from "../lib/api.js";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DURATION_PRESETS = [45, 60, 90, 120];
const REPEAT_WEEKS = 12; // repeat weekly (fixed days) for N weeks

function Chip({ selected, onClick, onDoubleClick, children }) {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`mb-1 rounded px-2 py-1 text-xs leading-5 cursor-pointer
        ${selected ? "ring-2 ring-amber-500" : ""}
        bg-amber-100 text-amber-900 border border-amber-200`}
      title="Click to select"
    >
      {children}
    </div>
  );
}

// safe array
const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

export default function Schedule() {
  // --- option data from real API (keys in Vietnamese) ---
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
    const e = new Date(weekStart);
    e.setDate(e.getDate() + 6);
    const f = (d) =>
      d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });
    return `${f(weekStart)} - ${f(e)}`;
  }, [weekStart]);

  const [weekLessons, setWeekLessons] = useState([]); // list of lessons in week
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  // --- load options (classes, teachers) ---
  useEffect(() => {
    (async () => {
      try {
        const [cData, tData] = await Promise.all([
          Api.classes.list({ size: 500 }),
          Api.teachers.list({ size: 500 }),
        ]);
        const cls = asArray(cData);
        const tcs = asArray(tData);
        setClasses(cls);
        setTeachers(tcs);
        if (!classId && cls.length) setClassId(cls[0].id);
        if (!teacherId && tcs.length) setTeacherId(tcs[0].id);
      } catch (e) {
        console.error(e);
        setClasses([]);
        setTeachers([]);
        alert("Cannot load Classes/Teachers");
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
        setRooms(asArray(data));
        setRoomId(data?.[0]?.id ?? "");
      } catch (e) {
        console.error(e);
        setRooms([]);
        setRoomId("");
      }
    })();
  }, [classId, classes]);

  // --- load week lessons ---
  async function fetchWeek() {
    const start = weekStart.toISOString().slice(0, 10);
    const data = await Api.lessons.week({ start }).catch(() => []);
    setWeekLessons(asArray(data));
    setSelectedLessonId(null);
  }
  useEffect(() => {
    fetchWeek();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  // --- search students ---
  useEffect(() => {
    clearTimeout(debRef.current);
    const kw = studentQuery.trim();
    if (!kw) {
      setSuggest([]);
      return;
    }
    debRef.current = setTimeout(async () => {
      try {
        const data = await Api.students.search({ q: kw, limit: 10 });
        const arr = asArray(data).filter((s) => !studentIds.includes(s.id));
        setSuggest(arr.slice(0, 10));
      } catch (e) {
        console.error(e);
      }
    }, 300);
    return () => clearTimeout(debRef.current);
  }, [studentQuery, studentIds]);

  function addHV(s) {
    setStudentIds((p) => [...p, s.id]);
    setStudentChips((p) => [...p, { id: s.id, ho_ten: s.ho_ten }]);
    setStudentQuery("");
    setSuggest([]);
  }
  function removeHV(id) {
    setStudentIds((p) => p.filter((x) => x !== id));
    setStudentChips((p) => p.filter((x) => x.id !== id));
  }

  // --- build one item (keys VN) ---
  function buildOneItem(baseDate) {
    const [hh, mm] = timeStr.split(":").map((n) => parseInt(n, 10));
    const start = new Date(baseDate);
    start.setHours(hh, mm, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + Number(duration));
    return {
      lop_id: Number(classId),
      giao_vien_id: teacherId ? Number(teacherId) : null,
      phong_id: roomId ? Number(roomId) : null,
      bat_dau_luc: start.toISOString(),
      ket_thuc_luc: end.toISOString(),
      thoi_luong_phut: Number(duration),
      hoc_vien_ids: studentIds.slice(),
    };
  }

  // --- add (with/without weekly repeat) ---
  async function handleAdd() {
    if (!classId) return alert("Please choose a Class");
    if (!timeStr) return alert("Please select a start time");
    const d = new Date(teachDate);
    d.setHours(0, 0, 0, 0);

    const items = [];
    items.push(buildOneItem(d));
    if (repeatWeekly) {
      // repeat (fixed day each week)
      const groupId =
        (crypto && crypto.randomUUID && crypto.randomUUID()) ||
        String(Date.now());
      for (let w = 1; w < REPEAT_WEEKS; w++) {
        const dd = new Date(d);
        dd.setDate(dd.getDate() + 7 * w);
        const it = buildOneItem(dd);
        it.group_id = groupId;
        items.push(it);
      }
      // attach group_id to the very first, too
      items[0].group_id = groupId;
    }

    try {
      // BỎ check-conflicts: post thẳng, BE sẽ skip bản ghi trùng
      await Api.lessons.batch({ items });
      await fetchWeek();
      alert("Added!");
    } catch (e) {
      console.error(e);
      alert(`Failed: ${e.message || e}`);
    }
  }

  // --- delete selected lesson (one or recurring chain) ---
  async function handleDelete() {
    if (!selectedLessonId)
      return alert("Select a lesson card to delete.");
    const sel = weekLessons.find((x) => x.id === selectedLessonId);
    if (!sel) return;

    if (sel.group_id) {
      const opt = confirm(
        "This is a recurring schedule.\nOK = Delete only this occurrence\nCancel = Choose to delete entire chain."
      );
      if (opt) {
        await Api.lessons.removeOne(sel.id).catch(() =>
          alert("Delete failed!")
        );
      } else {
        const sure = confirm(
          "Delete ENTIRE recurring chain from this week forward?"
        );
        if (!sure) return;
        const from = sel.bat_dau_luc.slice(0, 10);
        await Api.lessons
          .removeRecurring({ group_id: sel.group_id, from })
          .catch(() => alert("Delete chain failed!"));
      }
    } else {
      const ok = confirm("Delete this lesson?");
      if (!ok) return;
      await Api.lessons.removeOne(sel.id).catch(() =>
        alert("Delete failed!")
      );
    }
    await fetchWeek();
    setSelectedLessonId(null);
  }

  // --- group lessons by DOW (Mon..Sun) ---
  const lessonsByDow = useMemo(() => {
    const m = Array.from({ length: 7 }, () => []);
    for (const it of weekLessons) {
      const dt = new Date(it.bat_dau_luc);
      const idx = (dt.getDay() + 6) % 7; // Mon=0
      m[idx].push(it);
    }
    m.forEach((arr) =>
      arr.sort(
        (a, b) =>
          new Date(a.bat_dau_luc) - new Date(b.bat_dau_luc)
      )
    );
    return m;
  }, [weekLessons]);

  return (
    <div className="space-y-4">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Class Scheduling
            </h2>
            <div className="flex items-center gap-2">
              <button
                className="btn"
                onClick={() => {
                  const d = new Date(weekStart);
                  d.setDate(d.getDate() - 7);
                  setWeekStart(d);
                }}
              >
                ◀
              </button>
              <div className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm">
                {weekText}
              </div>
              <button
                className="btn"
                onClick={() => {
                  const d = new Date(weekStart);
                  d.setDate(d.getDate() + 7);
                  setWeekStart(d);
                }}
              >
                ▶
              </button>
            </div>
          </div>

          <div className="mt-3 border rounded bg-white overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border px-3 py-2 w-[380px] text-left">
                    Configuration
                  </th>
                  <th
                    className="border px-3 py-2 text-center"
                    colSpan={7}
                  >
                    Days of Week
                  </th>
                </tr>
                <tr className="bg-slate-50">
                  <th className="border px-3 py-2 text-left"></th>
                  {DAYS.map((d) => (
                    <th
                      key={d}
                      className="border px-2 py-2 text-center"
                    >
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  {/* Left controls */}
                  <td className="border align-top p-0">
                    <div className="p-3 space-y-4">
                      {/* Class */}
                      <div>
                        <div className="text-[13px] font-medium text-slate-600 mb-1">
                          Class
                        </div>
                        <select
                          className="input w-full"
                          value={classId ?? ""}
                          onChange={(e) =>
                            setClassId(Number(e.target.value))
                          }
                        >
                          {classes.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.ten_lop ??
                                l.ten ??
                                l.name ??
                                `Lớp #${l.id}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Teacher */}
                      <div>
                        <div className="text-[13px] font-medium text-slate-600 mb-1">
                          Teacher
                        </div>
                        <select
                          className="input w-full"
                          value={teacherId ?? ""}
                          onChange={(e) =>
                            setTeacherId(Number(e.target.value))
                          }
                        >
                          {teachers.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.ho_ten}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Room */}
                      <div>
                        <div className="text-[13px] font-medium text-slate-600 mb-1">
                          Room
                        </div>
                        <select
                          className="input w-full"
                          value={roomId}
                          onChange={(e) => setRoomId(e.target.value)}
                        >
                          <option value="">(None)</option>
                          {rooms.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.ten}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[13px] font-medium text-slate-600 mb-1">
                            Teach date
                          </div>
                          <input
                            type="date"
                            className="input w-full"
                            value={new Date(teachDate)
                              .toISOString()
                              .slice(0, 10)}
                            onChange={(e) => {
                              const d = new Date(
                                e.target.value + "T00:00:00"
                              );
                              setTeachDate(d);
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-slate-600 mb-1">
                            Start time
                          </div>
                          <input
                            type="time"
                            className="input w-full"
                            value={timeStr}
                            onChange={(e) => setTimeStr(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Duration presets */}
                      <div>
                        <div className="text-[13px] font-medium text-slate-600 mb-1">
                          Duration (minutes)
                        </div>
                        <div className="flex gap-2">
                          {DURATION_PRESETS.map((min) => (
                            <button
                              key={min}
                              type="button"
                              className={`px-2 py-1 text-xs rounded border ${
                                duration === min
                                  ? "bg-slate-800 text-white"
                                  : "hover:bg-slate-50"
                              }`}
                              onClick={() => setDuration(min)}
                            >
                              {min}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Students */}
                      <div>
                        <div className="text-[13px] font-medium text-slate-600 mb-1">
                          Students
                        </div>
                        <input
                          className="input w-full"
                          placeholder="Search by name/phone…"
                          value={studentQuery}
                          onChange={(e) =>
                            setStudentQuery(e.target.value)
                          }
                        />
                        {studentQuery && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {suggest.length === 0 ? (
                              <span className="text-xs text-slate-400">
                                No suggestions
                              </span>
                            ) : (
                              suggest.map((s) => (
                                <button
                                  key={s.id}
                                  className="px-2 py-1 text-xs rounded border hover:bg-slate-50"
                                  onClick={() => addHV(s)}
                                >
                                  + {s.ho_ten}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                        {studentChips.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {studentChips.map((s) => (
                              <span
                                key={s.id}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 border text-xs"
                              >
                                {s.ho_ten}
                                <button
                                  onClick={() => removeHV(s.id)}
                                  className="text-slate-500 hover:text-slate-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Week columns */}
                  {DAYS.map((_, idx) => (
                    <td
                      key={idx}
                      className="border align-top p-2 w-[14%]"
                    >
                      {lessonsByDow[idx].length === 0 ? (
                        <div className="text-[11px] text-slate-400">
                          —
                        </div>
                      ) : (
                        lessonsByDow[idx].map((ls) => {
                          const start = new Date(ls.bat_dau_luc);
                          const end = new Date(ls.ket_thuc_luc);
                          const hhmm = (d) =>
                            `${String(d.getHours()).padStart(
                              2,
                              "0"
                            )}:${String(d.getMinutes()).padStart(2, "0")}`;
                          return (
                            <Chip
                              key={ls.id}
                              selected={selectedLessonId === ls.id}
                              onClick={() => setSelectedLessonId(ls.id)}
                            >
                              <div className="font-medium">
                                {hhmm(start)}–{hhmm(end)} • {ls.giao_vien}
                              </div>
                              <div>{ls.ten_lop}</div>
                              {ls.ds_hoc_vien ? (
                                <div className="truncate max-w-[180px]">
                                  {ls.ds_hoc_vien}
                                </div>
                              ) : null}
                            </Chip>
                          );
                        })
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            {/* Actions */}
            <div className="flex items-center gap-4 p-3 border-t">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={repeatWeekly}
                  onChange={(e) => setRepeatWeekly(e.target.checked)}
                />
                Repeat weekly (fixed)
              </label>
              <div className="flex-1" />
              <button className="btn" onClick={handleDelete}>
                Delete
              </button>
              <button className="btn btn-primary" onClick={handleAdd}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
