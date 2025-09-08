import React, { useEffect, useMemo, useState } from "react";
import { Api } from "../lib/api";               // <-- đường dẫn đúng nơi bạn export Api
import { useApp } from "../state/AppContext.jsx"; // để lấy branchId (nếu bạn đang dùng)

const CODE_STYLE = {
  "":   { title: "",                 cls: "" },
  c:    { title: "Có mặt",           cls: "bg-green-100 text-green-800 border-green-300" },
  cm:   { title: "Có mặt (đi trễ)",  cls: "bg-lime-100 text-lime-800 border-lime-300" },
  v:    { title: "Vắng",             cls: "bg-rose-100 text-rose-700 border-rose-300" },
  vp:   { title: "Vắng (có phép)",   cls: "bg-sky-100 text-sky-700 border-sky-300" },
};

function startOfWeek(d = new Date()) {
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (dt.getDay() + 6) % 7; // Mon=0..Sun=6
  dt.setDate(dt.getDate() - day);
  dt.setHours(0,0,0,0);
  return dt;
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fmt(d){ return d.toLocaleDateString("vi-VN", { weekday:"short", day:"2-digit" }); }

function CodeCell({ value, onChange }) {
  const v = (value || "").toLowerCase().trim();
  const style = CODE_STYLE[v] || CODE_STYLE[""];
  const [text, setText] = useState(v);
  useEffect(()=> setText(v), [v]);

  function commit(val) {
    const vv = (val || "").toLowerCase().trim();
    const ok = ["", "c", "cm", "v", "vp"].includes(vv) ? vv : "";
    onChange?.(ok);
    setText(ok);
  }

  return (
    <input
      className={`w-16 h-9 text-center rounded-md border outline-none focus:ring-2 ring-offset-1 transition
                  ${style.cls || "border-slate-200 bg-white"}`}
      value={text}
      onChange={e => setText(e.target.value)}
      onBlur={e => commit(e.target.value)}
      onKeyDown={e => { if (e.key === "Enter") { e.currentTarget.blur(); } }}
      placeholder=""
      title={style.title}
    />
  );
}

export default function Attendance() {
  const { branchId } = useApp?.() || { branchId: null };

  const [mode, setMode] = useState("teacher");       // teacher | student (hiện hỗ trợ teacher)
  const [week0, setWeek0] = useState(startOfWeek());
  const [rows, setRows] = useState([]);              // [{id,name,codes:[..7]}]
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState("");

  const weekISO = useMemo(() => week0.toISOString().slice(0,10), [week0]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(week0, i)), [week0]);

  async function load() {
    setLoading(true); setErr(null);
    try {
      const list = await Api.attendance.load({ type: mode, weekStart: weekISO, branchId, q });
      // backend trả list sorted: GV có lịch hôm nay đứng trên
      setRows(list.map(r => ({ id: r.id, name: r.name, codes: r.codes || Array(7).fill("") })));
    } catch (e) {
      setErr(e.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=> { load(); /* eslint-disable-next-line */ }, [mode, weekISO, branchId]);
  
  function setCode(rowIdx, dayIdx, code) {
    setRows(prev => {
      const cp = prev.map(r => ({ ...r, codes: [...r.codes] }));
      cp[rowIdx].codes[dayIdx] = code;
      return cp;
    });
  }

  function clearAll() {
    setRows(prev => prev.map(r => ({ ...r, codes: Array(7).fill("") })));
  }

  async function apply() {
    try {
      setLoading(true);
      await Api.attendance.save({
        type: mode,
        weekStart: weekISO,
        items: rows.map(r => ({ id: r.id, codes: r.codes }))
      });
      await load();
      alert("Đã lưu điểm danh!");
    } catch (e) {
      alert("Lỗi lưu điểm danh: " + (e.message || "Unknown"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 bg-ras-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="uppercase text-2xl text-ras-blue tracking-wide mb-2">ĐIỂM DANH</h2>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-ras-blue p-1 bg-ras-white">
            <button
              className={`px-3 py-1 rounded-md ${mode==='teacher'?'bg-ras-blue text-white shadow':'text-ras-blue hover:bg-ras-purple hover:text-white'}`}
              onClick={() => setMode("teacher")}
            >
              giáo viên
            </button>
            <button
              className={`px-3 py-1 rounded-md ${mode==='student'?'bg-ras-purple text-white shadow':'text-ras-blue hover:bg-ras-purple hover:text-white'}`}
              onClick={() => setMode("student")}
            >
              học sinh
            </button>
          </div>
          <input
            className="input w-60"
            placeholder="Tìm theo tên / SĐT…"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') load(); }}
            title="Nhấn Enter để tìm"
          />
        </div>
      </div>

      <div className="card">
        {/* Thanh tuần */}
        <div className="flex items-center justify-center gap-4 py-4 mb-2 rounded-t-lg bg-white">
          <button
            className="btn px-4 py-2 rounded-md bg-ras-blue text-black font-semibold"
            onClick={() => setWeek0(addDays(week0, -7))}
          >
            ←
          </button>
          <div className="font-bold text-ras-blue text-xl text-center">
            Tuần từ {week0.toLocaleDateString("vi-VN", { day:"2-digit", month:"2-digit", year:"numeric" })}
          </div>
          <button
            className="btn px-4 py-2 rounded-md bg-ras-blue text-black font-semibold"
            onClick={() => setWeek0(addDays(week0, +7))}
          >
            →
          </button>
        </div>

        {/* Trạng thái */}
        {err && <div className="px-4 py-2 text-rose-600">API lỗi: {String(err)}</div>}
        {loading && <div className="px-4 py-2 text-slate-500">Đang tải…</div>}

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="min-w-max w-full border border-ras-blue rounded-lg bg-ras-white">
            <thead>
              <tr className="bg-ras-blue">
                <th className="min-w-[220px] px-4 py-3 text-center text-white font-semibold border-b border-ras-blue">
                  Tên {mode === "teacher" ? "GV" : "học sinh"}
                </th>
                {days.map((d, i) => (
                  <th
                    key={i}
                    className="min-w-[110px] px-4 py-3 text-center text-white font-semibold border-b border-ras-blue"
                  >
                    {fmt(d)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={r.id} className="border-b border-ras-blue">
                  <td className="font-medium px-4 py-3 text-center text-ras-blue bg-ras-white">
                    {r.name}
                  </td>
                  {r.codes.map((code, ci) => (
                    <td key={ci} className="text-center px-4 py-3 align-middle bg-ras-white">
                      <CodeCell value={code} onChange={(v) => setCode(ri, ci, v)} />
                    </td>
                  ))}
                </tr>
              ))}
              {!rows.length && !loading && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 align-middle bg-ras-white">
                    Không có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Action */}
        <div className="flex items-center gap-3 px-3 py-3">
          <button className="btn btn-primary" onClick={apply} disabled={loading}>Áp dụng</button>
        </div>

        {/* Quy ước */}
        <div className="p-3 rounded-xl bg-white shadow-sm w-fit mx-0 ml-2">
          <div className="font-medium mb-1 text-ras-blue">Quy ước</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span><b>c</b>: <span className="text-green-700">có mặt</span></span>
            <span><b>cm</b>: <span className="text-lime-700">đi muộn</span></span>
            <span><b>v</b>: <span className="text-rose-700">vắng</span></span>
            <span><b>vp</b>: <span className="text-sky-700">vắng đã xin phép</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
