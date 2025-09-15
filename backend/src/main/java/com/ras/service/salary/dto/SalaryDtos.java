package com.ras.service.salary.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class SalaryDtos {
  @Data @NoArgsConstructor @AllArgsConstructor @Builder
  public static class TeacherBuoiRow {
    private Long id, kyLuongId, chiNhanhId, nhanVienId, lopId, buoiHocId, monHocId, capDoId, ruleIdApDung;
    private LocalDate ngayDay;
    private String loaiLop, hinhThuc, loaiBuoi, ghiChu;
    private Short thoiLuongPhut, siSoThucTe;
    private BigDecimal hocPhiMoiBuoi, soTienGiaoVien, heSo;
    private Boolean isOverrideAmount;
  }

  @Data @NoArgsConstructor @AllArgsConstructor @Builder
  public static class TeacherPayrollRow {
    private Long id, kyLuongId, nhanVienId;
    private BigDecimal tongBuoi, tienDayBuoi, tongBonus, tongKhauTru, tongLuong;
    private String ghiChu;
  }

  @Data @NoArgsConstructor @AllArgsConstructor @Builder
  public static class StaffPayrollRow {
    private Long id, kyLuongId, nhanVienId;
    private BigDecimal luongCung, tongHoaHong, tongThuong, tongTruc, tongPhuCapKhac, tongPhat, tongLuong;
    private String ghiChu;
  }

  @Data @NoArgsConstructor @AllArgsConstructor @Builder
  public static class Meta {
    private String themePrimary, themeDark, themeAccent;
  }
}
