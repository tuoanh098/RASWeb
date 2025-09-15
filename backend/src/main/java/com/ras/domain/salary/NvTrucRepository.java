package com.ras.domain.salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface NvTrucRepository extends JpaRepository<NvTruc, Long> {

    List<NvTruc> findByKyLuongIdAndNhanVienId(Long kyLuongId, Long nhanVienId);

    List<NvTruc> findByNhanVienIdAndNgayBetween(Long nhanVienId, LocalDate start, LocalDate end);

    @Query("select coalesce(sum(t.soTien), 0) from NvTruc t where t.kyLuongId = :kyLuongId and t.nhanVienId = :nhanVienId")
    BigDecimal sumSoTienByKyAndNv(Long kyLuongId, Long nhanVienId);
}
