package com.ras.domain.duty;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface NvLichTrucRepository
    extends JpaRepository<NvLichTruc, Long>, JpaSpecificationExecutor<NvLichTruc> {

  boolean existsByNhanVienIdAndNgayAndChiNhanhId(Long nhanVienId, java.time.LocalDate ngay, Long chiNhanhId);
}
