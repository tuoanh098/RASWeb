package com.ras.domain.payroll;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name="nv_hoa_hong_chot_lop",
       indexes = { @Index(name="idx_hh_ky_nv", columnList="ky_luong_id,nhan_vien_id") })
public class NvHoaHongChotLop {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="ky_luong_id", nullable=false)
    private Long kyLuongId;

    @Column(name="chi_nhanh_id")
    private Long chiNhanhId;

    @Column(name="nhan_vien_id", nullable=false)
    private Long nhanVienId;

    @Column(name="hoc_vien_id", nullable=false)
    private Long hocVienId;

    @Column(name="dang_ky_id")
    private Long dangKyId;

    @Column(name="khoa_hoc_id")
    private Long khoaHocId;

    @Column(name="hoc_phi_ap_dung", precision=38, scale=2, nullable=false)
    private BigDecimal hocPhiApDung;

    @Column(name="ty_le_pct", precision=38, scale=2, nullable=false)
    private BigDecimal tyLePct;

    @Column(name="so_tien", precision=38, scale=2, nullable=false)
    private BigDecimal soTien;

    @Column(name="ghi_chu")
    private String ghiChu;

    @Column(name="tao_luc", insertable=false, updatable=false)
    private OffsetDateTime taoLuc;

    // getters/setters...
    public Long getId() { return id; }
    public Long getKyLuongId() { return kyLuongId; }
    public void setKyLuongId(Long kyLuongId) { this.kyLuongId = kyLuongId; }
    public Long getChiNhanhId() { return chiNhanhId; }
    public void setChiNhanhId(Long chiNhanhId) { this.chiNhanhId = chiNhanhId; }
    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }
    public Long getHocVienId() { return hocVienId; }
    public void setHocVienId(Long hocVienId) { this.hocVienId = hocVienId; }
    public Long getDangKyId() { return dangKyId; }
    public void setDangKyId(Long dangKyId) { this.dangKyId = dangKyId; }
    public Long getKhoaHocId() { return khoaHocId; }
    public void setKhoaHocId(Long khoaHocId) { this.khoaHocId = khoaHocId; }
    public BigDecimal getHocPhiApDung() { return hocPhiApDung; }
    public void setHocPhiApDung(BigDecimal hocPhiApDung) { this.hocPhiApDung = hocPhiApDung; }
    public BigDecimal getTyLePct() { return tyLePct; }
    public void setTyLePct(BigDecimal tyLePct) { this.tyLePct = tyLePct; }
    public BigDecimal getSoTien() { return soTien; }
    public void setSoTien(BigDecimal soTien) { this.soTien = soTien; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}

