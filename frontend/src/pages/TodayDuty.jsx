import { useEffect, useState } from 'react';
import { getStaffDutyToday } from '../lib/api';
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

export default function TodayDuty(){
  const { branchId } = useApp();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    setLoading(true);
    getStaffDutyToday(branchId).then(setRows).catch(e => setErr(e.message)).finally(()=>setLoading(false));
  }, [branchId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Trực hôm nay</h1>
      {loading && <div>Đang tải…</div>}
      {err && <div className="text-red-600">{err}</div>}
      {!loading && !err && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left">Ca</th>
                <th className="px-3 py-2 text-left">Giáo vụ</th>
                <th className="px-3 py-2 text-left">Bắt đầu</th>
                <th className="px-3 py-2 text-left">Kết thúc</th>
                <th className="px-3 py-2 text-left">Trạng thái</th>
                <th className="px-3 py-2 text-left">Runtime</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">{r.shiftType}</td>
                  <td className="px-3 py-2">{r.staffName}</td>
                  <td className="px-3 py-2">{r.startTime}</td>
                  <td className="px-3 py-2">{r.endTime}</td>
                  <td className="px-3 py-2"><Badge status={r.shiftStatus} /></td>
                  <td className="px-3 py-2"><Badge status={r.runtimeStatus} /></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-slate-500" colSpan={6}>
                    Hôm nay không có ca trực.
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
