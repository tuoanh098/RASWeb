package com.ras.domain.salary;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NvPhatKyLuatRepository extends JpaRepository<NvPhatKyLuat, Long> {
    Page<NvPhatKyLuat> findByKyLuongIdAndNhanVienId(Long kyLuongId, Long nhanVienId, Pageable pageable);
    List<NvPhatKyLuat> findByKyLuongId(Long kyLuongId);
}
