package com.ras.domain.salary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface NvPhatKyLuatRepository extends JpaRepository<NvPhatKyLuat, Long> {

    List<NvPhatKyLuat> findByKyLuongIdAndNhanVienId(Long kyLuongId, Long nhanVienId);

    @Query("select coalesce(sum(p.soTienPhat), 0) from NvPhatKyLuat p where p.kyLuongId = :kyLuongId and p.nhanVienId = :nhanVienId")
    BigDecimal sumPhatByKyAndNv(Long kyLuongId, Long nhanVienId);
}
