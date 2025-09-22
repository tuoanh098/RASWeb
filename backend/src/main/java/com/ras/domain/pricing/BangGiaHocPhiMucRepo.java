package com.ras.domain.pricing;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BangGiaHocPhiMucRepo extends JpaRepository<BangGiaHocPhiMuc, Long> {

  // Tìm một dòng khớp theo khóa học / giai đoạn / cấp độ / số buổi
  // Chi nhánh: chấp nhận NULL (áp dụng mọi CN) hoặc CSV có chứa chi_nhanh_id (FIND_IN_SET)
  @Query(value = """
      SELECT * FROM bang_gia_hoc_phi_muc
      WHERE khoa_hoc_id = :khoaHocId
        AND giai_doan = :giaiDoan
        AND cap_do = :capDo
        AND so_buoi_khoa = :soBuoi
        AND (chi_nhanh IS NULL OR FIND_IN_SET(:chiNhanhId, chi_nhanh))
      LIMIT 1
      """, nativeQuery = true)
  Optional<BangGiaHocPhiMuc> findMatch(
      @Param("khoaHocId") Long khoaHocId,
      @Param("chiNhanhId") String chiNhanhId, // truyền "6" hoặc "7" (String)
      @Param("giaiDoan") String giaiDoan,
      @Param("capDo") String capDo,
      @Param("soBuoi") Integer soBuoi
  );
}
