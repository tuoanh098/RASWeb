import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, MenuItem, Select, Stack, TextField, Typography, Tooltip, Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HistoryIcon from '@mui/icons-material/History';
import dayjs from 'dayjs';
import { RAS } from '../../lib/rasPalette';
import {
  listStaffSalary, fetchAllStaffSalary, recalcStaffSalary,
  updateBaseSalary, addPenalty, listPenalties
} from '../../lib/staffSalaryApi';
import { toCurrency, toDateStr } from '../../lib/format';

export default function EmployeeSalary() {
  // kỳ mặc định: tháng hiện tại
  const [ky, setKy] = useState(dayjs().format('YYYY-MM'));
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // KPI tổng (all rows)
  const [kpi, setKpi] = useState({
    count: 0, luongCung: 0, hoaHong: 0, thuong: 0, truc: 0, phuCap: 0, phat: 0, tong: 0
  });

  // penalty dialog
  const [penOpen, setPenOpen] = useState(false);
  const [penForm, setPenForm] = useState({
    nhanVienId: '',
    ngayThang: dayjs().format('YYYY-MM-DD'),
    soTienPhat: -100000,
    noiDungLoi: 'Vi phạm',
    chiNhanhId: '',
  });

  // penalty history dialog
  const [hisOpen, setHisOpen] = useState(false);
  const [hisNV, setHisNV] = useState(null);
  const [hisRows, setHisRows] = useState([]);
  const [hisPage, setHisPage] = useState(0);
  const [hisSize, setHisSize] = useState(10);
  const [hisTotal, setHisTotal] = useState(0);
  const [hisLoading, setHisLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const { items, page: pg, size, total } = await listStaffSalary({ ky, page, size: pageSize });
      setRows(items);
      setPage(pg);
      setPageSize(size);
      setRowCount(total);
    } catch (e) {
      console.error(e);
      alert('Lỗi tải bảng lương nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const loadKPI = async () => {
    try {
      const all = await fetchAllStaffSalary({ ky });
      const sum = (f) => all.reduce((acc, r) => acc + Number(r[f] || 0), 0);
      setKpi({
        count: all.length,
        luongCung: sum('luongCung'),
        hoaHong: sum('tongHoaHong'),
        thuong: sum('tongThuong'),
        truc: sum('tongTruc'),
        phuCap: sum('tongPhuCapKhac'),
        phat: sum('tongPhat'),
        tong: sum('tongLuong'),
      });
    } catch (e) {
      console.error(e);
      // kệ KPI nếu fail, UI vẫn chạy list chính
    }
  };

  useEffect(() => { loadData(); loadKPI(); /* eslint-disable-next-line */ }, [ky, page, pageSize]);

  const handleRecalc = async () => {
    try {
      await recalcStaffSalary(ky);
      await loadData();
      await loadKPI();
    } catch (e) {
      console.error(e);
      alert('Lỗi kết sổ kỳ NV');
    }
  };

  const handleCellEditStop = async (params, event) => {
    // DataGrid v6: sự kiện này chạy khi cell dừng edit
    // Ta đọc giá trị mới trực tiếp từ DOM event target nếu có, fallback dùng row snapshot.
    const { id, field } = params;
    if (!['luongCung', 'ghiChu'].includes(field)) return;

    let value = event?.target?.value;
    if (value === undefined) {
      // fallback: lấy từ row hiện có
      const row = rows.find(r => r.id === id);
      value = row ? row[field] : undefined;
    }
    try {
      const payload = {};
      if (field === 'luongCung') payload.luongCung = Number(value);
      if (field === 'ghiChu') payload.ghiChu = value;
      await updateBaseSalary(id, payload);
      // có thể recalc ở đây, nhưng để nhanh UI, ta chỉ recalc khi user bấm nút — hoặc:
      await recalcStaffSalary(ky);
      await loadData();
      await loadKPI();
    } catch (e) {
      console.error(e);
      alert('Lưu chỉnh sửa thất bại');
    }
  };

  const openPenalty = (row) => {
    setPenForm({
      nhanVienId: row?.nhanVienId || '',
      ngayThang: dayjs().format('YYYY-MM-DD'),
      soTienPhat: -100000,
      noiDungLoi: 'Vi phạm',
      chiNhanhId: ''
    });
    setPenOpen(true);
  };

  const submitPenalty = async () => {
    try {
      const payload = {
        ky,
        nhanVienId: Number(penForm.nhanVienId),
        ngayThang: penForm.ngayThang,
        soTienPhat: Number(penForm.soTienPhat),
        noiDungLoi: penForm.noiDungLoi,
        chiNhanhId: penForm.chiNhanhId ? Number(penForm.chiNhanhId) : null
      };
      await addPenalty(payload);
      setPenOpen(false);
      await loadData();
      await loadKPI();
    } catch (e) {
      console.error(e);
      alert('Thêm lỗi/phạt thất bại');
    }
  };

  const openHistory = async (row) => {
    setHisNV(row);
    setHisOpen(true);
    setHisPage(0);
    await fetchHistory(row, 0, hisSize);
  };

  const fetchHistory = async (row, pageX = hisPage, sizeX = hisSize) => {
    if (!row) return;
    setHisLoading(true);
    try {
      const { items, page: pg, size, total } = await listPenalties({
        ky, nhanVienId: row.nhanVienId, page: pageX, size: sizeX
      });
      setHisRows(items);
      setHisPage(pg);
      setHisSize(size);
      setHisTotal(total);
    } catch (e) {
      console.error(e);
      setHisRows([]);
      setHisTotal(0);
    } finally {
      setHisLoading(false);
    }
  };

  const headerCard = (
    <Card
      sx={{
        mb: 2, borderRadius: 3,
        background: `linear-gradient(135deg, ${RAS.primary} 0%, ${RAS.secondary} 70%)`,
        color: 'white',
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
              Lương Nhân Viên
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Xem, chỉnh sửa lương cứng và thêm lỗi/phạt theo kỳ
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              type="month"
              value={ky}
              onChange={(e) => setKy(e.target.value)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                borderRadius: 2,
                input: { color: 'white' }
              }}
            />
            <Button variant="contained"
              onClick={handleRecalc}
              startIcon={<RefreshIcon />}
              sx={{
                bgcolor: 'rgba(0,0,0,0.25)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.35)' }
              }}
            >
              Kết sổ kỳ
            </Button>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => openPenalty({})}
              sx={{
                bgcolor: 'rgba(0,0,0,0.25)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.35)' }
              }}
            >
              Thêm lỗi/phạt
            </Button>
          </Stack>
        </Stack>
        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.25)' }} />
        {/* KPI */}
        <Grid container spacing={2}>
          {[
            { label: 'Nhân viên', val: kpi.count },
            { label: 'Lương cứng', val: toCurrency(kpi.luongCung) },
            { label: 'Hoa hồng', val: toCurrency(kpi.hoaHong) },
            { label: 'Thưởng', val: toCurrency(kpi.thuong) },
            { label: 'Trực', val: toCurrency(kpi.truc) },
            { label: 'Phụ cấp', val: toCurrency(kpi.phuCap) },
            { label: 'Phạt', val: toCurrency(kpi.phat) },
            { label: 'Tổng', val: toCurrency(kpi.tong) },
          ].map((k, i) => (
            <Grid item xs={6} sm={3} md={2} key={i}>
              <Box
                sx={{
                  bgcolor: 'rgba(0,0,0,0.25)',
                  p: 2, borderRadius: 2,
                  display: 'flex', flexDirection: 'column', gap: 0.25
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.9 }}>{k.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{k.val}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const columns = useMemo(() => ([
    { field: 'id', headerName: '#', width: 90 },
    { field: 'nhanVienId', headerName: 'NV ID', width: 100 },
    { field: 'tenNhanVien', headerName: 'Nhân viên', flex: 1, minWidth: 180 },
    {
      field: 'luongCung', headerName: 'Lương cứng', width: 140, editable: true,
      valueFormatter: ({ value }) => toCurrency(value)
    },
    { field: 'tongHoaHong', headerName: 'Hoa hồng', width: 120, valueFormatter: ({ value }) => toCurrency(value) },
    { field: 'tongThuong', headerName: 'Thưởng', width: 110, valueFormatter: ({ value }) => toCurrency(value) },
    { field: 'tongTruc', headerName: 'Trực', width: 100, valueFormatter: ({ value }) => toCurrency(value) },
    { field: 'tongPhuCapKhac', headerName: 'Phụ cấp', width: 120, valueFormatter: ({ value }) => toCurrency(value) },
    {
      field: 'tongPhat', headerName: 'Phạt', width: 100,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          color="error"
          label={toCurrency(value)}
          sx={{ bgcolor: 'rgba(255, 107, 107, 0.1)', color: '#FFE5E5' }}
        />
      )
    },
    {
      field: 'tongLuong', headerName: 'Tổng lương', width: 150,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          color="success"
          label={toCurrency(value)}
          sx={{ bgcolor: 'rgba(0, 209, 178, 0.1)', color: '#E5FFFA' }}
        />
      )
    },
    { field: 'ghiChu', headerName: 'Ghi chú', flex: 1, minWidth: 180, editable: true },
    {
      field: 'actions', headerName: '', width: 110, sortable: false, filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Thêm lỗi/phạt">
            <IconButton size="small" onClick={() => openPenalty(params.row)}>
              <WarningAmberIcon htmlColor={RAS.accent} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lịch sử phạt">
            <IconButton size="small" onClick={() => openHistory(params.row)}>
              <HistoryIcon htmlColor={RAS.secondary} />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ]), [kpi]);

  return (
    <Box sx={{ p: 2, bgcolor: RAS.ink, minHeight: '100vh' }}>
      {headerCard}

      <Card sx={{ borderRadius: 3, bgcolor: RAS.card, color: 'white' }}>
        <CardContent>
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(r) => r.id}
              onCellEditStop={handleCellEditStop}
              pagination
              paginationModel={{ page, pageSize }}
              onPaginationModelChange={(m) => { setPage(m.page); setPageSize(m.pageSize); }}
              rowCount={rowCount}
              paginationMode="server"
              loading={loading}
              sx={{
                border: 0,
                color: 'white',
                '& .MuiDataGrid-columnHeaders': { bgcolor: RAS.surface, color: '#E5E9F5' },
                '& .MuiDataGrid-row:hover': { bgcolor: '#0f1731' },
                '& .MuiDataGrid-cell': { borderColor: '#1f2947' },
                '& .MuiDataGrid-footerContainer': { bgcolor: RAS.surface },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog thêm lỗi/phạt */}
      <Dialog open={penOpen} onClose={() => setPenOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm lỗi/phạt</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nhân viên ID"
                value={penForm.nhanVienId}
                onChange={e => setPenForm(p => ({ ...p, nhanVienId: e.target.value }))}
                fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ngày"
                type="date"
                value={penForm.ngayThang}
                onChange={e => setPenForm(p => ({ ...p, ngayThang: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số tiền phạt (âm để trừ)"
                type="number"
                value={penForm.soTienPhat}
                onChange={e => setPenForm(p => ({ ...p, soTienPhat: e.target.value }))}
                fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Chi nhánh ID (tuỳ chọn)"
                value={penForm.chiNhanhId}
                onChange={e => setPenForm(p => ({ ...p, chiNhanhId: e.target.value }))}
                fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nội dung lỗi"
                value={penForm.noiDungLoi}
                onChange={e => setPenForm(p => ({ ...p, noiDungLoi: e.target.value }))}
                fullWidth multiline />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPenOpen(false)}>Huỷ</Button>
          <Button variant="contained" onClick={submitPenalty}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog lịch sử phạt */}
      <Dialog open={hisOpen} onClose={() => setHisOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Lịch sử phạt — {hisNV?.tenNhanVien} (NV #{hisNV?.nhanVienId})
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ height: 420, width: '100%' }}>
            <DataGrid
              rows={hisRows}
              columns={[
                { field: 'id', headerName: '#', width: 80 },
                { field: 'ngayThang', headerName: 'Ngày', width: 120, valueFormatter: ({ value }) => toDateStr(value) },
                { field: 'soTienPhat', headerName: 'Số tiền', width: 140, valueFormatter: ({ value }) => toCurrency(value) },
                { field: 'noiDungLoi', headerName: 'Nội dung', flex: 1, minWidth: 220 },
                { field: 'chiNhanhId', headerName: 'CN', width: 100 },
              ]}
              getRowId={(r) => r.id}
              pagination
              paginationModel={{ page: hisPage, pageSize: hisSize }}
              onPaginationModelChange={(m) => {
                setHisPage(m.page);
                setHisSize(m.pageSize);
                fetchHistory(hisNV, m.page, m.pageSize);
              }}
              rowCount={hisTotal}
              paginationMode="server"
              loading={hisLoading}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHisOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
