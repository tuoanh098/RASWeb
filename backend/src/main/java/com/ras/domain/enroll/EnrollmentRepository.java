package com.ras.domain.enroll;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ras.service.enroll.EnrollmentRow;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByHocVienIdOrderByNgayDangKyDesc(Long hocVienId);
    @Query("select count(e.id) from Enrollment e where function('date_format', e.ngayDangKy, '%Y-%m') = :ym")
    long countByMonth(@Param("ym") String ym);
    @Query("select coalesce(sum(e.hocPhiApDung),0) from Enrollment e where function('date_format', e.ngayDangKy, '%Y-%m') = :ym")
    BigDecimal sumTuitionByMonth(@Param("ym") String ym);
        @Query(value = """
        SELECT  d.id                                AS id,
                DATE_FORMAT(d.ngay_dang_ky,'%Y-%m-%d') AS ngayDangKy,
                d.hoc_vien_id                     AS hocVienId,
                hv.ho_ten                         AS hocVienTen,
                d.khoa_hoc_mau_id                 AS khoaHocMauId,
                khm.mo_ta                         AS tenHienThi,
                COALESCE(d.hoc_phi_ap_dung,0)     AS hocPhiApDung,
                d.giao_vien_id                    AS giaoVienId,
                gv.ho_ten                         AS giaoVienTen,
                d.nhan_vien_tu_van_id             AS nhanVienTuVanId,
                nv.ho_ten                         AS nhanVienTuVanTen,
                d.chi_nhanh_id                    AS chiNhanhId,
                cn.ten                            AS chiNhanhTen,
                ROUND(COALESCE(d.hoc_phi_ap_dung,0)*0.02,0) AS hoaHong2pct
        FROM dang_ky_khoa_hoc d
        LEFT JOIN hoc_vien    hv ON hv.id = d.hoc_vien_id
        LEFT JOIN nhan_vien   gv ON gv.id = d.giao_vien_id
        LEFT JOIN nhan_vien   nv ON nv.id = d.nhan_vien_tu_van_id
        LEFT JOIN khoa_hoc_mau khm ON khm.id = d.khoa_hoc_mau_id
        LEFT JOIN chi_nhanh    cn ON cn.id = d.chi_nhanh_id
        WHERE d.hoc_vien_id = :hocVienId
        ORDER BY d.id DESC
        """, nativeQuery = true)
    List<EnrollmentRow> findDetailByHocVienId(@Param("hocVienId") Long hocVienId);
}
