import React, { useEffect, useState } from 'react'
import { Api } from '../lib/api.js'
import { useApp } from '../state/AppContext.jsx'
import { useDebounce } from '../lib/useDebounce.js'

function normalizeClass(c = {}){
  const {
    lop_id, ten_lop, mon_hoc,
    chi_nhanh, ma_chi_nhanh, chi_nhanh_id,
    giao_vien, giao_vien_id,
    trang_thai, so_hoc_vien
  } = c
  return {
    id: lop_id ?? null,
    name: ten_lop || '',
    subject: mon_hoc || '',
    branch: chi_nhanh || '',
    branchCode: ma_chi_nhanh || '',
    branchId: chi_nhanh_id ?? null,
    teacher: giao_vien || '',
    teacherId: giao_vien_id ?? null,
    status: trang_thai || '',
    studentCount: so_hoc_vien ?? 0,
  }
}

export default function Classes(){
  const { branchId } = useApp()
  const [data, setData] = useState(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [q, setQ] = useState('')
  const qDebounced = useDebounce(q, 300)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let on = true
    async function load(){
      try {
        setLoading(true); setError(null)
        const res = await Api.classes.list({ page, size, branchId, q: qDebounced || undefined })
        if (!on) return
        setData(res)
      } catch(e){
        setError(e.message || String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
    return ()=>{ on = false }
  }, [page, size, branchId, qDebounced])

  const items = (data?.items ?? []).map(normalizeClass)

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Danh sách lớp</h2>
          <div className="flex items-center gap-2">
            <input className="input w-72" placeholder="Tìm theo tên lớp..."
                   value={q} onChange={e=>{ setPage(0); setQ(e.target.value) }} />
            <label className="text-sm text-slate-600">Kích thước trang</label>
            <select className="select" value={size} onChange={e=>{ setPage(0); setSize(Number(e.target.value))}}>
              {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="card-body overflow-x-auto">
          {loading ? <div>Đang tải...</div> : error ? <div className="text-red-600">API_500: {error}</div> : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên lớp</th>
                  <th>Khóa học</th>
                  <th>Giáo viên</th>
                  <th>Học viên</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {items.map(c => (
                  <tr key={c.id ?? c.name}>
                    <td>{c.id != null ? `#${c.id}` : '#'}</td>
                    <td>{c.name || '-'}</td>
                    <td>{c.subject || '-'}</td>
                    <td>{c.teacher || '-'}</td>
                    <td>{c.studentCount ?? 0}</td>
                    <td><span className="badge">{c.status || '-'}</span></td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td className="text-center text-slate-500 py-6" colSpan={6}>Không có dữ liệu</td></tr>
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
