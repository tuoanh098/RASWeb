package com.ras.domain.enroll;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface DangKyLopRepository extends JpaRepository<DangKyLop, Long> {

  List<DangKyLop> findAllByHocVienIdOrderByNgayDangKyDesc(Long hocVienId);

  @Query("""
      select dk from DangKyLop dk
      where dk.ngayDangKy between :from and :to
      order by dk.ngayDangKy desc
      """)
  List<DangKyLop> findInMonth(LocalDate from, LocalDate to);

  @Query("""
      select count(dk) from DangKyLop dk
      where dk.ngayDangKy between :from and :to
      """)
  long countInMonth(LocalDate from, LocalDate to);
}
