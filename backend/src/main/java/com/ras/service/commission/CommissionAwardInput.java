package com.ras.service.commission;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class CommissionAwardInput {
  private Long dangKyId;
  private LocalDate ngayDangKy;
  private Long hocVienId;
  private Long chiNhanhId;
  private Long nhanVienTuVanId;
  private Long khoaHocMauId;
  private BigDecimal hocPhiApDung; // DECIMAL(12,0)
}
