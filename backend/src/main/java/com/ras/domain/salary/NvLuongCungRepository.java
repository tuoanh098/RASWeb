package com.ras.domain.salary;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NvLuongCungRepository extends JpaRepository<NvLuongCung, Long> {

    // Lấy tất cả lương cứng của 1 NV trong 1 kỳ (mới → cũ theo hieu_luc_tu)
    @Query(value = """
        SELECT * FROM nv_luong_cung
        WHERE ky_luong_id = :kyLuongId AND nhan_vien_id = :nhanVienId
        ORDER BY hieu_luc_tu DESC
    """, nativeQuery = true)
    List<NvLuongCung> findAllByKyLuongIdAndNhanVienId(
            @Param("kyLuongId") Long kyLuongId,
            @Param("nhanVienId") Long nhanVienId
    );

    // Bản ghi mới nhất theo hiệu lực
    @Query(value = """
        SELECT * FROM nv_luong_cung
        WHERE ky_luong_id = :kyLuongId AND nhan_vien_id = :nhanVienId
        ORDER BY hieu_luc_tu DESC
        LIMIT 1
    """, nativeQuery = true)
    Optional<NvLuongCung> findTopByKyLuongIdAndNhanVienIdOrderByHieuLucTuDesc(
            @Param("kyLuongId") Long kyLuongId,
            @Param("nhanVienId") Long nhanVienId
    );
}
