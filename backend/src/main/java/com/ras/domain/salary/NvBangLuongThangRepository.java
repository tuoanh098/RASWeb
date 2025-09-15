package com.ras.domain.salary;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface NvBangLuongThangRepository extends JpaRepository<NvBangLuongThang, Long> {
  @Query("SELECT n FROM NvBangLuongThang n WHERE (:kyLuongId IS NULL OR n.kyLuongId=:kyLuongId)")
  Page<NvBangLuongThang> byKyLuong(@Param("kyLuongId") Long kyLuongId, Pageable p);
}
