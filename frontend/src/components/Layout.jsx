import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../state/AppContext.jsx'

function BranchSwitcher() {
  const { branchId, setBranchId } = useApp()
  const branches = [
    { id: 1, name: "Cơ sở 1" },
    { id: 2, name: "Cơ sở 2" },
    { id: 3, name: "Cơ sở 3" }, 
  ]
  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-base font-semibold leading-tight">Cơ sở:</span>
      <select
        className="input w-32"
        value={branchId ?? ''}
        onChange={e => setBranchId(e.target.value === '' ? null : Number(e.target.value))}
      >
        <option value="">Tất cả</option>
        {branches.map(b => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
    </div>
  )
}

const tabs = [
  { to: '/', label: 'Tổng quan' },
  { to: '/classes', label: 'Lớp' },
  { to: '/schedule', label: 'Lịch học' },
  { to: '/students', label: 'Học viên' },
  { to: '/staffs', label: 'Nhân lực' },
  { to: '/attendance', label: 'Điểm danh' }, 
  { to: '/payroll', label: 'Lương' }     ,
  { to: '/finance', label: 'Tài chính' }
]


export default function Layout({ children }) {
  const location = useLocation()
  const isTeacherOrStudentTab = ['/students','/teachers'].includes(location.pathname)

  return (
    <div className="min-h-screen">
      <header className="bg-ras-blue border-b border-ras-blue">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between bg-ras-blue rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-ras-white flex items-center justify-center overflow-hidden">
              <img src="\src\assets\ras_logo.jpg" alt="RAS Logo" className="w-14 h-14 object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-white leading-5 text-xl">RAS Music & Art</h1>
            </div>
          </div>
          <div className="flex items-center gap-6 justify-end flex-1">
            {/* BranchSwitcher nằm cạnh tabs */}
            {!isTeacherOrStudentTab && <BranchSwitcher />}
            {/* Avatar + info góc phải */}
            <div className="flex flex-col items-center mr-2 absolute top-6 right-12">
              <div className="text-white text-base font-semibold leading-tight">Nguyễn Văn A</div>
              <div className="text-ras-yellow text-sm mb-2">Quản trị viên</div>
              <button
                className="px-4 py-1 rounded-lg bg-ras-purple text-white text-sm font-medium hover:bg-ras-blue transition"
                onClick={() => {/* TODO: Đăng xuất */}}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="bg-ras-purple/10">
          <div className="container mx-auto px-4">
            <nav className="flex gap-2 overflow-x-auto py-2">
              {tabs.map(t => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg font-medium transition
                    ${isActive
                      ? 'bg-ras-purple text-white'
                      : 'bg-white text-ras-blue hover:bg-ras-purple hover:text-white'}`
                  }
                >
                  {t.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
