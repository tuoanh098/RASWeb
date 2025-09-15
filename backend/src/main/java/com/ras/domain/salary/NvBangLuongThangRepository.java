package com.ras.domain.salary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface NvBangLuongThangRepository extends JpaRepository<NvBangLuongThang, Long> {

    @Query("SELECT b FROM NvBangLuongThang b WHERE b.kyLuongId = :kyLuongId")
    List<NvBangLuongThang> findByKyLuong(Long kyLuongId);

    @Query("SELECT b FROM NvBangLuongThang b WHERE b.kyLuongId = :kyLuongId AND b.nhanVienId = :nhanVienId")
    Optional<NvBangLuongThang> findOneByKyAndNv(Long kyLuongId, Long nhanVienId);

    // Bản cũ (Double) nếu nơi khác còn dùng — cứ để lại
    @Query("SELECT SUM(b.tongLuong) FROM NvBangLuongThang b WHERE b.kyLuongId = :kyLuongId")
    Double sumTongLuongByKyLuong(Long kyLuongId);

    // Bản mới (khuyến nghị): BigDecimal + COALESCE để không null
    @Query("SELECT COALESCE(SUM(b.tongLuong), 0) FROM NvBangLuongThang b WHERE b.kyLuongId = :kyLuongId")
    BigDecimal sumTongLuongByKyLuongBD(Long kyLuongId);
}
