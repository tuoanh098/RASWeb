package com.ras.domain.salary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface NvPhuCapKhacRepository extends JpaRepository<NvPhuCapKhac, Long> {

    List<NvPhuCapKhac> findByKyLuongIdAndNhanVienId(Long kyLuongId, Long nhanVienId);

    @Query("select coalesce(sum(p.soTien), 0) from NvPhuCapKhac p where p.kyLuongId = :kyLuongId and p.nhanVienId = :nhanVienId")
    BigDecimal sumSoTienByKyAndNv(Long kyLuongId, Long nhanVienId);
}
