package com.ras.domain.payroll;


import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name="nv_bang_luong_thang",
       uniqueConstraints = @UniqueConstraint(name="uk_nv_thang", columnNames = {"ky_luong_id","nhan_vien_id"}))
public class NvBangLuongThang {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="ky_luong_id", nullable=false)
    private Long kyLuongId;

    @Column(name="nhan_vien_id", nullable=false)
    private Long nhanVienId;

    @Column(name="luong_cung", precision=12, scale=0)
    private BigDecimal luongCung;

    @Column(name="tong_hoa_hong", precision=12, scale=0)
    private BigDecimal tongHoaHong;

    @Column(name="tong_thuong", precision=12, scale=0)
    private BigDecimal tongThuong;

    @Column(name="tong_truc", precision=12, scale=0)
    private BigDecimal tongTruc;

    @Column(name="tong_phu_cap_khac", precision=12, scale=0)
    private BigDecimal tongPhuCapKhac;

    @Column(name="tong_phat", precision=12, scale=0)
    private BigDecimal tongPhat;

    @Column(name="tong_luong", precision=12, scale=0)
    private BigDecimal tongLuong;

    @Column(name="ghi_chu")
    private String ghiChu;

    @Column(name="tao_luc", insertable=false, updatable=false)
    private OffsetDateTime taoLuc;

    // getters/setters...
    public Long getId() { return id; }
    public Long getKyLuongId() { return kyLuongId; }
    public void setKyLuongId(Long kyLuongId) { this.kyLuongId = kyLuongId; }
    public Long getNhanVienId() { return nhanVienId; }
    public void setNhanVienId(Long nhanVienId) { this.nhanVienId = nhanVienId; }
    public BigDecimal getLuongCung() { return luongCung; }
    public void setLuongCung(BigDecimal luongCung) { this.luongCung = luongCung; }
    public BigDecimal getTongHoaHong() { return tongHoaHong; }
    public void setTongHoaHong(BigDecimal tongHoaHong) { this.tongHoaHong = tongHoaHong; }
    public BigDecimal getTongThuong() { return tongThuong; }
    public void setTongThuong(BigDecimal tongThuong) { this.tongThuong = tongThuong; }
    public BigDecimal getTongTruc() { return tongTruc; }
    public void setTongTruc(BigDecimal tongTruc) { this.tongTruc = tongTruc; }
    public BigDecimal getTongPhuCapKhac() { return tongPhuCapKhac; }
    public void setTongPhuCapKhac(BigDecimal tongPhuCapKhac) { this.tongPhuCapKhac = tongPhuCapKhac; }
    public BigDecimal getTongPhat() { return tongPhat; }
    public void setTongPhat(BigDecimal tongPhat) { this.tongPhat = tongPhat; }
    public BigDecimal getTongLuong() { return tongLuong; }
    public void setTongLuong(BigDecimal tongLuong) { this.tongLuong = tongLuong; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}

