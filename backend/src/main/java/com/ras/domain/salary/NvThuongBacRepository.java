package com.ras.domain.salary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface NvThuongBacRepository extends JpaRepository<NvThuongBac, Long> {

    List<NvThuongBac> findByKyLuongIdAndNhanVienId(Long kyLuongId, Long nhanVienId);

    @Query("select coalesce(sum(t.mucThuong), 0) from NvThuongBac t where t.kyLuongId = :kyLuongId and t.nhanVienId = :nhanVienId")
    BigDecimal sumThuongByKyAndNv(Long kyLuongId, Long nhanVienId);
}
