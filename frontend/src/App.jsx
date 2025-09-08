import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Classes from './pages/Classes.jsx'
import Students from './pages/Students.jsx'
import Staffs from './pages/Staff.jsx'
import Finance from './pages/Finance.jsx'
import { AppProvider } from './state/AppContext.jsx'
import Attendance from './pages/Attendance.jsx'
import Payroll from './pages/Payroll.jsx'
import Schedule from './pages/Schedule.jsx'

export default function App(){
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/students" element={<Students />} />
          <Route path="/staffs" element={<Staffs />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<Payroll />} />
        </Routes>
      </Layout>
    </AppProvider>
  )
}
