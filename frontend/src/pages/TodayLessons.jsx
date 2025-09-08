import { useEffect, useState } from 'react';
import { getTodayLessons } from '../lib/api';
import { useApp } from '../state/AppContext';

function Badge({status}){
  const cls = {
    ONGOING: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-gray-100 text-gray-700',
    SCHEDULED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }[status] || 'bg-slate-100 text-slate-700';
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
}

function Popover({label, items}){
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={()=>setOpen(v=>!v)} className="underline decoration-dotted hover:opacity-80">
        {label}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-64 bg-white border rounded shadow p-2">
          <ul className="list-disc pl-5 max-h-60 overflow-auto">
            {items && items.length > 0 ? items.map((name, idx) => <li key={idx}>{name}</li>) :
              <li className="list-none text-slate-500">Không có dữ liệu</li>}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function TodayLessons(){
  const { branchId } = useApp();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    setLoading(true);
    getTodayLessons(branchId).then(setRows).catch(e => setErr(e.message)).finally(()=>setLoading(false));
  }, [branchId]);

  const fmt = (d) => new Date(d).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Lịch dạy hôm nay</h1>
      {loading && <div>Đang tải…</div>}
      {err && <div className="text-red-600">{err}</div>}
      {!loading && !err && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left">Giờ</th>
                <th className="px-3 py-2 text-left">Lớp</th>
                <th className="px-3 py-2 text-left">Giáo viên</th>
                <th className="px-3 py-2 text-left">Phòng</th>
                <th className="px-3 py-2 text-left">Sĩ số (ĐK/ĐD)</th>
                <th className="px-3 py-2 text-left">Tình trạng</th>
                <th className="px-3 py-2 text-left">Danh sách</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">
                    <div className="font-medium">{fmt(r.startsAt)}</div>
                    <div className="text-xs text-slate-500">{fmt(r.endsAt)}</div>
                  </td>
                  <td className="px-3 py-2">{r.classTitle}</td>
                  <td className="px-3 py-2">{r.teacherName || '-'}</td>
                  <td className="px-3 py-2">{r.roomName || '-'}</td>
                  <td className="px-3 py-2">{r.enrolledCount} / {r.checkedinCount}</td>
                  <td className="px-3 py-2"><Badge status={r.runtimeStatus} /></td>
                  <td className="px-3 py-2 space-x-2">
                    <Popover label="Đã đăng ký" items={r.enrolledStudents} />
                    <Popover label="Có mặt" items={r.presentStudents} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-slate-500" colSpan={7}>
                    Hôm nay không có buổi học.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
