package com.ras.domain.salary;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NvHoaHongChotLopRepository extends JpaRepository<NvHoaHongChotLop, Long> {

    List<NvHoaHongChotLop> findByKyLuongIdAndNhanVienId(Long kyLuongId, Long nhanVienId);
}