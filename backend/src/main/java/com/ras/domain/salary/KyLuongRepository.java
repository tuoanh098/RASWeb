package com.ras.domain.salary;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface KyLuongRepository extends JpaRepository<KyLuong, Long> {
  Optional<KyLuong> findByNamThang(String thang);
}
