import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../../state/AppContext.jsx";

export default function DutyRoster(){
  const { branchId } = useApp();
  const [date, setDate] = useState(()=> new Date());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const dateISO = useMemo(()=> new Date(date).toISOString().slice(0,10), [date]);
  const fmt = (t) => t ? new Date(`1970-01-01T${t}`).toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"}) : "-";

  useEffect(()=>{
    let on = true;
    (async ()=>{
      try{
        setLoading(true); setErr("");
        // Backend StaffDutyController đã hỗ trợ ?date=YYYY-MM-DD
        const data = await Api.views.staffDutyToday(branchId, dateISO);
        if (!on) return;
        setRows(Array.isArray(data) ? data : []);
      }catch(e){
        if (!on) return;
        setErr(e.message || String(e));
      }finally{ setLoading(false); }
    })();
    return ()=>{ on=false };
  }, [branchId, dateISO]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-sm text-slate-600">Chọn ngày:</div>
        <input
          type="date"
          className="input"
          value={dateISO}
          onChange={e => setDate(new Date(e.target.value + "T00:00:00"))}
        />
      </div>

      <div className="card">
        <div className="card-header"><h3 className="font-semibold">Lịch trực · {dateISO}</h3></div>
        <div className="card-body overflow-x-auto">
          {loading ? "Đang tải…" : err ? <div className="text-red-600">{err}</div> : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nhân viên</th>
                  <th>Chi nhánh</th>
                  <th>Ca</th>
                  <th>Bắt đầu</th>
                  <th>Kết thúc</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td>{r.nhan_vien || "-"}</td>
                    <td>{r.chi_nhanh} ({r.ma_chi_nhanh})</td>
                    <td>{r.loai_ca || "-"}</td>
                    <td>{fmt(r.gio_bat_dau)}</td>
                    <td>{fmt(r.gio_ket_thuc)}</td>
                    <td><span className="badge">{(r.trang_thai_runtime||"-").replaceAll("_"," ")}</span></td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-slate-500 py-6">Không có ca trực</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="text-sm text-slate-500">
      </div>
    </div>
  );
}
