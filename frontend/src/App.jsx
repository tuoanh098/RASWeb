import { Routes, Route, Navigate } from "react-router-dom";
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
import Courses1 from "./pages/Courses1.jsx";
//Salary
import ESalary from "./pages/finance/EmployeeSalary.jsx";

const Courses = () => <div className="card"><div className="card-header"><h2>Thông tin khóa học</h2></div><div className="card-body">Đang cập nhật…</div></div>;
const Settings = () => <div className="card"><div className="card-header"><h2>Cài đặt</h2></div><div className="card-body">Đang cập nhật…</div></div>;
function isAuthed() {
  return !!(localStorage.getItem("ras_auth") || sessionStorage.getItem("ras_auth"));
}
function RequireAuth({ children }) {
  const location = useLocation();
  return isAuthed() ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard1/>} />
        <Route path="/khoa-hoc" element={<Courses1/>} />
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
        <Route path="/cai-dat" element={<Settings/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
