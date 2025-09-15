package com.ras.domain.salary;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface GvThanhToanBuoiRepository extends JpaRepository<GvThanhToanBuoi, Long> {
  @Query("""
   SELECT b FROM GvThanhToanBuoi b
   WHERE (:kyLuongId IS NULL OR b.kyLuongId=:kyLuongId)
     AND (:chiNhanhId IS NULL OR b.chiNhanhId=:chiNhanhId)
     AND (:nhanVienId IS NULL OR b.nhanVienId=:nhanVienId)
  """)
  Page<GvThanhToanBuoi> search(@Param("kyLuongId") Long kyLuongId,
                               @Param("chiNhanhId") Long chiNhanhId,
                               @Param("nhanVienId") Long nhanVienId,
                               Pageable pageable);
}
