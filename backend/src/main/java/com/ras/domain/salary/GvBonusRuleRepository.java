package com.ras.domain.salary;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface GvBonusRuleRepository extends JpaRepository<GvBonusRule, Long> {
  @Query("""
     SELECT r FROM GvBonusRule r
      WHERE (:loaiBuoi IS NULL OR r.loaiBuoi=:loaiBuoi)
        AND (:monHocId IS NULL OR r.monHocId=:monHocId)
        AND (:thoiLuongPhut IS NULL OR r.thoiLuongPhut=:thoiLuongPhut)
        AND (:tuNgay IS NULL OR r.hieuLucTu<=:tuNgay)
        AND (:denNgay IS NULL OR r.hieuLucDen IS NULL OR r.hieuLucDen>=:denNgay)
  """)
  Page<GvBonusRule> search(@Param("loaiBuoi") String loaiBuoi,
                           @Param("monHocId") Long monHocId,
                           @Param("thoiLuongPhut") Short thoiLuongPhut,
                           @Param("tuNgay") LocalDate tuNgay,
                           @Param("denNgay") LocalDate denNgay,
                           Pageable pageable);

  @Query("""
     SELECT r FROM GvBonusRule r
      WHERE (:loaiBuoi IS NULL OR r.loaiBuoi=:loaiBuoi)
        AND (:monHocId IS NULL OR r.monHocId=:monHocId)
        AND (:thoiLuongPhut IS NULL OR r.thoiLuongPhut=:thoiLuongPhut)
        AND r.hieuLucTu <= :ngay
        AND (r.hieuLucDen IS NULL OR r.hieuLucDen >= :ngay)
      ORDER BY r.uuTien ASC, r.hieuLucTu DESC
  """)
  List<GvBonusRule> findBest(@Param("loaiBuoi") String loaiBuoi,
                             @Param("monHocId") Long monHocId,
                             @Param("thoiLuongPhut") Short thoiLuongPhut,
                             @Param("ngay") LocalDate ngay,
                             Pageable pageable);
}
