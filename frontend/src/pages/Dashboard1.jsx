// src/pages/management/DashboardMock.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  TrendingUp, Users, GraduationCap, Banknote, CalendarDays, Building2, Trophy, Loader2, RefreshCcw
} from "lucide-react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

/* ======= RAS look & helpers ======= */
const RAS_COLORS = {
  primary: "#5B38ED",
  primarySoft: "#F1EEFF",
  secondary: "#00B3FF",
  secondarySoft: "#E6F6FF",
  accent: "#10b981",
  warn: "#f59e0b",
  danger: "#ef4444",
  slate: "#64748b",
};
const PIE_COLORS = ["#5B38ED", "#f59e0b", "#10b981", "#06b6d4", "#ef4444", "#8b5cf6"];
const VND = (n) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(n || 0));
const num = (n) => new Intl.NumberFormat("vi-VN").format(Number(n || 0));
const todayISO = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

/* ======= UI atoms ======= */
function Card({ className = "", children }) {
  return <div className={`bg-white/90 border border-slate-200 rounded-2xl shadow-sm ${className}`}>{children}</div>;
}
function KPI({ icon: Icon, title, value, sub }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-xl ring-2"
          style={{
            background: `linear-gradient(180deg, ${RAS_COLORS.primarySoft}, #fff)`,
            color: RAS_COLORS.primary,
            borderColor: RAS_COLORS.primary,
            boxShadow: `0 6px 18px -8px ${RAS_COLORS.primary}`,
          }}
        >
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <div className="text-slate-500 text-[11px] uppercase tracking-[0.08em]">{title}</div>
          <div className="text-xl font-semibold text-slate-900">{value}</div>
          {sub && <div className="text-xs text-slate-500">{sub}</div>}
        </div>
      </div>
    </Card>
  );
}
function SectionTitle({ icon: Icon, title, right }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-indigo-600" />
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <div>{right}</div>
    </div>
  );
}

/* ======= Mock helpers ======= */
const rand = (min, max) => Math.round(Math.random() * (max - min) + min);
const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

function genMonthlyRevenue() {
  // tạo xu hướng tăng nhẹ theo tháng
  return months.map((m, i) => ({
    month: m,
    revenue: rand(150, 300) * 1_000_000 + i * rand(5, 20) * 1_000_000,
  }));
}
function genYearlyRevenue(baseYear) {
  return Array.from({ length: 5 }, (_, k) => {
    const y = baseYear - 4 + k;
    return { year: y, revenue: rand(2, 8) * 1_000_000_000 + k * rand(200, 600) * 1_000_000_000 };
  });
}
function genDutyToday() {
  const list = [
    { id: 1, nhan_vien_ten: "Nguyễn An", chi_nhanh_ten: "Q7", ghi_chu: "Ca sáng" },
    { id: 2, nhan_vien_ten: "Trần Bình", chi_nhanh_ten: "Q1", ghi_chu: "Ca chiều" },
    { id: 3, nhan_vien_ten: "Lê Chi", chi_nhanh_ten: "Q7", ghi_chu: "Ca tối" },
  ];
  return list.slice(0, rand(0, list.length)); // có thể không có lịch
}
function genTopAdvisors() {
  const names = ["Dương", "Quyên", "Khang"];
  return names.map((n, i) => ({ id: i + 1, name: n, count: rand(5, 25) }));
}

/* ======= Dashboard (mock data) ======= */
export default function Dashboard() {
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);
  const [loading, setLoading] = useState(false);

  // mock states
  const [kpis, setKpis] = useState({ employees: 28, students: 312, coursesRegistered: 96, revenueMonth: 0, revenueYear: 0 });
  const [dutyToday, setDutyToday] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [yearlyRevenue, setYearlyRevenue] = useState([]);
  const [financeBreakdown, setFinanceBreakdown] = useState([]);
  const [topAdvisors, setTopAdvisors] = useState([]);

  const calcFinance = (mData) => {
    const revenue = mData.reduce((s, d) => s + d.revenue, 0);
    const payroll = Math.round(revenue * 0.45);
    const profit = revenue - payroll;
    return [
      { name: "Doanh thu", value: revenue },
      { name: "Chi phí", value: payroll },
      { name: "Lợi nhuận", value: profit },
    ];
  };

  const refreshMock = () => {
    setLoading(true);
    // mô phỏng delay nhẹ
    setTimeout(() => {
      const m = genMonthlyRevenue();
      const y = genYearlyRevenue(thisYear);
      const duty = genDutyToday();
      const advisors = genTopAdvisors();

      setMonthlyRevenue(m);
      setYearlyRevenue(y);
      setDutyToday(duty);
      setTopAdvisors(advisors);

      const revMonth = m[new Date().getMonth()]?.revenue ?? 0;
      const revYear = m.reduce((s, d) => s + d.revenue, 0);
      setKpis((k) => ({ ...k, revenueMonth: revMonth, revenueYear: revYear }));

      setFinanceBreakdown(calcFinance(m));
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    refreshMock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">Dashboard</h1>
          <div className="text-slate-500 text-sm">Hôm nay • {todayISO()}</div>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="border rounded-xl px-3 py-2 text-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            title="Năm"
          >
            {Array.from({ length: 6 }, (_, i) => thisYear - 3 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            className="flex items-center gap-2 border rounded-xl px-3 py-2 text-sm hover:bg-slate-50"
            onClick={refreshMock}
            title="Làm mới mock data"
          >
            <RefreshCcw size={16} /> Làm mới
          </button>
          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="animate-spin" size={16} /> Đang tạo dữ liệu…
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPI icon={Users} title="Tổng nhân viên" value={num(kpis.employees)} />
        <KPI icon={GraduationCap} title="Tổng học sinh" value={num(kpis.students)} />
        <KPI icon={TrendingUp} title="KH đăng ký" value={num(kpis.coursesRegistered)} />
        <KPI icon={Banknote} title="Doanh thu tháng" value={VND(kpis.revenueMonth)} />
        <KPI icon={Banknote} title="Doanh thu năm" value={VND(kpis.revenueYear)} />
        <KPI icon={CalendarDays} title="Lịch trực hôm nay" value={`${dutyToday.length} ca`} />
      </div>

      {/* Row: Monthly revenue + Finance breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 lg:col-span-2">
          <SectionTitle icon={TrendingUp} title={`Doanh thu theo tháng • ${year}`} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => (v / 1_000_000) + "tr"} />
                <Tooltip formatter={(v) => VND(v)} labelFormatter={(label) => `Tháng ${label}`} />
                <Line type="monotone" dataKey="revenue" stroke={RAS_COLORS.primary} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle icon={Banknote} title="Tài chính (tỷ trọng)" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={financeBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {financeBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip formatter={(v, n) => [VND(v), n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row: Yearly revenue + Duty today + Top advisors */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="p-4 xl:col-span-2">
          <SectionTitle icon={TrendingUp} title="Doanh thu theo năm" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => (v / 1_000_000_000) + " tỷ"} />
                <Tooltip formatter={(v) => VND(v)} />
                <Bar dataKey="revenue" fill={RAS_COLORS.accent} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <SectionTitle icon={CalendarDays} title="Lịch trực hôm nay" right={<span className="text-xs text-slate-500">{todayISO()}</span>} />
            <div className="space-y-2">
              {dutyToday.length === 0 && <div className="text-slate-500 text-sm">Không có lịch trực.</div>}
              {dutyToday.map((x) => (
                <div key={x.id} className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                  <div>
                    <div className="font-medium text-indigo-900">{x.nhan_vien_ten}</div>
                    <div className="text-xs text-indigo-800/80">
                      {(x.chi_nhanh_ten ?? "")}{x.ghi_chu ? ` • ${x.ghi_chu}` : ""}
                    </div>
                  </div>
                  <Building2 size={18} className="text-indigo-600" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <SectionTitle icon={Trophy} title="NV tư vấn nhiều nhất" />
            <div className="space-y-2">
              {topAdvisors.map((x, i) => (
                <div key={x.id ?? i} className="flex items-center justify-between bg-white border rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs grid place-items-center">{i + 1}</span>
                    <div className="font-medium text-slate-800">{x.name}</div>
                  </div>
                  <div className="text-sm text-slate-600">{num(x.count)} KH</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
