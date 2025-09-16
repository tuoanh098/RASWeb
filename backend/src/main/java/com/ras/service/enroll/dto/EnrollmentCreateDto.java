package com.ras.service.enroll.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EnrollmentCreateDto {
  @JsonProperty("hoc_vien_id")        private Long hocVienId;
  @JsonProperty("khoa_hoc_mau_id")    private Long khoaHocMauId;
  @JsonProperty("nhan_vien_tu_van_id")private Long nhanVienTuVanId;
  @JsonProperty("giao_vien_id")       private Long giaoVienId;
  @JsonProperty("chi_nhanh_id")       private Long chiNhanhId;
  @JsonProperty("hoc_phi_ap_dung")    private BigDecimal hocPhiApDung;
  @JsonProperty("ngay_dang_ky")       private LocalDate ngayDangKy;
  @JsonProperty("ghi_chu")            private String ghiChu;
}
