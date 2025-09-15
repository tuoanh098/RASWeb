package com.ras.service.salary;

import com.ras.domain.salary.*;

import java.math.BigDecimal;
import java.util.List;

public interface SalaryService {
    // Bảng lương tháng (tổng quan)
    List<NvBangLuongThang> getBangLuongThang(Long kyLuongId);
    BigDecimal getTongLuongThang(Long kyLuongId); // ĐÃ đổi sang BigDecimal

    // Hoa hồng
    List<NvHoaHongChotLop> getHoaHongChiTiet(Long kyLuongId, Long nhanVienId);
    NvHoaHongChotLop saveHoaHong(NvHoaHongChotLop hoaHong);
    void deleteHoaHong(Long id, Long kyLuongId, Long nhanVienId);

    // Thưởng bậc / Thưởng khác
    List<NvThuongBac> getThuongBac(Long kyLuongId, Long nhanVienId);
    NvThuongBac saveThuongBac(NvThuongBac thuongBac);
    void deleteThuongBac(Long id, Long kyLuongId, Long nhanVienId);

    List<NvThuongKhac> getThuongKhac(Long kyLuongId, Long nhanVienId);
    NvThuongKhac saveThuongKhac(NvThuongKhac thuongKhac);
    void deleteThuongKhac(Long id, Long kyLuongId, Long nhanVienId);

    // Trực
    List<NvTruc> getTruc(Long kyLuongId, Long nhanVienId);
    NvTruc saveTruc(NvTruc truc);
    void deleteTruc(Long id, Long kyLuongId, Long nhanVienId);

    // Phụ cấp khác
    List<NvPhuCapKhac> getPhuCapKhac(Long kyLuongId, Long nhanVienId);
    NvPhuCapKhac savePhuCapKhac(NvPhuCapKhac pc);
    void deletePhuCapKhac(Long id, Long kyLuongId, Long nhanVienId);

    // Phạt / kỷ luật
    List<NvPhatKyLuat> getPhat(Long kyLuongId, Long nhanVienId);
    NvPhatKyLuat savePhat(NvPhatKyLuat phat);
    void deletePhat(Long id, Long kyLuongId, Long nhanVienId);

    // Recompute tất cả cột tổng của 1 NV trong 1 kỳ lương
    NvBangLuongThang recomputeBangLuong(Long kyLuongId, Long nhanVienId);

    // Helper
    static BigDecimal nz(BigDecimal v){ return v==null? BigDecimal.ZERO : v; }
}
