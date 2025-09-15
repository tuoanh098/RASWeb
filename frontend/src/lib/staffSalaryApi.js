// src/lib/staffSalaryApi.js
import { req, qs } from "./http.js";

export async function listStaffSalary({ ky, page = 0, size = 20 }) {
  // Trả về PageResponse từ backend
  return req("GET", `/api/staff-salary${qs({ ky, page, size })}`);
}

export async function fetchAllStaffSalary({ ky }) {
  // Lấy nhiều để tính KPI
  return req("GET", `/api/staff-salary${qs({ ky, page: 0, size: 1000 })}`)
    .then((data) => data.items || data.content || []);
}

export async function recalcStaffSalary(ky) {
  return req("POST", `/api/staff-salary/recalc`, { ky });
}

export async function updateBaseSalary(bangLuongId, payload) {
  // payload: { luongCung?, ghiChu? }
  return req("PUT", `/api/staff-salary/${bangLuongId}`, payload);
}

export async function addPenalty(payload) {
  // payload: { ky, nhanVienId, ngayThang, soTienPhat, noiDungLoi, chiNhanhId? }
  return req("POST", `/api/staff-salary/penalties`, payload);
}

export async function listPenalties({ ky, nhanVienId, page = 0, size = 20 }) {
  return req(
    "GET",
    `/api/staff-salary/penalties${qs({ ky, nhanVienId, page, size })}`
  );
}
