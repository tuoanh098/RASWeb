package com.ras.domain.course;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BangGiaHocPhiMucRepository extends JpaRepository<BangGiaHocPhiMuc, Long> {

    @Query("""
      select m from BangGiaHocPhiMuc m
      join BangGiaHocPhi h on h.id = m.bangGiaId
      where m.khoaHocId = :courseId
        and h.trangThai = 'ap_dung'
        and (:cnId is null or m.chiNhanhId = :cnId or m.chiNhanhId is null)
      order by case when m.chiNhanhId is null then 1 else 0 end, m.id desc
    """)
    List<BangGiaHocPhiMuc> findAppliedForCourse(@Param("courseId") Long courseId,
                                                @Param("cnId") Long chiNhanhId);
}
