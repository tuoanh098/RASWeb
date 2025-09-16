package com.ras.domain.salary;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface NvKyLuongRepository extends JpaRepository<NvKyLuong, Long> {

    Optional<NvKyLuong> findByNamThang(String namThang);

    // Projection cho JSON trả về có key "nam_thang" đúng như UI đang dùng
    public interface PeriodView {
        Long getId();
        String getNam_thang(); // giữ đúng tên để JSON là "nam_thang"
    }

    // Lấy danh sách kỳ lương giảm dần
    @Query(value = "SELECT id, nam_thang AS nam_thang FROM ky_luong ORDER BY nam_thang DESC", nativeQuery = true)
    List<PeriodView> findAllPeriodsDesc();

    // Resolve id từ yyyy-MM (vd 2025-09)
    @Query(value = "SELECT id FROM ky_luong WHERE nam_thang = :yyyyMM LIMIT 1", nativeQuery = true)
    Optional<Long> resolveIdByYYYYMM(@Param("yyyyMM") String yyyyMM);
}
