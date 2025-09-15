package com.ras.domain.salary;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface GvDonGiaDayRuleRepository extends JpaRepository<GvDonGiaDayRule, Long> {

  @Query("""
     SELECT r FROM GvDonGiaDayRule r
      WHERE (:monHocId IS NULL OR r.monHocId=:monHocId)
        AND (:capDoId IS NULL OR r.capDoId=:capDoId)
        AND (:loaiLop IS NULL OR r.loaiLop=:loaiLop)
        AND (:thoiLuongPhut IS NULL OR r.thoiLuongPhut=:thoiLuongPhut)
        AND (:hinhThuc IS NULL OR r.hinhThuc=:hinhThuc)
        AND (:tuNgay IS NULL OR r.hieuLucTu<=:tuNgay)
        AND (:denNgay IS NULL OR r.hieuLucDen IS NULL OR r.hieuLucDen>=:denNgay)
  """)
  Page<GvDonGiaDayRule> search(@Param("monHocId") Long monHocId,
                               @Param("capDoId") Long capDoId,
                               @Param("loaiLop") String loaiLop,
                               @Param("thoiLuongPhut") Short thoiLuongPhut,
                               @Param("hinhThuc") String hinhThuc,
                               @Param("tuNgay") LocalDate tuNgay,
                               @Param("denNgay") LocalDate denNgay,
                               Pageable pageable);

  @Query("""
     SELECT r FROM GvDonGiaDayRule r
      WHERE (:monHocId IS NULL OR r.monHocId=:monHocId)
        AND (:loaiLop IS NULL OR r.loaiLop=:loaiLop)
        AND (:thoiLuongPhut IS NULL OR r.thoiLuongPhut=:thoiLuongPhut)
        AND (:hinhThuc IS NULL OR r.hinhThuc=:hinhThuc)
        AND r.hieuLucTu <= :ngay
        AND (r.hieuLucDen IS NULL OR r.hieuLucDen >= :ngay)
      ORDER BY r.uuTien ASC, r.hieuLucTu DESC
  """)
  List<GvDonGiaDayRule> findBest(@Param("monHocId") Long monHocId,
                                 @Param("loaiLop") String loaiLop,
                                 @Param("thoiLuongPhut") Short thoiLuongPhut,
                                 @Param("hinhThuc") String hinhThuc,
                                 @Param("ngay") LocalDate ngay,
                                 Pageable pageable);
}
