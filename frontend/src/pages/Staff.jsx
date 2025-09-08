// frontend/src/pages/Staff.jsx
import React, { useEffect, useState } from "react";
import { Api } from "../lib/api";

function useDebounce(v, ms = 400) {
  const [d, setD] = useState(v);
  useEffect(() => { const t = setTimeout(() => setD(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return d;
}

export default function StaffPage() {
  // tab: 'teachers' | 'employees'
  const [tab, setTab] = useState("teachers");

  // tìm kiếm + phân trang
  const [kw, setKw] = useState("");
  const dkw = useDebounce(kw, 300);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [data, setData] = useState({ items: [], totalElements: 0, page: 0, size: 10, totalPages: 1 });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // gọi API theo tab
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true); setErr("");
        const fetcher =
          tab === "teachers"
            ? Api.teachers?.search
            : Api.employees?.search;
        if (!fetcher) throw new Error("API chưa khai báo");
        const res = await fetcher({ kw: dkw, page, size });
        if (!cancel) setData(res);
      } catch (e) {
        if (!cancel) setErr(e.message || "Lỗi không xác định");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [tab, dkw, page, size]);

  const canPrev = page > 0;
  const canNext = page + 1 < (data?.totalPages ?? 1);

  const tabBtn = (active) =>
    `px-3 py-1 rounded-md border ${
      active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
    }`;

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <div className="inline-flex gap-2 items-center">
            <button className={tabBtn(tab === "teachers")} onClick={() => { setTab("teachers"); setPage(0); }}>
              Giáo viên
            </button>
            <button className={tabBtn(tab === "employees")} onClick={() => { setTab("employees"); setPage(0); }}>
              Nhân viên
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              className="input w-72"
              placeholder="Tìm theo tên hoặc SĐT..."
              value={kw}
              onChange={(e) => { setPage(0); setKw(e.target.value); }}
            />
            <label className="text-sm text-slate-600">Trang</label>
            <select
              className="select"
              value={size}
              onChange={(e) => { setPage(0); setSize(Number(e.target.value)); }}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card-body overflow-x-auto">
          {err && <div className="text-red-600 mb-2">{err}</div>}

          {loading ? (
            <div>Đang tải...</div>
          ) : tab === "teachers" ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Email</th>
                  <th>Chuyên môn</th>
                  <th>Số lớp đang dạy</th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.length ? (
                  data.items.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id != null ? `#${t.id}` : "#"}</td>
                      <td>{t.hoTen || "-"}</td>
                      <td>{t.soDienThoai || "-"}</td>
                      <td className="text-slate-600">{t.email || "-"}</td>
                      <td>{t.chuyenMon || "-"}</td>
                      <td>{t.soLopDangDay ?? 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-slate-500 py-6">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Email</th>
                  <th>Chức danh</th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.length ? (
                  data.items.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id != null ? `#${s.id}` : "#"}</td>
                      <td>{s.hoTen || "-"}</td>
                      <td>{s.soDienThoai || "-"}</td>
                      <td className="text-slate-600">{s.email || "-"}</td>
                      <td>{s.chucVu || s.chuc_danh || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-slate-500 py-6">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-5 py-3 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Trang {(Number.isFinite(data?.page) ? data.page + 1 : 1)} / {(Number.isFinite(data?.totalPages) ? data.totalPages : 1)} · Tổng {(Number.isFinite(data?.totalElements) ? data.totalElements : data.items.length)}
          </div>
          <div className="flex items-center gap-2">
            <button className="btn" disabled={!canPrev} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              Trước
            </button>
            <button className="btn" disabled={!canNext} onClick={() => setPage((p) => p + 1)}>
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
