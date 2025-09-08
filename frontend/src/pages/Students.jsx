import React, { useEffect, useState } from 'react'
import { Api } from '../lib/api.js'
import { useApp } from '../state/AppContext.jsx'
import { useDebounce } from '../lib/useDebounce.js'

function normalizeStudent(s = {}) {
  const {
    hoc_vien_id: id,
    hoc_sinh: fullName,
    hs_phone: phone,
    phu_huynh: parentName,
    phu_huynh_phone: parentPhone,
    chi_nhanh_ho_tro: supportBranch,
    so_lop_dang_hoc: studyingClassCount,
    giao_vien_dang_day: activeTeachers,
    thoi_gian_bat_dau_hoc: startedAt,
    email,
  } = s;
  return { id, fullName, phone, parentName, parentPhone, supportBranch,
           studyingClassCount, activeTeachers, startedAt, email };
}

export default function Students(){
  const { branchId } = useApp()
  const [data, setData] = useState(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [q, setQ] = useState('')
  const qDebounced = useDebounce(q, 300)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load(){
      try {
        setLoading(true); setError(null)
        const res = await Api.students.list({
          page, size,
          branchId: branchId ?? undefined,
          q: qDebounced || undefined
        })
        if (!mounted) return
        setData(res)
      } catch(e){
        setError(e.message || String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [page, size, branchId, qDebounced])

  const items = (data?.items ?? []).map(normalizeStudent)
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '-'

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Học viên</h2>
          <div className="flex items-center gap-2">
            <input
              className="input w-72"
              placeholder="Tìm theo tên hoặc SĐT..."
              value={q}
              onChange={e=>{ setPage(0); setQ(e.target.value) }}
            />
            <label className="text-sm text-slate-600">Trang</label>
            <select className="select" value={size} onChange={e=>{ setPage(0); setSize(Number(e.target.value))}}>
              {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="card-body overflow-x-auto">
          {loading ? <div>Đang tải...</div> : error ? <div className="text-red-600">{error}</div> : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Phụ huynh</th>
                  <th>CS hỗ trợ</th>
                  <th>Đang học</th>
                  <th>GV đang dạy</th>
                  <th>Bắt đầu học</th>
                </tr>
              </thead>
              <tbody>
                {items.map(s => (
                  <tr key={`${s.id ?? s.phone}`}>
                    <td>{s.id != null ? `#${s.id}` : '#'}</td>
                    <td>{s.fullName || '-'}</td>
                    <td>{s.phone || '-'}</td>
                    <td>{s.parentName || '-'}</td>
                    <td>{s.supportBranch || '-'}</td>
                    <td>{s.studyingClassCount ?? 0}</td>
                    <td>{s.activeTeachers || '-'}</td>
                    <td>{fmtDate(s.startedAt)}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-slate-500 py-6">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-5 py-3 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Trang {(Number.isFinite(data?.page) ? data.page + 1 : 1)} / {(Number.isFinite(data?.totalPages) ? data.totalPages : 1)} · Tổng {(Number.isFinite(data?.totalElements) ? data.totalElements : items.length)}
          </div>
          <div className="flex items-center gap-2"> 
            <button className="btn" disabled={(data?.page ?? 0) <= 0} onClick={()=>setPage(p=>Math.max(0,p-1))}>Trước</button>
            <button className="btn" disabled={(data?.page ?? 0) >= (data?.totalPages ?? 0)-1} onClick={()=>setPage(p=>p+1)}>Sau</button>
          </div>
        </div>
      </div>
    </div>
  )
}
