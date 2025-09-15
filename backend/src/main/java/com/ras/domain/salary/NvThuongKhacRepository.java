package com.ras.domain.salary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface NvThuongKhacRepository extends JpaRepository<NvThuongKhac, Long> {

    List<NvThuongKhac> findByKyLuongIdAndNhanVienId(Long kyLuongId, Long nhanVienId);

    @Query("select coalesce(sum(t.soTien), 0) from NvThuongKhac t where t.kyLuongId = :kyLuongId and t.nhanVienId = :nhanVienId")
    BigDecimal sumThuongByKyAndNv(Long kyLuongId, Long nhanVienId);
}
