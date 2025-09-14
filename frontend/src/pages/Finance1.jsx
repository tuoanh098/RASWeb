import React, { useEffect, useMemo, useState } from "react";

/**
 * Finance1.jsx — Bảng tài chính cho RAS (không phụ thuộc thư viện ngoài)
 * - Tông màu chủ đạo RAS (có thể chỉnh ở hằng số THEME bên dưới)
 * - Biểu đồ: Doanh thu vs Chi phí theo tháng, Cơ cấu chi phí (donut), Doanh thu theo chi nhánh (bar)
 * - Bộ lọc theo tháng + chi nhánh, tìm kiếm
 * - Bảng chi phí: thêm/sửa/xoá tại chỗ, lưu localStorage (key: ras_finance1)
 */

// ======================= THEME =======================
const THEME = {
  primary: "#6d28d9",   // violet-700
  secondary: "#0ea5e9", // sky-500
  accent: "#f59e0b",    // amber-500
  green: "#10b981",     // emerald-500
  red: "#ef4444",       // red-500
  slate: "#64748b",     // slate-500
};

// ======================= MOCK DATA ====================
const BRANCHES = [
  { id: 1, name: "RAS Quận 1" },
  { id: 3, name: "RAS Quận 3" },
  { id: 7, name: "RAS Quận 7" },
];

const CATEGORIES = [
  "Lương", "Thuê mặt bằng", "Điện nước", "Marketing", "Nhạc cụ & Vật tư", "Bảo trì", "Sự kiện"
];

const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];

// Doanh thu & chi phí theo tháng (triệu VND)
const BASE_REVENUE = {
  1: [600, 620, 650, 670, 700, 740, 780, 810, 830, 860, 900, 920], // Quận 1
  3: [420, 430, 450, 480, 520, 560, 590, 610, 640, 670, 700, 720], // Quận 3
  7: [500, 510, 530, 560, 600, 640, 680, 710, 740, 770, 800, 830], // Quận 7
};
const BASE_EXPENSE = {
  1: [380, 390, 400, 410, 430, 450, 470, 480, 490, 510, 520, 540],
  3: [270, 275, 280, 290, 300, 320, 330, 340, 350, 360, 370, 380],
  7: [320, 330, 340, 350, 370, 380, 395, 405, 420, 430, 445, 460],
};

function genExpenseRows(year = new Date().getFullYear()) {
  // tạo các khoản chi ví dụ trong năm
  const rows = [];
  let id = 1;
  for (let m = 1; m <= 12; m++) {
    for (const b of BRANCHES) {
      // khoảng 8 khoản chi mỗi tháng mỗi chi nhánh
      for (let k = 0; k < 8; k++) {
        const cat = CATEGORIES[(m + k + b.id) % CATEGORIES.length];
        const day = String(2 + (k % 26)).padStart(2, "0");
        const amount = Math.round(5 + Math.random() * 60) * 1000000 * (cat === "Lương" ? 2 : 1);
        rows.push({
          id: id++,
          date: `${year}-${String(m).padStart(2, "0")}-${day}`,
          branchId: b.id,
          branch: b.name,
          category: cat,
          vendor: cat === "Lương" ? "Payroll" : (cat === "Thuê mặt bằng" ? "Landlord" : "Vendor #" + ((k % 5) + 1)),
          note: "",
          amount,
        });
      }
    }
  }
  return rows;
}

// ======================= HELPERS ======================
const LS_KEY = "ras_finance1";
const vnd = (n) => (n == null ? "—" : n.toLocaleString("vi-VN"));
const sum = (arr, pick = (x) => x) => arr.reduce((t, x) => t + (pick(x) || 0), 0);

// ======================= CHARTS (SVG) =================
function LineChart({ series, labels, height = 220, strokeWidth = 2 }) {
  const width = 680; // viewBox width
  const padding = { l: 40, r: 10, t: 10, b: 28 };
  const innerW = width - padding.l - padding.r;
  const innerH = height - padding.t - padding.b;

  const allY = series.flatMap((s) => s.data);
  const yMin = 0;
  const yMax = Math.max(1, Math.ceil(Math.max(...allY) * 1.15));

  const xStep = innerW / Math.max(1, labels.length - 1);
  const yScale = (v) => padding.t + innerH - (v - yMin) * innerH / (yMax - yMin);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const y = padding.t + innerH * p;
        return <line key={i} x1={padding.l} x2={width - padding.r} y1={y} y2={y} stroke="#e2e8f0" />;
      })}
      {/* axes labels */}
      {labels.map((lb, i) => (
        <text key={lb + i} x={padding.l + i * xStep} y={height - 8} fontSize="10" textAnchor="middle" fill="#64748b">{lb}</text>
      ))}
      {/* lines */}
      {series.map((s, idx) => {
        const d = s.data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${padding.l + i * xStep} ${yScale(v)}`).join(' ');
        return (
          <g key={idx}>
            <path d={d} fill="none" stroke={s.color} strokeWidth={strokeWidth} />
            {s.data.map((v, i) => (
              <circle key={i} cx={padding.l + i * xStep} cy={yScale(v)} r={2.5} fill={s.color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function BarChart({ values, labels, color = THEME.primary, height = 220 }) {
  const width = 420;
  const padding = { l: 34, r: 10, t: 10, b: 28 };
  const innerW = width - padding.l - padding.r;
  const innerH = height - padding.t - padding.b;
  const maxV = Math.max(1, Math.max(...values) * 1.15);
  const barW = innerW / values.length * 0.6;
  const gap = innerW / values.length * 0.4;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {[0, 0.5, 1].map((p, i) => {
        const y = padding.t + innerH * p;
        return <line key={i} x1={padding.l} x2={width - padding.r} y1={y} y2={y} stroke="#e2e8f0" />;
      })}
      {labels.map((lb, i) => (
        <text key={lb + i} x={padding.l + i * (barW + gap) + barW / 2} y={height - 8} fontSize="10" textAnchor="middle" fill="#64748b">{lb}</text>
      ))}
      {values.map((v, i) => {
        const h = (v / maxV) * innerH;
        const x = padding.l + i * (barW + gap);
        const y = padding.t + innerH - h;
        return <rect key={i} x={x} y={y} width={barW} height={h} rx={6} fill={color} />;
      })}
    </svg>
  );
}

function DonutChart({ items, height = 220 }) {
  const width = 220;
  const cx = width / 2, cy = height / 2;
  const r = Math.min(cx, cy) - 8;
  const ir = r * 0.6;
  const total = Math.max(1, sum(items, (x) => x.value));
  let angle = -Math.PI / 2; // start top

  function arcPath(a0, a1) {
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a0), yi0 = cy + ir * Math.sin(a0);
    const xi1 = cx + ir * Math.cos(a1), yi1 = cy + ir * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${ir} ${ir} 0 ${large} 0 ${xi0} ${yi0} Z`;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {items.map((it, idx) => {
        const frac = (it.value || 0) / total;
        const a0 = angle;
        const a1 = angle + frac * 2 * Math.PI;
        angle = a1;
        return <path key={idx} d={arcPath(a0, a1)} fill={it.color} stroke="#fff" strokeWidth={1} />;
      })}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="14" fontWeight="700">{vnd(total)} đ</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#64748b">Tổng chi</text>
    </svg>
  );
}

// ======================= MAIN PAGE ====================
export default function Finance1() {
  const now = new Date();
  const year = now.getFullYear();
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [branchId, setBranchId] = useState(0); // 0 = tất cả
  const [q, setQ] = useState("");

  // chi phí chi tiết (persist)
  const [expenses, setExpenses] = useState(() => {
    try {
      const fromLS = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      return Array.isArray(fromLS) && fromLS.length ? fromLS : genExpenseRows(year);
    } catch { return genExpenseRows(year); }
  });
  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(expenses)); }, [expenses]);

  // ======= Tổng hợp theo tháng / chi nhánh =======
  const monthIdx = Number(month) - 1;
  const revByBranch = BRANCHES.map(b => BASE_REVENUE[b.id][monthIdx] * 1_000_000);
  const expByBranch = BRANCHES.map(b => BASE_EXPENSE[b.id][monthIdx] * 1_000_000);
  const totalRevenue = sum(revByBranch);
  const totalExpense = sum(expByBranch);
  const gross = totalRevenue - totalExpense;
  const margin = totalRevenue ? Math.round(gross / totalRevenue * 100) : 0;

  // Doanh thu/chi phí cả năm (để vẽ line chart)
  const seriesRev = MONTHS.map((m, i) => sum(BRANCHES, b => BASE_REVENUE[b.id][i]));
  const seriesExp = MONTHS.map((m, i) => sum(BRANCHES, b => BASE_EXPENSE[b.id][i]));

  // Breakdown chi phí theo category trong tháng được chọn
  const expRowsMonth = expenses.filter(e => e.date.slice(0,7) === `${year}-${month}` && (!branchId || e.branchId === Number(branchId)));
  const byCategory = CATEGORIES.map((c, idx) => ({
    name: c,
    value: sum(expRowsMonth.filter(r => r.category === c), x => x.amount),
    color: [THEME.red, THEME.accent, "#60a5fa", "#f472b6", THEME.slate, THEME.green, THEME.primary][idx % 7],
  })).filter(x => x.value > 0);

  const branchLabels = BRANCHES.map(b => b.name.replace("RAS ", ""));
  const branchValues = (branchId ? [BRANCHES.find(b => b.id === Number(branchId))] : BRANCHES)
    .map(b => BASE_REVENUE[b.id][monthIdx]);

  // ======= Bảng chi phí lọc/sort =======
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  function onSort(k){ if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(k); setSortDir('asc'); } }

  const filteredRows = useMemo(() => {
    const k = q.trim().toLowerCase();
    let arr = expenses.filter(e => e.date.slice(0,7) === `${year}-${month}`);
    if (branchId) arr = arr.filter(e => e.branchId === Number(branchId));
    if (k) arr = arr.filter(e => `${e.category} ${e.vendor} ${e.note}`.toLowerCase().includes(k));
    arr.sort((a,b) => {
      const A = a[sortKey];
      const B = b[sortKey];
      const cmp = sortKey === 'amount' ? (A - B) : String(A).localeCompare(String(B));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [expenses, month, branchId, q, sortKey, sortDir]);

  // Thêm khoản chi nhanh
  const [draft, setDraft] = useState({ date: `${year}-${month}-15`, branchId: BRANCHES[0].id, category: CATEGORIES[0], vendor: "", note: "", amount: 1000000 });
  function addExpense(){
    const id = (expenses.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
    const b = BRANCHES.find(x => x.id === Number(draft.branchId));
    setExpenses(prev => [{ id, ...draft, amount: Number(draft.amount)||0, branch: b?.name || "" }, ...prev]);
  }
  function removeExpense(id){ if (!confirm('Xoá khoản chi này?')) return; setExpenses(prev => prev.filter(x => x.id !== id)); }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{color: THEME.primary}}>Tài chính</h1>
          <div className="text-slate-500 text-sm">Tổng quan doanh thu & chi phí theo tháng</div>
        </div>
        <div className="flex gap-2">
          <select className="border rounded px-2 py-2" value={month} onChange={e=>setMonth(e.target.value)}>
            {MONTHS.map(m => <option key={m} value={m}>Tháng {m}</option>)}
          </select>
          <select className="border rounded px-2 py-2" value={branchId} onChange={e=>setBranchId(Number(e.target.value))}>
            <option value={0}>Tất cả chi nhánh</option>
            {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4 bg-white">
          <div className="text-slate-500 text-sm">Doanh thu tháng {month}</div>
          <div className="text-2xl font-bold" style={{color: THEME.secondary}}>{vnd(totalRevenue)} đ</div>
        </div>
        <div className="rounded-2xl border p-4 bg-white">
          <div className="text-slate-500 text-sm">Chi phí tháng {month}</div>
          <div className="text-2xl font-bold" style={{color: THEME.red}}>{vnd(totalExpense)} đ</div>
        </div>
        <div className="rounded-2xl border p-4 bg-white">
          <div className="text-slate-500 text-sm">Lợi nhuận gộp</div>
          <div className="text-2xl font-bold" style={{color: THEME.green}}>{vnd(gross)} đ</div>
          <div className="text-slate-500 text-xs">Biên lợi nhuận: {margin}%</div>
        </div>
      </div>

      {/* Charts row: Line + Donut + Branch Bar */}
      <div className="grid xl:grid-cols-3 gap-4">
        <div className="rounded-2xl border p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Doanh thu vs Chi phí (năm)</div>
            <div className="text-xs text-slate-500">triệu VND</div>
          </div>
          <LineChart
            labels={MONTHS.map(m=>`T${m}`)}
            series={[
              { name: 'Revenue', color: THEME.secondary, data: seriesRev },
              { name: 'Expense', color: THEME.red, data: seriesExp },
            ]}
          />
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{background: THEME.secondary}}></span>Doanh thu</span>
            <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{background: THEME.red}}></span>Chi phí</span>
          </div>
        </div>

        <div className="rounded-2xl border p-4 bg-white">
          <div className="font-semibold mb-2">Cơ cấu chi phí (tháng {month})</div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <DonutChart items={byCategory} />
            <div className="text-sm space-y-1">
              {byCategory.map((x, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded" style={{background: x.color}}></span>
                    <span>{x.name}</span>
                  </div>
                  <div className="text-right text-slate-600">{vnd(x.value)} đ</div>
                </div>
              ))}
              {!byCategory.length && <div className="text-slate-500 text-sm">Chưa có chi phí trong tháng này.</div>}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-4 bg-white">
          <div className="font-semibold mb-2">Doanh thu theo chi nhánh (tháng {month})</div>
          <BarChart values={branchValues} labels={branchLabels} color={THEME.primary} />
        </div>
      </div>

      {/* Expenses table */}
      <div className="rounded-2xl border p-4 bg-white">
        <div className="flex items-end justify-between gap-2 flex-wrap mb-3">
          <div className="font-semibold">Chi phí chi tiết (tháng {month})</div>
          <div className="flex gap-2">
            <input className="border rounded px-2 py-2" placeholder="Tìm theo danh mục / nhà cung cấp / ghi chú" value={q} onChange={e=>setQ(e.target.value)} />
            <button
              className="px-3 py-2 rounded text-white"
              style={{background: THEME.accent}}
              onClick={() => {
                const csv = ["date,branch,category,vendor,note,amount"].concat(
                  filteredRows.map(r => [r.date, r.branch, r.category, r.vendor, r.note, r.amount].map(v => JSON.stringify(v || "")).join(','))
                ).join('\n');
                const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'}); const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `expenses_${year}_${month}.csv`; a.click(); URL.revokeObjectURL(url);
              }}
            >Xuất CSV</button>
          </div>
        </div>

        {/* Add quick */}
        <div className="grid md:grid-cols-6 gap-2 mb-3">
          <input className="border rounded px-2 py-2" type="date" value={draft.date} onChange={e=>setDraft({...draft, date: e.target.value})} />
          <select className="border rounded px-2 py-2" value={draft.branchId} onChange={e=>setDraft({...draft, branchId: Number(e.target.value)})}>
            {BRANCHES.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select className="border rounded px-2 py-2" value={draft.category} onChange={e=>setDraft({...draft, category: e.target.value})}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="border rounded px-2 py-2" placeholder="Nhà cung cấp" value={draft.vendor} onChange={e=>setDraft({...draft, vendor: e.target.value})} />
          <input className="border rounded px-2 py-2" placeholder="Ghi chú" value={draft.note} onChange={e=>setDraft({...draft, note: e.target.value})} />
          <input className="border rounded px-2 py-2" type="number" placeholder="Số tiền" value={draft.amount} onChange={e=>setDraft({...draft, amount: e.target.value})} />
          <div className="md:col-span-6"><button className="px-3 py-2 rounded text-white" style={{background: THEME.primary}} onClick={addExpense}>+ Thêm khoản chi</button></div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-y">
              <tr>
                <ThSort k="date" onSort={onSort} activeKey={sortKey} dir={sortDir}>Ngày</ThSort>
                <th className="text-left p-2">Chi nhánh</th>
                <ThSort k="category" onSort={onSort} activeKey={sortKey} dir={sortDir}>Danh mục</ThSort>
                <th className="text-left p-2">Nhà cung cấp</th>
                <th className="text-left p-2">Ghi chú</th>
                <ThSort k="amount" onSort={onSort} activeKey={sortKey} dir={sortDir} right>Số tiền</ThSort>
                <th className="text-left p-2"> </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="p-2 whitespace-nowrap">{r.date}</td>
                  <td className="p-2 whitespace-nowrap">{r.branch}</td>
                  <td className="p-2 whitespace-nowrap">{r.category}</td>
                  <td className="p-2">{r.vendor}</td>
                  <td className="p-2">{r.note}</td>
                  <td className="p-2 text-right whitespace-nowrap">{vnd(r.amount)} đ</td>
                  <td className="p-2 text-right"><button className="text-red-600" onClick={()=>removeExpense(r.id)}>Xoá</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="p-2 font-medium" colSpan={5}>Tổng</td>
                <td className="p-2 text-right font-semibold">{vnd(sum(filteredRows, x=>x.amount))} đ</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function ThSort({ k, activeKey, dir, onSort, children, right }){
  const is = activeKey === k; const arrow = is ? (dir === 'asc' ? '▲' : '▼') : '△';
  return (
    <th className={`p-2 text-left ${right ? 'text-right' : ''}`}> 
      <button className="inline-flex items-center gap-1" onClick={()=>onSort(k)} title="Sắp xếp">
        {children} <span className="text-slate-400">{arrow}</span>
      </button>
    </th>
  );
}
