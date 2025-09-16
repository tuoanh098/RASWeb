package com.ras.domain.branch;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiNhanhRepository extends JpaRepository<ChiNhanh, Long> {

  @Query("""
      select c from ChiNhanh c
      where (:activeOnly is null or c.hoatDong = :activeOnly)
        and (:q is null
             or lower(c.ten) like lower(concat('%', :q, '%'))
             or lower(c.ma)  like lower(concat('%', :q, '%'))
             or lower(c.diaChi) like lower(concat('%', :q, '%'))
        )
      order by c.ten asc
      """)
  List<ChiNhanh> search(
      @Param("q") String q,
      @Param("activeOnly") Boolean activeOnly,
      Pageable pageable
  );

  List<ChiNhanh> findByHoatDongTrueOrderByTenAsc();
}
