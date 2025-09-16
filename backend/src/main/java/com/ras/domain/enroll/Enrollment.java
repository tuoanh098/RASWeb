package com.ras.domain.enroll;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dang_ky_khoa_hoc")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hoc_vien_id", nullable = false)
    private Long hocVienId;

    @Column(name = "khoa_hoc_mau_id", nullable = false)
    private Long khoaHocMauId;

    @Column(name = "giao_vien_id")
    private Long giaoVienId;

    @Column(name = "nhan_vien_tu_van_id")
    private Long nhanVienTuVanId;

    @Column(name = "chi_nhanh_id")
    private Long chiNhanhId;

    @Column(name = "hoc_phi_ap_dung", nullable = false)
    private BigDecimal hocPhiApDung = BigDecimal.ZERO;

    @Column(name = "ngay_dang_ky", nullable = false)
    private LocalDate ngayDangKy;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @Column(name = "tao_luc")
    private LocalDateTime taoLuc;

    // ===== getters/setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getHocVienId() { return hocVienId; }
    public void setHocVienId(Long hocVienId) { this.hocVienId = hocVienId; }

    public Long getKhoaHocMauId() { return khoaHocMauId; }
    public void setKhoaHocMauId(Long khoaHocMauId) { this.khoaHocMauId = khoaHocMauId; }

    public Long getGiaoVienId() { return giaoVienId; }
    public void setGiaoVienId(Long giaoVienId) { this.giaoVienId = giaoVienId; }

    public Long getNhanVienTuVanId() { return nhanVienTuVanId; }
    public void setNhanVienTuVanId(Long nhanVienTuVanId) { this.nhanVienTuVanId = nhanVienTuVanId; }

    public Long getChiNhanhId() { return chiNhanhId; }
    public void setChiNhanhId(Long chiNhanhId) { this.chiNhanhId = chiNhanhId; }

    public BigDecimal getHocPhiApDung() { return hocPhiApDung; }
    public void setHocPhiApDung(BigDecimal hocPhiApDung) { this.hocPhiApDung = hocPhiApDung; }

    public LocalDate getNgayDangKy() { return ngayDangKy; }
    public void setNgayDangKy(LocalDate ngayDangKy) { this.ngayDangKy = ngayDangKy; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public LocalDateTime getTaoLuc() { return taoLuc; }
    public void setTaoLuc(LocalDateTime taoLuc) { this.taoLuc = taoLuc; }
}
