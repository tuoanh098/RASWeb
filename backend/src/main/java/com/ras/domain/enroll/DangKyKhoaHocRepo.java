package com.ras.domain.enroll;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface DangKyKhoaHocRepo extends JpaRepository<DangKyKhoaHoc, Long> {

  interface SummaryRow {
    Long getTotal();
    BigDecimal getTotal_tuition();
    BigDecimal getTotal_commission();
  }

  @Query(value = """
      SELECT COUNT(*)          AS total,
             COALESCE(SUM(hoc_phi_ap_dung),0) AS total_tuition,
             COALESCE(SUM(hoa_hong_2pct),0)   AS total_commission
      FROM dang_ky_khoa_hoc
      WHERE DATE_FORMAT(ngay_dang_ky, '%Y-%m') = :ym
      """, nativeQuery = true)
  SummaryRow summaryByMonth(@Param("ym") String ym);
}
