package com.ras.service.enroll.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentDto {
  @JsonProperty("id")                 private Long id;
  @JsonProperty("hoc_vien_id")        private Long hocVienId;
  @JsonProperty("khoa_hoc_mau_id")    private Long khoaHocMauId;
  @JsonProperty("nhan_vien_tu_van_id")private Long nhanVienTuVanId;
  @JsonProperty("giao_vien_id")       private Long giaoVienId;
  @JsonProperty("chi_nhanh_id")       private Long chiNhanhId;
  @JsonProperty("hoc_phi_ap_dung")    private BigDecimal hocPhiApDung;
  @JsonProperty("hoa_hong_2pct")      private BigDecimal hoaHong2pct;
  @JsonProperty("ngay_dang_ky")       private LocalDate ngayDangKy;
  @JsonProperty("ghi_chu")            private String ghiChu;
  @JsonProperty("ten_hien_thi")       private String tenHienThi;
}
