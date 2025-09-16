package com.ras.service.enroll;

public interface EnrollmentRow {
    Long getId();
    String getNgayDangKy();

    Long getHocVienId();
    String getHocVienTen();

    Long getKhoaHocMauId();
    String getTenHienThi();

    Long getHocPhiApDung();

    Long getGiaoVienId();
    String getGiaoVienTen();

    Long getNhanVienTuVanId();
    String getNhanVienTuVanTen();

    Long getChiNhanhId();
    String getChiNhanhTen();

    Long getHoaHong2pct();
}
