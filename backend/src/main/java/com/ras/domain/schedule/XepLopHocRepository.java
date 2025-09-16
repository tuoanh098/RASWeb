package com.ras.domain.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface XepLopHocRepository extends JpaRepository<XepLopHoc, Long> {

  @Query("""
     select x from XepLopHoc x
     where x.ngay between :from and :to
       and (:branchId is null or x.chiNhanhId = :branchId)
       and (:teacherId is null or x.giaoVienId = :teacherId)
       and (:studentId is null or x.hocVienId = :studentId)
     order by x.ngay asc, x.batDauLuc asc
  """)
  List<XepLopHoc> findInRange(LocalDate from, LocalDate to,
                              Long branchId, Long teacherId, Long studentId);

  List<XepLopHoc> findByCoDinhGroupIdAndNgayGreaterThanEqualOrderByNgayAsc(Long groupId, LocalDate from);
}
