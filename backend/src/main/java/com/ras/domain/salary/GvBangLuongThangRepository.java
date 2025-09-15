package com.ras.domain.salary;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface GvBangLuongThangRepository extends JpaRepository<GvBangLuongThang, Long> {
  @Query("SELECT g FROM GvBangLuongThang g WHERE (:kyLuongId IS NULL OR g.kyLuongId=:kyLuongId)")
  Page<GvBangLuongThang> byKyLuong(@Param("kyLuongId") Long kyLuongId, Pageable p);
}
