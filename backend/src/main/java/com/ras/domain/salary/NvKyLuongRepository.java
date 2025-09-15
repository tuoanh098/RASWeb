package com.ras.domain.salary;

import org.springframework.data.jpa.repository.Query;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
public interface NvKyLuongRepository extends CrudRepository<NvKyLuong, Long> {
  // Projection interface khớp JSON FE cần
  public interface PeriodView {
    Long getId();
    // column alias nam_thang => Jackson trả "nam_thang"
    String getNam_thang();
  }

  @Query(
    value = "SELECT id, nam_thang AS nam_thang FROM ky_luong ORDER BY nam_thang DESC",
    nativeQuery = true
  )
  List<PeriodView> findAllPeriodsDesc();
  Optional<NvKyLuong> findByNamThang(@Param("namThang") String namThang);
}

