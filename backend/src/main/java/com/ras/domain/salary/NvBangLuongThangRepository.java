package com.ras.domain.salary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NvBangLuongThangRepository extends JpaRepository<NvBangLuongThang, Long> {

    @Query("SELECT b FROM NvBangLuongThang b WHERE b.kyLuongId = :kyLuongId")
    List<NvBangLuongThang> findByKyLuong(Long kyLuongId);

    @Query("SELECT SUM(b.tongLuong) FROM NvBangLuongThang b WHERE b.kyLuongId = :kyLuongId")
    Double sumTongLuongByKyLuong(Long kyLuongId);
}
