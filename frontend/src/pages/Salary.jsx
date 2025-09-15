import 'tailwindcss/tailwind.css';          // đảm bảo file index.css đã import ở entry (main.jsx)
import styles from './Salary.module.css';
import RasHero from '../components/RasHero';
import RasKpiCard from '../components/RasKpiCard';
import { School, Paid, ReceiptLong } from '@mui/icons-material';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Tabs, Tab, Paper, Grid, Button,
  TextField, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem, Stack, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Refresh as RefreshIcon,
  PlayArrow as RunIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon
} from '@mui/icons-material';

// ========================= Helpers =========================
const api = axios.create({ baseURL: '/api/salary' });

const fmtCurrency = (v) => {
  if (v === null || v === undefined) return '';
  try {
    const num = Number(v);
    return num.toLocaleString('vi-VN');
  } catch {
    return v;
  }
};

const useThemeFromMeta = () => {
  const [theme, setTheme] = useState(createTheme());
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/meta');
        const t = createTheme({
          palette: {
            mode: 'light',
            primary: { main: data.themePrimary || '#E51A4C' },
            secondary: { main: data.themeAccent || '#FFC107' },
            background: { default: '#fafafa' },
          },
          shape: { borderRadius: 12 },
          components: {
            MuiAppBar: { styleOverrides: { root: { background: data.themePrimary || '#E51A4C' } } },
            MuiDataGrid: {
              styleOverrides: {
                root: {
                  border: 'none',
                },
                columnHeaders: {
                  background: data.themeDark || '#121212',
                  color: '#fff',
                },
              }
            },
            MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 10 } } },
            MuiPaper: { styleOverrides: { root: { borderRadius: 14 } } }
          },
          typography: { fontSize: 14, fontWeightRegular: 500 },
        });
        setTheme(t);
      } catch {
        // fallback
      }
    })();
  }, []);
  return theme;
};

// Generic loader with server pagination
const usePaged = (fetcher, deps = [], defaultPageSize = 20) => {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: defaultPageSize });

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetcher({ page: paginationModel.page, size: paginationModel.pageSize });
      const { content, totalElements } = res;
      setRows(content || []);
      setRowCount(totalElements || 0);
    } finally {
      setLoading(false);
    }
  }, [fetcher, paginationModel.page, paginationModel.pageSize]);

  useEffect(() => { reload(); }, deps); // eslint-disable-line

  return { rows, rowCount, loading, paginationModel, setPaginationModel, reload, setRows };
};

// ========================= Dialogs (CRUD) =========================
const DonGiaDialog = ({ open, onClose, initial, onSubmit }) => {
  const [form, setForm] = useState(initial || {});
  useEffect(() => setForm(initial || {}), [initial]);
  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{form?.id ? 'Sửa đơn giá dạy' : 'Thêm đơn giá dạy'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 0 }}>
          {[
            ['monHocId','Môn học ID','number'],
            ['capDoId','Cấp độ ID','number'],
            ['loaiLop','Loại lớp (ca_nhan/nhom/...)','text'],
            ['thoiLuongPhut','Thời lượng (phút)','number'],
            ['hinhThuc','Hình thức (offline/online)','text'],
            ['kieuTinh','Kiểu tính (so_tien/phan_tram_hoc_phi_buoi)','text'],
            ['soTien','Số tiền','number'],
            ['tyLePct','Tỷ lệ %','number'],
            ['uuTien','Ưu tiên (số nhỏ ưu tiên cao)','number'],
            ['hieuLucTu','Hiệu lực từ','date'],
            ['hieuLucDen','Hiệu lực đến','date'],
            ['ghiChu','Ghi chú','text'],
          ].map(([key,label,type]) => (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                fullWidth
                label={label}
                type={type}
                value={form?.[key] ?? ''}
                onChange={(e)=>handle(key, type==='number' ? (e.target.value===''? '' : Number(e.target.value)) : e.target.value)}
                InputLabelProps={type==='date' ? { shrink: true } : undefined}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => onSubmit(form)} startIcon={<CheckIcon/>}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};

const BonusRuleDialog = ({ open, onClose, initial, onSubmit }) => {
  const [form, setForm] = useState(initial || {});
  useEffect(() => setForm(initial || {}), [initial]);
  const handle = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{form?.id ? 'Sửa bonus rule' : 'Thêm bonus rule'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {[
            ['loaiBuoi','Loại buổi (trial/cover/...)','text'],
            ['monHocId','Môn học ID','number'],
            ['thoiLuongPhut','Thời lượng (phút)','number'],
            ['soTien','Số tiền','number'],
            ['heSo','Hệ số','number'],
            ['uuTien','Ưu tiên','number'],
            ['hieuLucTu','Hiệu lực từ','date'],
            ['hieuLucDen','Hiệu lực đến','date'],
            ['ghiChu','Ghi chú','text'],
          ].map(([key,label,type]) => (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                fullWidth
                label={label}
                type={type}
                value={form?.[key] ?? ''}
                onChange={(e)=>handle(key, type==='number' ? (e.target.value===''? '' : Number(e.target.value)) : e.target.value)}
                InputLabelProps={type==='date' ? { shrink: true } : undefined}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => onSubmit(form)} startIcon={<CheckIcon/>}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};

// ========================= Main Page =========================
export default function Salary() {
  const theme = useThemeFromMeta();
  const [tab, setTab] = useState(0);

  // filters
  const [kyLuongId, setKyLuongId] = useState('');
  const [thang, setThang] = useState('');
  const [chiNhanhId, setChiNhanhId] = useState('');
  const [nhanVienId, setNhanVienId] = useState('');

  // feedback
  const [toast, setToast] = useState({ open: false, msg: '', sev: 'success' });
  const showOk = (msg) => setToast({ open: true, msg, sev: 'success' });
  const showErr = (msg) => setToast({ open: true, msg, sev: 'error' });

  // ============ Loaders ============
  const fetchBuoi = useCallback(async ({ page, size }) => {
    const params = new URLSearchParams();
    if (kyLuongId) params.append('kyLuongId', kyLuongId);
    if (chiNhanhId) params.append('chiNhanhId', chiNhanhId);
    if (nhanVienId) params.append('nhanVienId', nhanVienId);
    params.append('page', page);
    params.append('size', size);
    const { data } = await api.get(`/teacher/buoi?${params.toString()}`);
    return data;
  }, [kyLuongId, chiNhanhId, nhanVienId]);

  const buoi = usePaged(fetchBuoi, [kyLuongId, chiNhanhId, nhanVienId]);
  
  const fetchGvPayroll = useCallback(async ({ page, size }) => {
    if (!kyLuongId) return { content: [], totalElements: 0 };
    const { data } = await api.get(`/teacher/payroll`, { params: { kyLuongId, page, size } });
    return data;
  }, [kyLuongId]);

  const gvPayroll = usePaged(fetchGvPayroll, [kyLuongId]);

  const fetchNvPayroll = useCallback(async ({ page, size }) => {
    if (!kyLuongId) return { content: [], totalElements: 0 };
    const { data } = await api.get(`/staff/payroll`, { params: { kyLuongId, page, size } });
    return data;
  }, [kyLuongId]);
  const nvPayroll = usePaged(fetchNvPayroll, [kyLuongId]);

  const { totalBuoi, sumTeacher, sumStaff, totalPay, avgPerBuoi } = useMemo(() => {
    const totalBuoi = buoi.rowCount || 0;
    const sumTeacher = (gvPayroll.rows || []).reduce((s, r) => s + Number(r.tongLuong || 0), 0);
    const sumStaff   = (nvPayroll.rows || []).reduce((s, r) => s + Number(r.tongLuong || 0), 0);
    const totalPay   = sumTeacher + sumStaff;
    const avgPerBuoi = totalBuoi ? Math.round(sumTeacher / totalBuoi) : 0;
    return { totalBuoi, sumTeacher, sumStaff, totalPay, avgPerBuoi };
  }, [buoi.rowCount, gvPayroll.rows, nvPayroll.rows]);

  // RULE: Đơn giá
  const [dgFilter, setDgFilter] = useState({});
  const fetchDonGia = useCallback(async ({ page, size }) => {
    const params = new URLSearchParams();
    Object.entries(dgFilter).forEach(([k,v]) => v!=='' && v!==undefined && params.append(k, v));
    params.append('page', page); params.append('size', size);
    const { data } = await axios.get(`/api/salary/rules/don-gia?${params.toString()}`);
    return data;
  }, [dgFilter]);
  const donGia = usePaged(fetchDonGia, [dgFilter]);

  // RULE: Bonus
  const [brFilter, setBrFilter] = useState({});
  const fetchBonusRule = useCallback(async ({ page, size }) => {
    const params = new URLSearchParams();
    Object.entries(brFilter).forEach(([k,v]) => v!=='' && v!==undefined && params.append(k, v));
    params.append('page', page); params.append('size', size);
    const { data } = await axios.get(`/api/salary/rules/bonus?${params.toString()}`);
    return data;
  }, [brFilter]);
  const bonusRule = usePaged(fetchBonusRule, [brFilter]);

  // ============ Cell Edit ============
  const makeCellCommit = (table) => async (params) => {
    try {
      const { id, field, value } = params; // DataGrid onCellEditCommit
      await api.patch('/cell', { table, id, column: field, value });
      showOk('Đã cập nhật.');
      // refresh impacted grid
      if (table === 'gv_thanh_toan_buoi') buoi.reload();
      if (table === 'gv_don_gia_day_rule') donGia.reload();
      if (table === 'gv_bonus_rule') bonusRule.reload();
    } catch (e) {
      showErr(e?.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  // ============ Actions ============
  const runTeacher = async () => {
    if (!thang) return showErr('Nhập Tháng (YYYY-MM) trước.');
    await api.post('/run/teacher', { thang, chiNhanhId: chiNhanhId || null });
    showOk('Đã chạy tổng hợp lương GV.');
    gvPayroll.reload();
    buoi.reload();
  };
  const runStaff = async () => {
    if (!thang) return showErr('Nhập Tháng (YYYY-MM) trước.');
    await api.post('/run/staff', { thang, chiNhanhId: chiNhanhId || null });
    showOk('Đã chạy tổng hợp lương NV.');
    nvPayroll.reload();
  };

  // Optional: import điểm danh nếu backend có (không lỗi nếu không có)
  const importDiemDanh = async () => {
    if (!thang) return showErr('Nhập Tháng (YYYY-MM) trước.');
    try {
      await axios.post('/api/salary/import-diem-danh', { thang });
      showOk('Đã import điểm danh.');
      buoi.reload();
    } catch {
      showErr('Endpoint import không khả dụng trong backend hiện tại.');
    }
  };

  // ============ Dialog state ============
  const [openDG, setOpenDG] = useState(false);
  const [editingDG, setEditingDG] = useState(null);

  const [openBR, setOpenBR] = useState(false);
  const [editingBR, setEditingBR] = useState(null);

  // CRUD don gia
  const onSubmitDG = async (payload) => {
    try {
      if (payload.id) await axios.put(`/api/salary/rules/don-gia/${payload.id}`, payload);
      else await axios.post(`/api/salary/rules/don-gia`, payload);
      setOpenDG(false); setEditingDG(null);
      showOk('Lưu đơn giá thành công.');
      donGia.reload();
    } catch (e) {
      showErr('Lưu đơn giá thất bại.');
    }
  };
  const deleteDG = async (row) => {
    if (!window.confirm(`Xoá rule đơn giá #${row.id}?`)) return;
    try {
      await axios.delete(`/api/salary/rules/don-gia/${row.id}`);
      showOk('Đã xóa.');
      donGia.reload();
    } catch {
      showErr('Xóa thất bại.');
    }
  };

  // CRUD bonus rule
  const onSubmitBR = async (payload) => {
    try {
      if (payload.id) await axios.put(`/api/salary/rules/bonus/${payload.id}`, payload);
      else await axios.post(`/api/salary/rules/bonus`, payload);
      setOpenBR(false); setEditingBR(null);
      showOk('Lưu bonus rule thành công.');
      bonusRule.reload();
    } catch {
      showErr('Lưu bonus rule thất bại.');
    }
  };
  const deleteBR = async (row) => {
    if (!window.confirm(`Xoá bonus rule #${row.id}?`)) return;
    try {
      await axios.delete(`/api/salary/rules/bonus/${row.id}`);
      showOk('Đã xóa.');
      bonusRule.reload();
    } catch {
      showErr('Xóa thất bại.');
    }
  };

  // =================== Columns ===================
  const buoiCols = useMemo(()=>[
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'ngayDay', headerName: 'Ngày dạy', width: 110, editable: false },
    { field: 'nhanVienId', headerName: 'GV', width: 90 },
    { field: 'lopId', headerName: 'Lớp', width: 90 },
    { field: 'loaiBuoi', headerName: 'Loại buổi', width: 130, editable: true },
    { field: 'thoiLuongPhut', headerName: 'Phút', width: 80, editable: false },
    { field: 'hinhThuc', headerName: 'Hình thức', width: 110, editable: true },
    { field: 'siSoThucTe', headerName: 'Sĩ số', width: 80, editable: true },
    { field: 'heSo', headerName: 'Hệ số', width: 90, editable: true },
    { field: 'soTienGiaoVien', headerName: 'Tiền GV', width: 120, editable: true,
      valueFormatter: ({ value }) => fmtCurrency(value) },
    { field: 'ruleIdApDung', headerName: 'Rule áp dụng', width: 120, editable: true },
    { field: 'ghiChu', headerName: 'Ghi chú', width: 200, editable: true },
  ],[]);

  const gvPayrollCols = useMemo(()=>[
    { field: 'nhanVienId', headerName: 'GV', width: 110 },
    { field: 'tongBuoi', headerName: 'Tổng buổi', width: 110 },
    { field: 'tienDayBuoi', headerName: 'Tiền dạy', width: 120, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'tongBonus', headerName: 'Bonus', width: 120, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'tongKhauTru', headerName: 'Khấu trừ', width: 120, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'tongLuong', headerName: 'Tổng lương', width: 140, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'ghiChu', headerName: 'Ghi chú', width: 220 },
  ],[]);

  const nvPayrollCols = useMemo(()=>[
    { field: 'nhanVienId', headerName: 'Nhân viên', width: 120 },
    { field: 'luongCung', headerName: 'Lương cứng', width: 120, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'tongHoaHong', headerName: 'Hoa hồng', width: 120, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'tongThuong', headerName: 'Thưởng', width: 120, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'tongTruc', headerName: 'Trực', width: 110, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'tongPhuCapKhac', headerName: 'Phụ cấp', width: 120, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'tongPhat', headerName: 'Phạt', width: 110, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'tongLuong', headerName: 'Tổng lương', width: 140, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'ghiChu', headerName: 'Ghi chú', width: 220 },
  ],[]);

  const donGiaCols = useMemo(()=>[
    { field: 'id', headerName: '#', width: 70 },
    { field: 'monHocId', headerName: 'Môn', width: 90 },
    { field: 'capDoId', headerName: 'Cấp độ', width: 90 },
    { field: 'loaiLop', headerName: 'Loại lớp', width: 120, editable: true },
    { field: 'thoiLuongPhut', headerName: 'Phút', width: 90, editable: true },
    { field: 'hinhThuc', headerName: 'Hình thức', width: 110, editable: true },
    { field: 'kieuTinh', headerName: 'Kiểu tính', width: 170, editable: true },
    { field: 'soTien', headerName: 'Số tiền', width: 120, editable: true, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'tyLePct', headerName: '% HP/buổi', width: 120, editable: true },
    { field: 'uuTien', headerName: 'Ưu tiên', width: 100, editable: true },
    { field: 'hieuLucTu', headerName: 'Từ', width: 110, editable: true },
    { field: 'hieuLucDen', headerName: 'Đến', width: 110, editable: true },
    { field: 'ghiChu', headerName: 'Ghi chú', width: 200, editable: true },
    {
      field: '_actions', headerName: '', width: 110, sortable: false, filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={()=>{ setEditingDG(params.row); setOpenDG(true); }}><EditIcon/></IconButton>
          <IconButton size="small" color="error" onClick={()=>deleteDG(params.row)}><DeleteIcon/></IconButton>
        </Stack>
      )
    }
  ],[]);

  const bonusRuleCols = useMemo(()=>[
    { field: 'id', headerName: '#', width: 70 },
    { field: 'loaiBuoi', headerName: 'Loại buổi', width: 130, editable: true },
    { field: 'monHocId', headerName: 'Môn', width: 90, editable: true },
    { field: 'thoiLuongPhut', headerName: 'Phút', width: 90, editable: true },
    { field: 'soTien', headerName: 'Số tiền', width: 120, editable: true, valueFormatter: ({value})=>fmtCurrency(value) },
    { field: 'heSo', headerName: 'Hệ số', width: 100, editable: true },
    { field: 'uuTien', headerName: 'Ưu tiên', width: 100, editable: true },
    { field: 'hieuLucTu', headerName: 'Từ', width: 110, editable: true },
    { field: 'hieuLucDen', headerName: 'Đến', width: 110, editable: true },
    { field: 'ghiChu', headerName: 'Ghi chú', width: 200, editable: true },
    {
      field: '_actions', headerName: '', width: 110, sortable: false, filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={()=>{ setEditingBR(params.row); setOpenBR(true); }}><EditIcon/></IconButton>
          <IconButton size="small" color="error" onClick={()=>deleteBR(params.row)}><DeleteIcon/></IconButton>
        </Stack>
      )
    }
  ],[]);

  // =================== UI ===================
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>

        {/* Filters */}
        <Paper sx={{ p: 2, m: 2 }}>
          {/* HERO */}
          <div className="px-4 pb-2">
            <RasHero
              title="Bảng lương RAS — Salary Center"
              subtitle={thang ? `Kỳ: ${thang}${chiNhanhId ? ` • CN #${chiNhanhId}` : ''}` : "Chọn Tháng để chạy tổng hợp"}
              actions={
                <>
                  <button className="ras-outline" onClick={importDiemDanh}>Import điểm danh</button>
                  <button className="ras-btn" onClick={runTeacher}>Tính lương GV</button>
                  <button className="ras-btn" onClick={runStaff}>Tính lương NV</button>
                </>
              }
            />
          </div>

{/* KPI ROW */}
<div className="px-4 pb-2">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
    <RasKpiCard
      icon={<School />}
      label="Tổng buổi GV (theo filter)"
      value={totalBuoi.toLocaleString('vi-VN')}
      delta={thang ? thang : undefined}
      positive
    />
    <RasKpiCard
      icon={<Paid />}
      label="Lương GV (trên trang)"
      value={sumTeacher.toLocaleString('vi-VN')}
      delta={avgPerBuoi ? `~${avgPerBuoi.toLocaleString('vi-VN')}/buổi` : '—'}
      positive
    />
    <RasKpiCard
      icon={<ReceiptLong />}
      label="Lương NV (trên trang)"
      value={sumStaff.toLocaleString('vi-VN')}
      delta="Tổng phát sinh"
      positive
    />
    <RasKpiCard
      icon={<Paid />}
      label="Tổng lương (GV+NV)"
      value={totalPay.toLocaleString('vi-VN')}
      delta="gross (page)"
      positive
    />
  </div>
</div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField label="Kỳ lương ID" fullWidth value={kyLuongId}
                         onChange={e=>setKyLuongId(e.target.value)} placeholder="VD: 15" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Tháng (YYYY-MM)" fullWidth value={thang}
                         onChange={e=>setThang(e.target.value)} placeholder="VD: 2025-09" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Chi nhánh ID" fullWidth value={chiNhanhId}
                         onChange={e=>setChiNhanhId(e.target.value)} placeholder="VD: 2" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Nhân viên ID" fullWidth value={nhanVienId}
                         onChange={e=>setNhanVienId(e.target.value)} placeholder="(tuỳ chọn)" />
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Box sx={{ px: 2 }}>
          <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Tabs value={tab} onChange={(_,v)=>setTab(v)} textColor="primary" indicatorColor="primary" sx={{ px: 2 }}>
              <Tab label="Buổi GV" />
              <Tab label="Tổng hợp GV" />
              <Tab label="Tổng hợp NV" />
              <Tab label="Rule — Đơn giá" />
              <Tab label="Rule — Bonus" />
            </Tabs>

            <Divider />

            {/* Tab 0: Buổi GV */}
            {tab === 0 && (
              <Box sx={{ p: 2 }}>
                <DataGrid
                  autoHeight
                  rows={buoi.rows}
                  columns={buoiCols}
                  getRowId={(r)=>r.id}
                  rowCount={buoi.rowCount}
                  paginationMode="server"
                  paginationModel={buoi.paginationModel}
                  onPaginationModelChange={buoi.setPaginationModel}
                  loading={buoi.loading}
                  disableRowSelectionOnClick
                  editMode="cell"
                  onCellEditCommit={makeCellCommit('gv_thanh_toan_buoi')}
                  sx={{
                    '& .MuiDataGrid-cell:focus': { outline: 'none' },
                    '& .MuiDataGrid-cell--editable': { bgcolor: 'rgba(255,193,7,0.08)' },
                  }}
                />
              </Box>
            )}

            {/* Tab 1: Tổng hợp GV */}
            {tab === 1 && (
              <Box sx={{ p: 2 }}>
                {!kyLuongId && <Alert severity="info" sx={{ mb: 2 }}>Nhập <b>Kỳ lương ID</b> để xem tổng hợp GV.</Alert>}
                <DataGrid
                  autoHeight
                  rows={gvPayroll.rows}
                  columns={gvPayrollCols}
                  getRowId={(r)=>r.id}
                  rowCount={gvPayroll.rowCount}
                  paginationMode="server"
                  paginationModel={gvPayroll.paginationModel}
                  onPaginationModelChange={gvPayroll.setPaginationModel}
                  loading={gvPayroll.loading}
                  disableRowSelectionOnClick
                />
              </Box>
            )}

            {/* Tab 2: Tổng hợp NV */}
            {tab === 2 && (
              <Box sx={{ p: 2 }}>
                {!kyLuongId && <Alert severity="info" sx={{ mb: 2 }}>Nhập <b>Kỳ lương ID</b> để xem tổng hợp NV.</Alert>}
                <DataGrid
                  autoHeight
                  rows={nvPayroll.rows}
                  columns={nvPayrollCols}
                  getRowId={(r)=>r.id}
                  rowCount={nvPayroll.rowCount}
                  paginationMode="server"
                  paginationModel={nvPayroll.paginationModel}
                  onPaginationModelChange={nvPayroll.setPaginationModel}
                  loading={nvPayroll.loading}
                  disableRowSelectionOnClick
                />
              </Box>
            )}

            {/* Tab 3: RULE — ĐƠN GIÁ */}
            {tab === 3 && (
              <Box sx={{ p: 2 }}>
                <Paper variant="outlined" sx={{ p:2, mb:2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <TextField size="small" label="Môn học ID" fullWidth
                                 value={dgFilter.monHocId||''}
                                 onChange={(e)=>setDgFilter(f=>({...f, monHocId:e.target.value}))}/>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField size="small" label="Loại lớp" fullWidth
                                 value={dgFilter.loaiLop||''}
                                 onChange={(e)=>setDgFilter(f=>({...f, loaiLop:e.target.value}))}/>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField size="small" label="Phút" fullWidth
                                 value={dgFilter.thoiLuongPhut||''}
                                 onChange={(e)=>setDgFilter(f=>({...f, thoiLuongPhut:e.target.value}))}/>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField size="small" label="Hình thức" fullWidth
                                 value={dgFilter.hinhThuc||''}
                                 onChange={(e)=>setDgFilter(f=>({...f, hinhThuc:e.target.value}))}/>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField size="small" label="Từ ngày" type="date" fullWidth
                                 InputLabelProps={{shrink:true}}
                                 value={dgFilter.tuNgay||''}
                                 onChange={(e)=>setDgFilter(f=>({...f, tuNgay:e.target.value}))}/>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button variant="outlined" startIcon={<RefreshIcon/>} onClick={()=>donGia.reload()}>Làm mới</Button>
                        <Button variant="contained" startIcon={<AddIcon/>} onClick={()=>{setEditingDG(null); setOpenDG(true);}}>Thêm</Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>

                <DataGrid
                  autoHeight
                  rows={donGia.rows}
                  columns={donGiaCols}
                  getRowId={(r)=>r.id}
                  rowCount={donGia.rowCount}
                  paginationMode="server"
                  paginationModel={donGia.paginationModel}
                  onPaginationModelChange={donGia.setPaginationModel}
                  loading={donGia.loading}
                  disableRowSelectionOnClick
                  editMode="cell"
                  onCellEditCommit={makeCellCommit('gv_don_gia_day_rule')}
                />

                <DonGiaDialog
                  open={openDG}
                  onClose={()=>{setOpenDG(false); setEditingDG(null);}}
                  initial={editingDG}
                  onSubmit={onSubmitDG}
                />
              </Box>
            )}

            {/* Tab 4: RULE — BONUS */}
            {tab === 4 && (
              <Box sx={{ p: 2 }}>
                <Paper variant="outlined" sx={{ p:2, mb:2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <TextField size="small" label="Loại buổi" fullWidth
                                 value={brFilter.loaiBuoi||''}
                                 onChange={(e)=>setBrFilter(f=>({...f, loaiBuoi:e.target.value}))}/>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField size="small" label="Môn học ID" fullWidth
                                 value={brFilter.monHocId||''}
                                 onChange={(e)=>setBrFilter(f=>({...f, monHocId:e.target.value}))}/>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField size="small" label="Phút" fullWidth
                                 value={brFilter.thoiLuongPhut||''}
                                 onChange={(e)=>setBrFilter(f=>({...f, thoiLuongPhut:e.target.value}))}/>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <TextField size="small" label="Từ ngày" type="date" fullWidth
                                 InputLabelProps={{shrink:true}}
                                 value={brFilter.tuNgay||''}
                                 onChange={(e)=>setBrFilter(f=>({...f, tuNgay:e.target.value}))}/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button variant="outlined" startIcon={<RefreshIcon/>} onClick={()=>bonusRule.reload()}>Làm mới</Button>
                        <Button variant="contained" startIcon={<AddIcon/>} onClick={()=>{setEditingBR(null); setOpenBR(true);}}>Thêm</Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>

                <DataGrid
                  autoHeight
                  rows={bonusRule.rows}
                  columns={bonusRuleCols}
                  getRowId={(r)=>r.id}
                  rowCount={bonusRule.rowCount}
                  paginationMode="server"
                  paginationModel={bonusRule.paginationModel}
                  onPaginationModelChange={bonusRule.setPaginationModel}
                  loading={bonusRule.loading}
                  disableRowSelectionOnClick
                  editMode="cell"
                  onCellEditCommit={makeCellCommit('gv_bonus_rule')}
                />

                <BonusRuleDialog
                  open={openBR}
                  onClose={()=>{setOpenBR(false); setEditingBR(null);}}
                  initial={editingBR}
                  onSubmit={onSubmitBR}
                />
              </Box>
            )}

          </Paper>
        </Box>

        <Snackbar open={toast.open} autoHideDuration={2500} onClose={()=>setToast(s=>({...s, open:false}))}>
          <Alert severity={toast.sev} sx={{ width: '100%' }}>{toast.msg}</Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
