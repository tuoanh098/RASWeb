package com.ras.domain.enroll;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByHocVienIdOrderByNgayDangKyDesc(Long hocVienId);
    @Query("select count(e.id) from Enrollment e where function('date_format', e.ngayDangKy, '%Y-%m') = :ym")
    long countByMonth(@Param("ym") String ym);
    @Query("select coalesce(sum(e.hocPhiApDung),0) from Enrollment e where function('date_format', e.ngayDangKy, '%Y-%m') = :ym")
    BigDecimal sumTuitionByMonth(@Param("ym") String ym);
}
