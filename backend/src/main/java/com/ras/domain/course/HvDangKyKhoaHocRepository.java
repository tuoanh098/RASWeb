package com.ras.domain.course;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HvDangKyKhoaHocRepository extends JpaRepository<HvDangKyKhoaHoc, Long> {

    @Query("""
      select d from HvDangKyKhoaHoc d
      where d.hocVienId = :hvId
      order by d.ngayDangKy desc, d.id desc
    """)
    List<HvDangKyKhoaHoc> findByHocVien(@Param("hvId") Long hocVienId);

    @Query("""
      select count(d) from HvDangKyKhoaHoc d
      where d.ngayDangKy between :start and :end
    """)
    Long countByMonth(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("""
      select d from HvDangKyKhoaHoc d
      where d.ngayDangKy between :start and :end
      order by d.ngayDangKy desc, d.id desc
    """)
    List<HvDangKyKhoaHoc> findAllByMonth(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
