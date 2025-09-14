import { NavLink, Outlet } from "react-router-dom";

export default function ManageLayout(){
  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">
          <h2 className="font-semibold text-slate-800">Quản lý</h2>
          <div className="mt-2 flex gap-2">
            <NavLink to="diem-danh" className={({isActive}) =>
              `px-3 py-1 rounded-md border ${isActive? 'bg-slate-900 text-white border-slate-900':'bg-white hover:bg-slate-100'}`
            }>Điểm danh</NavLink>
            <NavLink to="xep-lop" className={({isActive}) =>
              `px-3 py-1 rounded-md border ${isActive? 'bg-slate-900 text-white border-slate-900':'bg-white hover:bg-slate-100'}`
            }>Xếp lớp</NavLink>
            <NavLink to="xep-lich-truc" className={({isActive}) =>
              `px-3 py-1 rounded-md border ${isActive? 'bg-slate-900 text-white border-slate-900':'bg-white hover:bg-slate-100'}`
            }>Xếp lịch trực</NavLink>
          </div>
        </div>
        <div className="card-body">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}
