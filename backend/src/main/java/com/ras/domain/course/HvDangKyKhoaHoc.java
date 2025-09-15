package com.ras.domain.course;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "hv_dang_ky_khoa_hoc",
       indexes = {
         @Index(name = "ix_hvdk_hoc_vien", columnList = "hoc_vien_id"),
         @Index(name = "ix_hvdk_khoa_hoc", columnList = "khoa_hoc_id"),
         @Index(name = "ix_hvdk_ngay_dang_ky", columnList = "ngay_dang_ky")
       })
public class HvDangKyKhoaHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Học viên
    @Column(name = "hoc_vien_id", nullable = false)
    private Long hocVienId;

    // Khóa học
    @Column(name = "khoa_hoc_id", nullable = false)
    private Long khoaHocId;

    // Ngày đăng ký
    @Column(name = "ngay_dang_ky", nullable = false)
    private LocalDate ngayDangKy;

    // Nhân viên tư vấn (ai chốt)
    @Column(name = "nv_tu_van_id")
    private Long nvTuVanId;

    // Lớp đã gán (nếu đã xếp lớp)
    @Column(name = "lop_hoc_id")
    private Long lopHocId;

    // Giáo viên phụ trách (nếu gán trực tiếp)
    @Column(name = "giao_vien_id")
    private Long giaoVienId;

    // Ghi chú
    @Column(name = "ghi_chu")
    private String ghiChu;

    // ===== Getters/Setters =====
    public Long getId() { return id; }
    public Long getHocVienId() { return hocVienId; }
    public void setHocVienId(Long hocVienId) { this.hocVienId = hocVienId; }
    public Long getKhoaHocId() { return khoaHocId; }
    public void setKhoaHocId(Long khoaHocId) { this.khoaHocId = khoaHocId; }
    public LocalDate getNgayDangKy() { return ngayDangKy; }
    public void setNgayDangKy(LocalDate ngayDangKy) { this.ngayDangKy = ngayDangKy; }
    public Long getNvTuVanId() { return nvTuVanId; }
    public void setNvTuVanId(Long nvTuVanId) { this.nvTuVanId = nvTuVanId; }
    public Long getLopHocId() { return lopHocId; }
    public void setLopHocId(Long lopHocId) { this.lopHocId = lopHocId; }
    public Long getGiaoVienId() { return giaoVienId; }
    public void setGiaoVienId(Long giaoVienId) { this.giaoVienId = giaoVienId; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}
