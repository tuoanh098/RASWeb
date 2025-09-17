import { Routes, Route, Navigate ,useLocation } from "react-router-dom";
import { useEffect, useState } from "react"
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
// team
import TeamLayout from "./pages/team/TeamLayout.jsx";
import TeamStudents from "./pages/team/TeamStudents.jsx";
import TeamEmployees from "./pages/team/TeamEmployees.jsx";
import TeamAccounts from "./pages/team/TeamAccounts.jsx";
// management
import ManageLayout from "./pages/management/ManageLayout.jsx";
import DutyRoster from "./pages/management/DutyRoster.jsx";
import Attendance from "./pages/management/Attendance.jsx";
import Schedule from "./pages/management/Schedule.jsx";
// dashboard
import Dashboard1 from "./pages/Dashboard1.jsx";
// courses
import CoursesLayout from "./pages/courses/CoursesLayout.jsx"
import Courses from  "./pages/courses/Courses.jsx"
import Enrollment from "./pages/courses/Enrollment.jsx"
//Salary
import ESalary from "./pages/finance/EmployeeSalary.jsx";

function getAuth() {
  const raw = localStorage.getItem("ras_auth") || sessionStorage.getItem("ras_auth");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

function RequireAuth({ children }) {
  const location = useLocation();
  const [ok, setOk] = useState(null); // null=đang kiểm tra, true=ok, false=fail

  useEffect(() => {
    const a = getAuth();
    if (!a?.token) { setOk(false); return; }
    fetch("/api/auth/me", { headers: { Authorization: "Bearer " + a.token }})
      .then(r => { if (r.ok) setOk(true); else throw 0; })
      .catch(() => {
        localStorage.removeItem("ras_auth");
        sessionStorage.removeItem("ras_auth");
        setOk(false);
      });
  }, [location.pathname]);

  if (ok === null) return <div style={{padding:16}}>Đang kiểm tra phiên đăng nhập…</div>;
  return ok ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export default function App() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <RequireAuth>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard1/>} />

                <Route path="/khoa-hoc" element={<CoursesLayout/>}>
                  <Route path="xem-khoa-hoc" element={<Courses/>}/>
                  <Route path="dang-ki-khoa-hoc" element={<Enrollment/>}/>
                </Route>
            
                <Route path="/doi-ngu" element={<TeamLayout/>}>
                  <Route path="hoc-vien" element={<TeamStudents/>} />
                  <Route path="nhan-vien" element={<TeamEmployees/>} />
                  <Route path="tai-khoan" element={<TeamAccounts/>} />
                </Route>

                <Route path="/quan-ly" element={<ManageLayout/>}>
                  <Route index element={<Navigate to="diem-danh" replace />} />
                  <Route path="diem-danh" element={<Attendance/>} />
                  <Route path="xep-lop" element={<Schedule/>} />
                  <Route path="xep-lich-truc" element={<DutyRoster/>} />
                </Route>
                <Route path="/luong-nhan-vien" element={<ESalary/>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </RequireAuth>
          } />
      </Routes>
  );
}
