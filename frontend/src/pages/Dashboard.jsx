import React, { useEffect, useState } from 'react'
import { Api } from '../lib/api.js'
import { useApp } from '../state/AppContext.jsx'

function Staff() {
  const { branchId } = useApp()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    let on=true
    Api.views.staffDutyToday(branchId).then(data => {
      if (!on) return
      const list = Array.isArray(data) ? data : []
      const mapped = list.map(x => ({
        id: x.id,
        chi_nhanh: x.chi_nhanh,
        ma_chi_nhanh: x.ma_chi_nhanh,
        nhan_vien: x.nhan_vien,
        gio_bat_dau: x.gio_bat_dau,
        gio_ket_thuc: x.gio_ket_thuc,
        loai_ca: x.loai_ca,
        trang_thai_runtime: x.trang_thai_runtime
      }))
      setRows(mapped); setLoading(false)
    })
    return ()=>{ on=false }
  }, [branchId])
  const fmt = t => t ? new Date(`1970-01-01T${t}`).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}) : '-'
  return (
    <div className="card">
      <div className="card-header"><h3 className="font-semibold">Trực hôm nay</h3></div>
      <div className="card-body overflow-x-auto">
        {loading ? 'Đang tải…' : (
          <table className="table">
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>Chi nhánh</th>
                <th>Ca</th>
                <th>Bắt đầu</th>
                <th>Kết thúc</th>
                <th>Tình trạng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.nhan_vien}</td>
                  <td>{r.chi_nhanh} ({r.ma_chi_nhanh})</td>
                  <td>{r.loai_ca}</td>
                  <td>{fmt(r.gio_bat_dau)}</td>
                  <td>{fmt(r.gio_ket_thuc)}</td>
                  <td>
                    <span className={
                      r.trang_thai_runtime === 'dang_truc' ? 'badge badge-green' :
                      r.trang_thai_runtime === 'sap_bat_dau' ? 'badge badge-amber' : 'badge'}>
                      {r.trang_thai_runtime?.replaceAll('_',' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length===0 && <tr><td className="text-center text-slate-500 py-6" colSpan={6}>Không có ca trực</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function TodayLessonsCard(){
  const { branchId } = useApp()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    let on=true
    Api.views.todayLessons(branchId).then(data => {
      if (!on) return
      const list = Array.isArray(data) ? data : []
      const mapped = list.map(x => ({
        id: x.buoi_hoc_id,
        ten_lop: x.ten_lop,
        giao_vien: x.giao_vien,
        bat_dau_luc: x.bat_dau_luc,
        ket_thuc_luc: x.ket_thuc_luc,
        so_dang_ky: x.so_dang_ky ?? 0,
        so_diem_danh: x.so_diem_danh ?? 0,
        trang_thai_runtime: x.trang_thai_runtime
      }))
      setRows(mapped); setLoading(false)
    })
    return ()=>{ on=false }
  }, [branchId])
  const fmt = d => d ? new Date(d).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}) : '-'
  return (
    <div className="card">
      <div className="card-header"><h3 className="font-semibold">Lịch dạy hôm nay</h3></div>
      <div className="card-body overflow-x-auto">
        {loading ? 'Đang tải…' : (
          <table className="table">
            <thead>
              <tr>
                <th>Giờ</th>
                <th>Lớp</th>
                <th>Giáo viên</th>
                <th>ĐK/DD</th>
                <th>Tình trạng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{fmt(r.bat_dau_luc)}–{fmt(r.ket_thuc_luc)}</td>
                  <td>{r.ten_lop}</td>
                  <td>{r.giao_vien}</td>
                  <td>{r.so_dang_ky}/{r.so_diem_danh}</td>
                  <td>
                    <span className={
                      r.trang_thai_runtime === 'dang_dien_ra' ? 'badge badge-green' :
                      r.trang_thai_runtime === 'sap_bat_dau' ? 'badge badge-amber' : 'badge'}>
                      {r.trang_thai_runtime?.replaceAll('_',' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length===0 && <tr><td className="text-center text-slate-500 py-6" colSpan={5}>Không có buổi học</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default function Dashboard(){
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Staff/>
      <TodayLessonsCard/>
    </div>
  )
}
