import React, { useEffect, useMemo, useState } from 'react'
import { Api } from '../lib/api.js'

export default function Finance(){
  const [enrollments, setEnrollments] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    async function load(){
      try {
        setLoading(true); setError(null)
        // We derive simple KPIs from enrollments as placeholder until invoice APIs are added.
        const enr = await Api.enrollments.list({ page: 0, size: 1000 })
        if (!mounted) return
        setEnrollments(enr?.items ?? [])
      } catch(e){
        setError(e.message || String(e))
      } finally { setLoading(false) }
    }
    load()
    return ()=>{ mounted = false }
  }, [])

  const kpi = useMemo(()=>{
    const arr = enrollments ?? []
    return {
      enrollments: arr.length,
      students: new Set(arr.map(x => x.studentId)).size,
      classes: new Set(arr.map(x => x.classId)).size
    }
  }, [enrollments])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="kpi"><h3>Tổng ghi danh</h3><div className="value">{kpi.enrollments}</div></div>
        <div className="kpi"><h3>Số học viên</h3><div className="value">{kpi.students}</div></div>
        <div className="kpi"><h3>Số lớp</h3><div className="value">{kpi.classes}</div></div>
      </div>

      <div className="card">
        <div className="card-header"><h2 className="font-semibold text-slate-800">Tạm thời</h2></div>
        <div className="card-body">
          <p className="text-sm text-slate-600">
            Chưa có API hóa đơn/thanh toán trong backend mẫu. Màn hình này đang **tổng hợp sơ bộ** từ ghi danh để bạn kiểm tra data từ MySQL.
            Khi bạn thêm endpoints tài chính (Invoice/Payment), mình sẽ nối vào ngay.
          </p>
        </div>
      </div>
    </div>
  )
}
