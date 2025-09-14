import React, { useEffect, useState } from 'react'
import StudentsApi from "../../lib/studentsApi.js";
import { useApp } from '../../state/AppContext.jsx'
import { useDebounce } from '../../lib/useDebounce.js'

/** ================= Helpers & mapping ================= **/
function normalizeStudent(s = {}) {
  return {
    id: s.id,                                // <-- PK thật trong DB
    fullName: s.hoc_sinh,
    phone: s.hs_phone,
    email: s.email,
    parentName: s.phu_huynh,
    parentPhone: s.phu_huynh_phone,
    supportBranch: s.chi_nhanh_ho_tro,
    startedAt: s.thoi_gian_bat_dau_hoc,
    // Các field tổng hợp/hiển thị thêm (nếu backend trả) – để fallback
    studyingClassCount: s.so_lop_dang_hoc ?? 0,
    activeTeachers: s.giao_vien_dang_day ?? '-',
  }
}

function toBackendPayload(draft) {
  return {
    hoc_sinh: draft.fullName?.trim(),
    hs_phone: draft.phone?.trim(),
    email: draft.email?.trim() || null,
    phu_huynh: draft.parentName?.trim() || null,
    phu_huynh_phone: draft.parentPhone?.trim() || null,
    chi_nhanh_ho_tro: draft.supportBranch?.trim() || null,
  }
}

/** ================= Small UI ================= **/
function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
          </div>
          <div className="p-4">{children}</div>
          {footer && <div className="px-4 py-3 border-t bg-slate-50">{footer}</div>}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium mb-1">{label}</div>
      {children}
    </label>
  )
}

/** ================= Main Page ================= **/
export default function Students() {
  const { branchId } = useApp()
  const [data, setData] = useState(null)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [q, setQ] = useState('')
  const qDebounced = useDebounce(q, 300)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  // CRUD modal state
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('create') // 'create' | 'edit'
  const [draft, setDraft] = useState({
    id: null, fullName: '', phone: '', email: '',
    parentName: '', parentPhone: '', supportBranch: ''
  })

  function openCreate() {
    setMode('create')
    setDraft({
      id: null, fullName: '', phone: '', email: '',
      parentName: '', parentPhone: '', supportBranch: ''
    })
    setOpen(true)
  }

  function openEdit(row) {
    setMode('edit')
    setDraft({
      id: row.id,
      fullName: row.fullName || '',
      phone: row.phone || '',
      email: row.email || '',
      parentName: row.parentName || '',
      parentPhone: row.parentPhone || '',
      supportBranch: row.supportBranch || '',
    })
    setOpen(true)
  }

  async function handleSave() {
    try {
      if (!draft.fullName?.trim()) return alert('Vui lòng nhập Họ tên')
      if (!draft.phone?.trim()) return alert('Vui lòng nhập SĐT')

      const payload = toBackendPayload(draft)
      if (mode === 'create') {
        await  StudentsApi.create(payload)
      } else {
        const id = draft.id
        if (!id) return alert('Không xác định được ID học viên để cập nhật!')
        await  StudentsApi.update(id, payload)
      }
      setOpen(false)
      setReloadToken(x => x + 1) // reload list
      setPage(0)
    } catch (e) {
      alert(`Lỗi lưu học viên: ${e.message || e}`)
    }
  }

  async function handleDelete(row) {
    if (!confirm(`Xoá học viên "${row.fullName}"?`)) return
    try {
      if (!row.id) return alert('Bản ghi không có ID hợp lệ')
      await  StudentsApi.delete(row.id)
      setReloadToken(x => x + 1)
    } catch (e) {
      alert(`Lỗi xoá: ${e.message || e}`)
    }
  }

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true); setError(null)
        const res = await  StudentsApi.list({
          page, size,
          branchId: branchId ?? undefined,
          q: qDebounced || undefined,
        })
        if (!mounted) return
        setData(res)
      } catch (e) {
        setError(e.message || String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [page, size, branchId, qDebounced, reloadToken])

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
              onChange={e => { setPage(0); setQ(e.target.value) }}
            />
            <label className="text-sm text-slate-600">Trang</label>
            <select className="select" value={size} onChange={e => { setPage(0); setSize(Number(e.target.value)) }}>
              {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <button className="btn btn-primary" onClick={openCreate}>+ Thêm học viên</button>
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
                  <th style={{ width: 120 }}>Thao tác</th>
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
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="btn btn-sm" onClick={() => openEdit(s)}>Sửa</button>
                        <button className="btn btn-sm text-red-600 border-red-200" onClick={() => handleDelete(s)}>Xoá</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={9} className="text-center text-slate-500 py-6">Không có dữ liệu</td></tr>
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
            <button className="btn" disabled={(data?.page ?? 0) <= 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Trước</button>
            <button className="btn" disabled={(data?.page ?? 0) >= (data?.totalPages ?? 0) - 1} onClick={() => setPage(p => p + 1)}>Sau</button>
          </div>
        </div>
      </div>

      {/* ============== Modal Thêm/Sửa ============== */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={mode === 'create' ? 'Thêm học viên' : `Sửa học viên #${draft?.id ?? ''}`}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button className="btn" onClick={() => setOpen(false)}>Huỷ</button>
            <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Họ tên">
            <input className="input" value={draft.fullName} onChange={e => setDraft({ ...draft, fullName: e.target.value })} />
          </Field>
          <Field label="SĐT">
            <input className="input" value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} />
          </Field>
          <Field label="Email">
            <input className="input" value={draft.email || ''} onChange={e => setDraft({ ...draft, email: e.target.value })} />
          </Field>
          <Field label="Cơ sở hỗ trợ">
            <input className="input" value={draft.supportBranch || ''} onChange={e => setDraft({ ...draft, supportBranch: e.target.value })} />
          </Field>
          <Field label="Tên phụ huynh">
            <input className="input" value={draft.parentName || ''} onChange={e => setDraft({ ...draft, parentName: e.target.value })} />
          </Field>
          <Field label="SĐT phụ huynh">
            <input className="input" value={draft.parentPhone || ''} onChange={e => setDraft({ ...draft, parentPhone: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </div>
  )
}
