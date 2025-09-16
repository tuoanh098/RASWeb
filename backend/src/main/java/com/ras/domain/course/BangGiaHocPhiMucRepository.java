package com.ras.domain.course;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface BangGiaHocPhiMucRepository extends JpaRepository<BangGiaHocPhiMuc, Long> {

  // Lấy 1 dòng phù hợp chi_nhanh + khóa học (mới nhất)
  @Query(value = """
    SELECT * FROM bang_gia_hoc_phi_muc
    WHERE chi_nhanh_id = :branchId AND khoa_hoc_id = :courseId
    ORDER BY id DESC
    LIMIT 1
    """, nativeQuery = true)
  Optional<BangGiaHocPhiMuc> findOne(@Param("branchId") Long branchId,
                                     @Param("courseId") Long courseId);

  // Tính giá (ưu tiên hoc_phi_khoa; nếu null => buổi * số_buổi; nếu vẫn null => buổi_tĩnh * số_buổi)
  @Query(value = """
    SELECT COALESCE(hoc_phi_khoa,
                    hoc_phi_buoi * IFNULL(so_buoi_khoa,0),
                    hoc_phi_buoi_tinh * IFNULL(so_buoi_khoa,0),
                    0) AS price
    FROM bang_gia_hoc_phi_muc
    WHERE chi_nhanh_id = :branchId AND khoa_hoc_id = :courseId
    ORDER BY id DESC
    LIMIT 1
    """, nativeQuery = true)
  BigDecimal computePrice(@Param("branchId") Long branchId,
                          @Param("courseId") Long courseId);
  Optional<BangGiaHocPhiMuc> findTopByChiNhanhIdAndKhoaHocIdOrderByIdDesc(Long chiNhanhId, Long khoaHocId);

}
