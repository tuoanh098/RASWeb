package com.ras.domain.salary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface NvHoaHongChotLopRepository extends JpaRepository<NvHoaHongChotLop, Long> {

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Transactional
  @Query(value = """
      CALL sp_nv_hoa_hong_after_enroll(
        :pNhanVienId,:pHocVienId,:pDangKyId,:pKhoaHocMauId,:pChiNhanhId,
        :pHocPhiApDung,:pTyLePct,:pTaoLuc,:pGhiChu
      )
      """, nativeQuery = true)
  void callProcAfterEnroll(
      @Param("pNhanVienId") Long nhanVienId,
      @Param("pHocVienId") Long hocVienId,
      @Param("pDangKyId") Long dangKyId,
      @Param("pKhoaHocMauId") Long khoaHocMauId,
      @Param("pChiNhanhId") Long chiNhanhId,
      @Param("pHocPhiApDung") BigDecimal hocPhiApDung,
      @Param("pTyLePct") BigDecimal tyLePct,
      @Param("pTaoLuc") LocalDateTime taoLuc,
      @Param("pGhiChu") String ghiChu
  );
    List<NvHoaHongChotLop> findByKyLuongIdAndNhanVienId(Long kyLuongId, Long nhanVienId);
}