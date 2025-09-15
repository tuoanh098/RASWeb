package com.ras.domain.salary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface NvKyLuongRepository extends JpaRepository<NvKyLuong, Long> {

  // nv_ky_luong.nam_thang lưu dạng "YYYY-MM"
  @Query("""
    select k from NvKyLuong k
    where k.namThang = :namThang
  """)
  Optional<NvKyLuong> findByNamThang(@Param("namThang") String namThang);
}

